import { prisma, withReconnect } from '../../config/database';
import { PasswordService } from '../../services/password.service';
import { TokenService, TokenPayload } from '../../services/token.service';
import { OtpService } from '../../services/otp.service';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../../utils/errors';
import { RegisterDTO, LoginDTO, VerifyOtpDTO, AuthResponse } from './auth.types';
import { Role } from '../../constants/roles';

export class AuthService {
  static async register(dto: RegisterDTO): Promise<AuthResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedPhone = dto.phone.trim();
    const existingUser = await withReconnect(() => prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone: normalizedPhone }],
      },
    }));

    if (existingUser) {
      throw new ConflictError('User with this email or phone already exists');
    }

    const passwordHash = await PasswordService.hash(dto.password);
    const requestedRoleName = (dto.roles && dto.roles[0]) ? dto.roles[0] : Role.RENTER;
    let roleRecord = await prisma.role.findUnique({ where: { name: requestedRoleName } });
    if (!roleRecord) {
      roleRecord = await prisma.role.findUnique({ where: { name: 'RENTER' } });
    }

    const nameParts = dto.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || undefined;

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
        roleId: roleRecord!.id,
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
        identityVerification: {
          create: {
            verificationStatus: 'PENDING',
          },
        },
      },
      include: {
        role: true,
        profile: true,
        identityVerification: true,
      },
    });

    // Send OTP to email via Gmail SMTP upon registration
    await OtpService.sendOtp(user.email);
    if (user.phone) {
      await OtpService.sendOtp(user.phone);
    }

    const fullName = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ') || user.email;
    const roleName = (user.role?.name || 'RENTER') as Role;
    const tokenPayload: TokenPayload = { userId: user.id, email: user.email, roles: [roleName] };
    const accessToken = TokenService.generateAccessToken(tokenPayload);
    const refreshToken = TokenService.generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        name: fullName,
        email: user.email,
        phone: user.phone,
        roles: [roleName],
        avatarUrl: user.profile?.profileImage || null,
        isPhoneVerified: user.identityVerification?.phoneOtpVerified || false,
        isEmailVerified: user.identityVerification?.emailVerified || false,
        isIdentityVerified: user.identityVerification?.nationalIdVerified || false,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async login(dto: LoginDTO): Promise<AuthResponse> {
    const normalizedInput = dto.emailOrPhone.trim().toLowerCase();
    const user = await withReconnect(() => prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedInput }, { phone: normalizedInput }],
      },
      include: {
        role: true,
        profile: true,
        identityVerification: true,
      },
    }));

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await PasswordService.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const fullName = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ') || user.email;
    const roleName = (user.role?.name || 'RENTER') as Role;
    const tokenPayload: TokenPayload = { userId: user.id, email: user.email, roles: [roleName] };
    const accessToken = TokenService.generateAccessToken(tokenPayload);
    const refreshToken = TokenService.generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        name: fullName,
        email: user.email,
        phone: user.phone,
        roles: [roleName],
        avatarUrl: user.profile?.profileImage || null,
        isPhoneVerified: user.identityVerification?.phoneOtpVerified || false,
        isEmailVerified: user.identityVerification?.emailVerified || false,
        isIdentityVerified: user.identityVerification?.nationalIdVerified || false,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async verifyPhoneOtp(dto: VerifyOtpDTO): Promise<{ success: boolean; message: string }> {
    const isVerified = await OtpService.verifyOtp(dto.phoneOrEmail, dto.code);
    if (!isVerified) {
      throw new BadRequestError('Invalid or expired OTP code');
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: dto.phoneOrEmail }, { email: dto.phoneOrEmail }],
      },
    });

    if (user) {
      await prisma.identityVerification.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          phoneOtpVerified: true,
          emailVerified: true,
        },
        update: {
          phoneOtpVerified: true,
          emailVerified: true,
        },
      });
    }

    return { success: true, message: 'Verification successfully completed' };
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = TokenService.verifyRefreshToken(refreshToken);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: { role: true },
      });

      if (!user) {
        throw new UnauthorizedError('User no longer exists');
      }

      const roleName = (user.role?.name || 'RENTER') as Role;
      const newTokenPayload: TokenPayload = { userId: user.id, email: user.email, roles: [roleName] };
      const newAccessToken = TokenService.generateAccessToken(newTokenPayload);
      const newRefreshToken = TokenService.generateRefreshToken(newTokenPayload);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  static async sendOtp(phoneOrEmail: string): Promise<{ message: string }> {
    await OtpService.sendOtp(phoneOrEmail);
    return { message: 'OTP sent successfully' };
  }
}


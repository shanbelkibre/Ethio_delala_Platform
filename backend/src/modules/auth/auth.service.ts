import crypto from 'crypto';
import { prisma, withReconnect } from '../../config/database';
import { redisClient } from '../../config/redis';
import { PasswordService } from '../../services/password.service';
import { TokenService, TokenPayload } from '../../services/token.service';
import { OtpService } from '../../services/otp.service';
import { EmailService } from '../../services/email.service';
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

    // Resolve full name and individual profile fields
    let firstName = dto.firstName?.trim();
    let middleName = dto.middleName?.trim() || undefined;
    let lastName = dto.lastName?.trim() || undefined;

    if (!firstName && dto.name) {
      const nameParts = dto.name.trim().split(' ');
      firstName = nameParts[0];
      if (nameParts.length === 2) {
        lastName = nameParts[1];
      } else if (nameParts.length >= 3) {
        middleName = nameParts[1];
        lastName = nameParts.slice(2).join(' ');
      }
    }

    if (!firstName) {
      firstName = 'User';
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
        roleId: roleRecord!.id,
        profile: {
          create: {
            firstName,
            middleName,
            lastName,
            gender: dto.gender || undefined,
            dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
            maritalStatus: dto.maritalStatus || undefined,
            profileImageUrl: dto.profileImageUrl || undefined,
            region: dto.region || undefined,
            zone: dto.zone || undefined,
            wereda: dto.wereda || undefined,
            kebele: dto.kebele || undefined,
          },
        },
        identityVerification: {
          create: {
            status: 'PENDING',
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
        avatarUrl: user.profile?.profileImageUrl || null,
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
        avatarUrl: user.profile?.profileImageUrl || null,
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

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await withReconnect(() =>
      prisma.user.findUnique({ where: { email: normalizedEmail } })
    );

    if (!user) {
      return { message: 'If an account exists with this email, a password reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetKey = `pwd-reset:${resetToken}`;
    const TTL_SECONDS = 15 * 60; // 15 minutes

    await redisClient.set(resetKey, user.id, TTL_SECONDS);

    const clientOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetLink = `${clientOrigin}/auth/reset-password?token=${resetToken}`;

    await EmailService.sendPasswordResetEmail(user.email, resetLink, resetToken);

    return { message: 'Password reset link has been sent to your email.' };
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const resetKey = `pwd-reset:${token}`;
    const userId = await redisClient.get(resetKey);

    if (!userId) {
      throw new BadRequestError('Invalid or expired password reset link or token');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const passwordHash = await PasswordService.hash(newPassword);

    await withReconnect(() =>
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      })
    );

    await redisClient.del(resetKey);

    return { message: 'Password has been reset successfully. You can now log in.' };
  }
}


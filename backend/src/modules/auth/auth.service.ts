import crypto from 'crypto';
import { prisma, withReconnect } from '../../config/database';
import { redisClient } from '../../config/redis';
import { PasswordService } from '../../services/password.service';
import { TokenService, TokenPayload } from '../../services/token.service';
import { OtpService } from '../../services/otp.service';
import { EmailService } from '../../services/email.service';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../../utils/errors';
import { RegisterDTO, LoginDTO, VerifyOtpDTO, AuthResponse, GoogleAuthDTO } from './auth.types';
import { Role } from '../../constants/roles';
import { logger } from '../../utils/logger';

export class AuthService {
  static async register(dto: RegisterDTO): Promise<AuthResponse> {
    const hasEmail = Boolean(dto.email && dto.email.trim());
    const hasPhone = Boolean(dto.phone && dto.phone.trim());

    if (!hasEmail && !hasPhone) {
      throw new BadRequestError('Either email or phone number is required');
    }

    const normalizedEmail = hasEmail
      ? dto.email!.trim().toLowerCase()
      : `${dto.phone!.replace(/[\s\-\(\)]/g, '').trim()}@phone.ethiodelala.local`;
    const normalizedPhone = hasPhone
      ? dto.phone!.replace(/[\s\-\(\)]/g, '').trim()
      : `EML-${Date.now().toString().slice(-8)}`;

    const existingUser = await withReconnect(() => prisma.user.findFirst({
      where: {
        OR: [
          hasEmail ? { email: normalizedEmail } : {},
          hasPhone ? { phone: normalizedPhone } : {},
        ].filter((c) => Object.keys(c).length > 0),
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

    // Send OTP according to registration method
    if (hasEmail) {
      await OtpService.sendOtp(user.email);
    }
    if (hasPhone) {
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

  static async forgotPassword(email: string): Promise<{ message: string; resetLink?: string }> {
    const normalizedInput = email.trim().toLowerCase();
    const user = await withReconnect(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ email: normalizedInput }, { phone: normalizedInput }],
        },
      })
    );

    if (!user) {
      return { message: 'If an account exists with this email, a password reset link has been sent.' };
    }

    // Business rule: Forgot password requires an email
    if (!user.email || user.email.includes('@phone.ethiodelala.')) {
      throw new BadRequestError('This account was registered with a phone number only. Please provide your email address to enable password recovery.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetKey = `pwd-reset:${resetToken}`;
    const TTL_SECONDS = 15 * 60; // 15 minutes

    await redisClient.set(resetKey, user.id, TTL_SECONDS);

    const clientOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetLink = `${clientOrigin}/auth/reset-password?token=${resetToken}`;

    // Non-blocking dispatch with safe timeout
    try {
      await EmailService.sendPasswordResetEmail(user.email, resetLink, resetToken);
    } catch (err) {
      logger.error('Failed to dispatch password reset email:', err);
    }

    return {
      message: 'Password reset link has been sent to your email.',
      ...(process.env.NODE_ENV === 'development' ? { resetLink } : {}),
    };
  }

  static async googleAuth(dto: GoogleAuthDTO): Promise<AuthResponse> {
    if (!dto.idToken) {
      throw new BadRequestError('Google ID token is required');
    }

    // Verify Google ID token via Google's official tokeninfo endpoint
    let payload: Record<string, unknown>;
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(dto.idToken)}`
      );
      if (!response.ok) {
        throw new UnauthorizedError('Invalid or expired Google ID token');
      }
      payload = (await response.json()) as Record<string, unknown>;
    } catch (err: unknown) {
      if (err instanceof UnauthorizedError) throw err;
      throw new UnauthorizedError('Failed to verify Google ID token with Google');
    }

    const expectedClientId = process.env.GOOGLE_CLIENT_ID;
    if (expectedClientId && payload.aud !== expectedClientId) {
      logger.error(`Google token aud mismatch: expected ${expectedClientId}, got ${payload.aud}`);
      throw new UnauthorizedError('Google token was not issued for this application');
    }

    if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') {
      throw new UnauthorizedError('Invalid Google token issuer');
    }

    if (!payload.email || (payload.email_verified !== 'true' && payload.email_verified !== true)) {
      throw new UnauthorizedError('Google account email is not verified');
    }

    const verifiedEmail = (payload.email as string).trim().toLowerCase();
    const verifiedName = ((payload.name as string) || (payload.given_name as string) || verifiedEmail.split('@')[0]).trim();
    const verifiedAvatar = (payload.picture as string) || null;

    let user = await withReconnect(() =>
      prisma.user.findUnique({
        where: { email: verifiedEmail },
        include: {
          role: true,
          profile: true,
          identityVerification: true,
        },
      })
    );

    if (!user) {
      const requestedRoleName = dto.role || Role.RENTER;
      let roleRecord = await prisma.role.findUnique({ where: { name: requestedRoleName } });
      if (!roleRecord) {
        roleRecord = await prisma.role.findUnique({ where: { name: 'RENTER' } });
      }

      const nameParts = verifiedName.split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

      const randomPassword = crypto.randomBytes(16).toString('hex') + 'A1!';
      const passwordHash = await PasswordService.hash(randomPassword);

      user = await prisma.user.create({
        data: {
          email: verifiedEmail,
          phone: `GGL-${Date.now().toString().slice(-8)}`,
          passwordHash,
          roleId: roleRecord!.id,
          profile: {
            create: {
              firstName,
              lastName,
              profileImageUrl: verifiedAvatar || undefined,
            },
          },
          identityVerification: {
            create: {
              status: 'VERIFIED',
              emailVerified: true,
            },
          },
        },
        include: {
          role: true,
          profile: true,
          identityVerification: true,
        },
      });
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
        isEmailVerified: true,
        isIdentityVerified: user.identityVerification?.nationalIdVerified || false,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
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

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await PasswordService.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestError('Incorrect current password');
    }

    const passwordHash = await PasswordService.hash(newPassword);

    await withReconnect(() =>
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      })
    );

    return { message: 'Password has been updated successfully' };
  }
}


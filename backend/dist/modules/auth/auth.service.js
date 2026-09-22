"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../../config/database");
const redis_1 = require("../../config/redis");
const password_service_1 = require("../../services/password.service");
const token_service_1 = require("../../services/token.service");
const otp_service_1 = require("../../services/otp.service");
const email_service_1 = require("../../services/email.service");
const errors_1 = require("../../utils/errors");
const roles_1 = require("../../constants/roles");
const logger_1 = require("../../utils/logger");
class AuthService {
    static async register(dto) {
        const hasEmail = Boolean(dto.email && dto.email.trim());
        const hasPhone = Boolean(dto.phone && dto.phone.trim());
        if (!hasEmail && !hasPhone) {
            throw new errors_1.BadRequestError('Either email or phone number is required');
        }
        const normalizedEmail = hasEmail
            ? dto.email.trim().toLowerCase()
            : `${dto.phone.replace(/[\s\-\(\)]/g, '').trim()}@phone.ethiodelala.local`;
        const normalizedPhone = hasPhone
            ? dto.phone.replace(/[\s\-\(\)]/g, '').trim()
            : `EML-${Date.now().toString().slice(-8)}`;
        const existingUser = await (0, database_1.withReconnect)(() => database_1.prisma.user.findFirst({
            where: {
                OR: [
                    hasEmail ? { email: normalizedEmail } : {},
                    hasPhone ? { phone: normalizedPhone } : {},
                ].filter((c) => Object.keys(c).length > 0),
            },
        }));
        if (existingUser) {
            throw new errors_1.ConflictError('User with this email or phone already exists');
        }
        const passwordHash = await password_service_1.PasswordService.hash(dto.password);
        const requestedRoleName = (dto.roles && dto.roles[0]) ? dto.roles[0] : roles_1.Role.RENTER;
        let roleRecord = await database_1.prisma.role.findUnique({ where: { name: requestedRoleName } });
        if (!roleRecord) {
            roleRecord = await database_1.prisma.role.findUnique({ where: { name: 'RENTER' } });
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
            }
            else if (nameParts.length >= 3) {
                middleName = nameParts[1];
                lastName = nameParts.slice(2).join(' ');
            }
        }
        if (!firstName) {
            firstName = 'User';
        }
        const user = await database_1.prisma.user.create({
            data: {
                email: normalizedEmail,
                phone: normalizedPhone,
                passwordHash,
                roleId: roleRecord.id,
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
            await otp_service_1.OtpService.sendOtp(user.email);
        }
        if (hasPhone) {
            await otp_service_1.OtpService.sendOtp(user.phone);
        }
        const fullName = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ') || user.email;
        const roleName = (user.role?.name || 'RENTER');
        const tokenPayload = { userId: user.id, email: user.email, roles: [roleName] };
        const accessToken = token_service_1.TokenService.generateAccessToken(tokenPayload);
        const refreshToken = token_service_1.TokenService.generateRefreshToken(tokenPayload);
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
    static async login(dto) {
        const normalizedInput = dto.emailOrPhone.trim().toLowerCase();
        const user = await (0, database_1.withReconnect)(() => database_1.prisma.user.findFirst({
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
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        const isMatch = await password_service_1.PasswordService.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        const fullName = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ') || user.email;
        const roleName = (user.role?.name || 'RENTER');
        const tokenPayload = { userId: user.id, email: user.email, roles: [roleName] };
        const accessToken = token_service_1.TokenService.generateAccessToken(tokenPayload);
        const refreshToken = token_service_1.TokenService.generateRefreshToken(tokenPayload);
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
    static async verifyPhoneOtp(dto) {
        const isVerified = await otp_service_1.OtpService.verifyOtp(dto.phoneOrEmail, dto.code);
        if (!isVerified) {
            throw new errors_1.BadRequestError('Invalid or expired OTP code');
        }
        const user = await database_1.prisma.user.findFirst({
            where: {
                OR: [{ phone: dto.phoneOrEmail }, { email: dto.phoneOrEmail }],
            },
        });
        if (user) {
            await database_1.prisma.identityVerification.upsert({
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
    static async refreshToken(refreshToken) {
        try {
            const payload = token_service_1.TokenService.verifyRefreshToken(refreshToken);
            const user = await database_1.prisma.user.findUnique({
                where: { id: payload.userId },
                include: { role: true },
            });
            if (!user) {
                throw new errors_1.UnauthorizedError('User no longer exists');
            }
            const roleName = (user.role?.name || 'RENTER');
            const newTokenPayload = { userId: user.id, email: user.email, roles: [roleName] };
            const newAccessToken = token_service_1.TokenService.generateAccessToken(newTokenPayload);
            const newRefreshToken = token_service_1.TokenService.generateRefreshToken(newTokenPayload);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (err) {
            throw new errors_1.UnauthorizedError('Invalid or expired refresh token');
        }
    }
    static async sendOtp(phoneOrEmail) {
        await otp_service_1.OtpService.sendOtp(phoneOrEmail);
        return { message: 'OTP sent successfully' };
    }
    static async forgotPassword(email) {
        const normalizedInput = email.trim().toLowerCase();
        const user = await (0, database_1.withReconnect)(() => database_1.prisma.user.findFirst({
            where: {
                OR: [{ email: normalizedInput }, { phone: normalizedInput }],
            },
        }));
        if (!user) {
            return { message: 'If an account exists with this email, a password reset link has been sent.' };
        }
        // Business rule: Forgot password requires an email
        if (!user.email || user.email.includes('@phone.ethiodelala.')) {
            throw new errors_1.BadRequestError('This account was registered with a phone number only. Please provide your email address to enable password recovery.');
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetKey = `pwd-reset:${resetToken}`;
        const TTL_SECONDS = 15 * 60; // 15 minutes
        await redis_1.redisClient.set(resetKey, user.id, TTL_SECONDS);
        const clientOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
        const resetLink = `${clientOrigin}/auth/reset-password?token=${resetToken}`;
        // Non-blocking dispatch with safe timeout
        try {
            await email_service_1.EmailService.sendPasswordResetEmail(user.email, resetLink, resetToken);
        }
        catch (err) {
            logger_1.logger.error('Failed to dispatch password reset email:', err);
        }
        return {
            message: 'Password reset link has been sent to your email.',
            ...(process.env.NODE_ENV === 'development' ? { resetLink } : {}),
        };
    }
    static async googleAuth(dto) {
        if (!dto.idToken) {
            throw new errors_1.BadRequestError('Google ID token is required');
        }
        // Verify Google ID token via Google's official tokeninfo endpoint
        let payload;
        try {
            const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(dto.idToken)}`);
            if (!response.ok) {
                throw new errors_1.UnauthorizedError('Invalid or expired Google ID token');
            }
            payload = (await response.json());
        }
        catch (err) {
            if (err instanceof errors_1.UnauthorizedError)
                throw err;
            throw new errors_1.UnauthorizedError('Failed to verify Google ID token with Google');
        }
        const expectedClientId = process.env.GOOGLE_CLIENT_ID;
        if (expectedClientId && payload.aud !== expectedClientId) {
            logger_1.logger.error(`Google token aud mismatch: expected ${expectedClientId}, got ${payload.aud}`);
            throw new errors_1.UnauthorizedError('Google token was not issued for this application');
        }
        if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') {
            throw new errors_1.UnauthorizedError('Invalid Google token issuer');
        }
        if (!payload.email || (payload.email_verified !== 'true' && payload.email_verified !== true)) {
            throw new errors_1.UnauthorizedError('Google account email is not verified');
        }
        const verifiedEmail = payload.email.trim().toLowerCase();
        const verifiedName = (payload.name || payload.given_name || verifiedEmail.split('@')[0]).trim();
        const verifiedAvatar = payload.picture || null;
        let user = await (0, database_1.withReconnect)(() => database_1.prisma.user.findUnique({
            where: { email: verifiedEmail },
            include: {
                role: true,
                profile: true,
                identityVerification: true,
            },
        }));
        if (!user) {
            const requestedRoleName = dto.role || roles_1.Role.RENTER;
            let roleRecord = await database_1.prisma.role.findUnique({ where: { name: requestedRoleName } });
            if (!roleRecord) {
                roleRecord = await database_1.prisma.role.findUnique({ where: { name: 'RENTER' } });
            }
            const nameParts = verifiedName.split(' ');
            const firstName = nameParts[0] || 'User';
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;
            const randomPassword = crypto_1.default.randomBytes(16).toString('hex') + 'A1!';
            const passwordHash = await password_service_1.PasswordService.hash(randomPassword);
            user = await database_1.prisma.user.create({
                data: {
                    email: verifiedEmail,
                    phone: `GGL-${Date.now().toString().slice(-8)}`,
                    passwordHash,
                    roleId: roleRecord.id,
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
        const roleName = (user.role?.name || 'RENTER');
        const tokenPayload = { userId: user.id, email: user.email, roles: [roleName] };
        const accessToken = token_service_1.TokenService.generateAccessToken(tokenPayload);
        const refreshToken = token_service_1.TokenService.generateRefreshToken(tokenPayload);
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
    static async resetPassword(token, newPassword) {
        const resetKey = `pwd-reset:${token}`;
        const userId = await redis_1.redisClient.get(resetKey);
        if (!userId) {
            throw new errors_1.BadRequestError('Invalid or expired password reset link or token');
        }
        const user = await database_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const passwordHash = await password_service_1.PasswordService.hash(newPassword);
        await (0, database_1.withReconnect)(() => database_1.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        }));
        await redis_1.redisClient.del(resetKey);
        return { message: 'Password has been reset successfully. You can now log in.' };
    }
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await database_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const isMatch = await password_service_1.PasswordService.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new errors_1.BadRequestError('Incorrect current password');
        }
        const passwordHash = await password_service_1.PasswordService.hash(newPassword);
        await (0, database_1.withReconnect)(() => database_1.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        }));
        return { message: 'Password has been updated successfully' };
    }
}
exports.AuthService = AuthService;

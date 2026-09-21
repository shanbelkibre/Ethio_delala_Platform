import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  sendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
  changePasswordSchema,
} from './auth.validation';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

const authRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

router.post('/register', authRateLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/google', authRateLimiter, validateRequest(googleAuthSchema), AuthController.googleAuth);
router.post('/verify-phone', validateRequest(verifyOtpSchema), AuthController.verifyPhone);
router.post('/forgot-password', authRateLimiter, validateRequest(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authRateLimiter, validateRequest(resetPasswordSchema), AuthController.resetPassword);
router.post('/refresh', validateRequest(refreshTokenSchema), AuthController.refreshToken);
router.post('/send-otp', authRateLimiter, validateRequest(sendOtpSchema), AuthController.sendOtp);
router.post('/change-password', authenticate, validateRequest(changePasswordSchema), AuthController.changePassword);

export default router;

import { redisClient } from '../config/redis';
import { env } from '../config/env';
import { EmailService } from './email.service';
import { logger } from '../utils/logger';

export class OtpService {
  static generateOtpCode(): string {
    // Generate a 6-digit random numeric OTP code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOtp(phoneOrEmail: string): Promise<string> {
    const otp = this.generateOtpCode();
    const key = `otp:${phoneOrEmail}`;
    await redisClient.set(key, otp, env.OTP_TTL_SECONDS);

    // If phoneOrEmail is an email address (or contains @), send via Gmail SMTP
    if (phoneOrEmail.includes('@')) {
      logger.info(`📧 [EMAIL OTP DISPATCH] Sending OTP to ${phoneOrEmail}`);
      await EmailService.sendOtpEmail(phoneOrEmail, otp);
    } else {
      logger.info(`📱 [SMS OTP SIMULATION] Sent SMS to ${phoneOrEmail} with OTP: ${otp}`);
    }

    return otp;
  }

  static async verifyOtp(phoneOrEmail: string, code: string): Promise<boolean> {
    const key = `otp:${phoneOrEmail}`;
    const storedOtp = await redisClient.get(key);
    if (!storedOtp) return false;

    if (storedOtp === code) {
      await redisClient.del(key); // Single-use OTP pattern
      return true;
    }

    return false;
  }
}

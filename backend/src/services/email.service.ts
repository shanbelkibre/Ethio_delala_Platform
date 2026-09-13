import nodemailer from 'nodemailer';
import { env } from '../config/env';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for 587
    auth: {
      user: env.SMTP_EMAIL,
      pass: env.SMTP_PASSWORD,
    },
  });

  static async sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #059669; margin: 0; font-size: 24px;">Delala Platform Verification</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Ethiopia's Premier Real Estate & Property Platform</p>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 16px; color: #334155; margin-bottom: 12px;">Your verification OTP code is:</p>
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #059669; font-family: monospace;">${otpCode}</span>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 12px;">This code will expire in 5 minutes. Do not share it with anyone.</p>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">If you did not request this code, please ignore this email.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Delala Platform" <${env.SMTP_EMAIL}>`,
        to: toEmail,
        subject: `Your Delala Platform OTP Code: ${otpCode}`,
        html: htmlTemplate,
      });
      console.log(` [EMAIL OTP SENT] Successfully sent OTP ${otpCode} to ${toEmail}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL OTP ERROR] Failed to send email to ${toEmail}:`, error);
      
      return false;
    }
  }

  static async sendPasswordResetEmail(toEmail: string, resetLink: string, token: string): Promise<boolean> {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #059669; margin: 0; font-size: 24px;">Reset Your Password</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Ethio Delala Property Platform</p>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 15px; color: #334155; margin-bottom: 18px;">We received a request to reset your password. Click the button below to set a new password:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: bold; font-size: 15px; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin-bottom: 16px;">Reset Password</a>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 16px;">Or copy-paste this reset token: <br/><strong style="color: #059669; font-family: monospace; font-size: 14px;">${token}</strong></p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 10px;">This link will expire in 15 minutes.</p>
        </div>
        <p style="color: #64748b; font-size: 13px; text-align: center;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Ethio Delala" <${env.SMTP_EMAIL}>`,
        to: toEmail,
        subject: `Reset Your Ethio Delala Password`,
        html: htmlTemplate,
      });
      console.log(`[PASSWORD RESET EMAIL SENT] Successfully sent reset email to ${toEmail}`);
      return true;
    } catch (error) {
      console.error(`[PASSWORD RESET EMAIL ERROR] Failed to send email to ${toEmail}:`, error);
      return false;
    }
  }
}

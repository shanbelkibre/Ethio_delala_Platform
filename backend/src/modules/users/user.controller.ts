import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendSuccess } from '../../utils/response';
import { PropertyRepository } from '../properties/property.repository';
import { CloudinaryService } from '../../services/cloudinary.service';
import { BadRequestError } from '../../utils/errors';

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await UserService.getProfile(userId);
      sendSuccess(res, user, 'Profile fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const updated = await UserService.updateProfile(userId, req.body);
      sendSuccess(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      if (!req.file) {
        throw new BadRequestError('Avatar image file is required');
      }

      let avatarUrl: string;
      try {
        avatarUrl = await CloudinaryService.uploadFile(req.file.path, 'avatars');
      } catch {
        // Fallback to local uploads path if Cloudinary is offline in dev
        avatarUrl = `/uploads/${req.file.filename}`;
      }

      const updated = await UserService.updateProfile(userId, { profileImageUrl: avatarUrl });
      sendSuccess(res, { avatarUrl, user: updated }, 'Avatar uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  static async verifyNationalId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await UserService.verifyNationalId(userId, req.body);
      sendSuccess(res, result, 'National ID (Fayda e-KYC) verified successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMyProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user!.userId;
      const result = await PropertyRepository.findMany({ ownerId });
      sendSuccess(res, { properties: result.properties, total: result.total }, 'My properties retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      sendSuccess(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id;
      const updated = await UserService.updateUserStatus(targetUserId, req.body);
      sendSuccess(res, updated, 'User status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id;
      const updated = await UserService.updateUserRoles(targetUserId, req.body);
      sendSuccess(res, updated, 'User roles updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const role = req.query.role as any;
      const status = req.query.status as any;
      const search = req.query.search as string | undefined;

      const result = await UserService.getAllUsers({ page, limit, role, status, search });
      sendSuccess(res, result.users, 'Users retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }
}

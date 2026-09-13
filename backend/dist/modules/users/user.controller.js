"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const response_1 = require("../../utils/response");
const property_repository_1 = require("../properties/property.repository");
const cloudinary_service_1 = require("../../services/cloudinary.service");
const errors_1 = require("../../utils/errors");
class UserController {
    static async getMe(req, res, next) {
        try {
            const userId = req.user.userId;
            const user = await user_service_1.UserService.getProfile(userId);
            (0, response_1.sendSuccess)(res, user, 'Profile fetched successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateMe(req, res, next) {
        try {
            const userId = req.user.userId;
            const updated = await user_service_1.UserService.updateProfile(userId, req.body);
            (0, response_1.sendSuccess)(res, updated, 'Profile updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async uploadAvatar(req, res, next) {
        try {
            const userId = req.user.userId;
            if (!req.file) {
                throw new errors_1.BadRequestError('Avatar image file is required');
            }
            let avatarUrl;
            try {
                avatarUrl = await cloudinary_service_1.CloudinaryService.uploadFile(req.file.path, 'avatars');
            }
            catch {
                // Fallback to local uploads path if Cloudinary is offline in dev
                avatarUrl = `/uploads/${req.file.filename}`;
            }
            const updated = await user_service_1.UserService.updateProfile(userId, { profileImageUrl: avatarUrl });
            (0, response_1.sendSuccess)(res, { avatarUrl, user: updated }, 'Avatar uploaded successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async verifyNationalId(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await user_service_1.UserService.verifyNationalId(userId, req.body);
            (0, response_1.sendSuccess)(res, result, 'National ID (Fayda e-KYC) verified successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyProperties(req, res, next) {
        try {
            const ownerId = req.user.userId;
            const result = await property_repository_1.PropertyRepository.findMany({ ownerId });
            (0, response_1.sendSuccess)(res, { properties: result.properties, total: result.total }, 'My properties retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserById(req, res, next) {
        try {
            const user = await user_service_1.UserService.getUserById(req.params.id);
            (0, response_1.sendSuccess)(res, user, 'User retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const targetUserId = req.params.id;
            const updated = await user_service_1.UserService.updateUserStatus(targetUserId, req.body);
            (0, response_1.sendSuccess)(res, updated, 'User status updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateRoles(req, res, next) {
        try {
            const targetUserId = req.params.id;
            const updated = await user_service_1.UserService.updateUserRoles(targetUserId, req.body);
            (0, response_1.sendSuccess)(res, updated, 'User roles updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllUsers(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const role = req.query.role;
            const status = req.query.status;
            const search = req.query.search;
            const result = await user_service_1.UserService.getAllUsers({ page, limit, role, status, search });
            (0, response_1.sendSuccess)(res, result.users, 'Users retrieved successfully', 200, result.meta);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const user_validation_1 = require("./user.validation");
const roles_1 = require("../../constants/roles");
const router = (0, express_1.Router)();
// All routes require valid JWT authentication
router.use(auth_middleware_1.authenticate);
// Current Authenticated User Profile Endpoints
router.get('/me', user_controller_1.UserController.getMe);
router.patch('/me', (0, validation_middleware_1.validateRequest)(user_validation_1.updateProfileSchema), user_controller_1.UserController.updateMe);
router.post('/me/avatar', upload_middleware_1.uploadPublic.single('file'), user_controller_1.UserController.uploadAvatar);
router.post('/me/verify-national-id', (0, validation_middleware_1.validateRequest)(user_validation_1.verifyNationalIdSchema), user_controller_1.UserController.verifyNationalId);
router.get('/me/properties', user_controller_1.UserController.getMyProperties);
// Specific User Details Endpoint
router.get('/:id', user_controller_1.UserController.getUserById);
// Admin-Only User Management Endpoints
router.get('/', (0, role_middleware_1.authorizeRoles)(roles_1.Role.ADMIN), (0, validation_middleware_1.validateRequest)(user_validation_1.getUsersQuerySchema), user_controller_1.UserController.getAllUsers);
router.patch('/:id/status', (0, role_middleware_1.authorizeRoles)(roles_1.Role.ADMIN), (0, validation_middleware_1.validateRequest)(user_validation_1.updateStatusSchema), user_controller_1.UserController.updateStatus);
router.patch('/:id/roles', (0, role_middleware_1.authorizeRoles)(roles_1.Role.ADMIN), (0, validation_middleware_1.validateRequest)(user_validation_1.updateRolesSchema), user_controller_1.UserController.updateRoles);
exports.default = router;

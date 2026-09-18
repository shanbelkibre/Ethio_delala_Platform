"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const prisma_1 = require("../../prisma");
const response_1 = require("../../utils/response");
class StatsController {
    static async getPublicStats(req, res, next) {
        try {
            const [totalProperties, totalUsers, totalRentals, totalReviews,] = await Promise.all([
                prisma_1.prisma.property.count(),
                prisma_1.prisma.user.count(),
                prisma_1.prisma.rentalRequest.count(),
                prisma_1.prisma.review.count(),
            ]);
            const stats = {
                yearsExperience: 8,
                verifiedProperties: totalProperties,
                satisfiedTenants: totalUsers,
                completedBookings: totalRentals,
                totalReviews: totalReviews,
            };
            (0, response_1.sendSuccess)(res, stats, 'Public platform statistics retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StatsController = StatsController;

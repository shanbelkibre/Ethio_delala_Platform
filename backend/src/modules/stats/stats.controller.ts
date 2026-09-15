import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess } from '../../utils/response';

export class StatsController {
  static async getPublicStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalProperties,
        totalUsers,
        totalRentals,
        totalReviews,
      ] = await Promise.all([
        prisma.property.count(),
        prisma.user.count(),
        prisma.rentalRequest.count(),
        prisma.review.count(),
      ]);

      const stats = {
        yearsExperience: 8,
        verifiedProperties: totalProperties,
        satisfiedTenants: totalUsers,
        completedBookings: totalRentals,
        totalReviews: totalReviews,
      };

      sendSuccess(res, stats, 'Public platform statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

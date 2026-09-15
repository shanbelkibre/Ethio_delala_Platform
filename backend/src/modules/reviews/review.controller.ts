import { Request, Response, NextFunction } from 'express';
import { ReviewService } from './review.service';
import { sendSuccess } from '../../utils/response';

export class ReviewController {
  static async getPublicReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const reviews = await ReviewService.getPublicReviews(limit);
      sendSuccess(res, reviews, 'Public reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

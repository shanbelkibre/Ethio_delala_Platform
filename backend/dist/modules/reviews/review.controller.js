"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_service_1 = require("./review.service");
const response_1 = require("../../utils/response");
class ReviewController {
    static async getPublicReviews(req, res, next) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const reviews = await review_service_1.ReviewService.getPublicReviews(limit);
            (0, response_1.sendSuccess)(res, reviews, 'Public reviews retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReviewController = ReviewController;

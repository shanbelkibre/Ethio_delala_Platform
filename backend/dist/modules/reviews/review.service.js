"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = require("../../prisma");
class ReviewService {
    static async getPublicReviews(limit = 10) {
        const reviews = await prisma_1.prisma.review.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                property: true,
            },
        });
        return reviews.map((r) => {
            const firstName = r.user?.profile?.firstName || '';
            const lastName = r.user?.profile?.lastName || '';
            const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : (r.user?.email ? r.user.email.split('@')[0] : 'Verified Tenant');
            const initials = (firstName && lastName)
                ? `${firstName[0]}${lastName[0]}`.toUpperCase()
                : (fullName.length >= 2 ? fullName.slice(0, 2).toUpperCase() : 'TA');
            const neighborhood = r.property?.areaName || r.property?.zone || r.user?.profile?.zone || r.property?.city || 'Addis Ababa';
            const userRole = `Tenant in ${neighborhood}`;
            return {
                id: r.id,
                rating: r.rating || 5,
                content: r.comment || 'Excellent rental property and seamless moving experience.',
                name: fullName,
                initials: initials,
                role: userRole,
                company: r.property?.city || 'Addis Ababa',
                image: r.user?.profile?.profileImageUrl || '',
                createdAt: r.createdAt,
            };
        });
    }
}
exports.ReviewService = ReviewService;

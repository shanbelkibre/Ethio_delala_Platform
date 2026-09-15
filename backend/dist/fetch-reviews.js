"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./prisma");
async function main() {
    const reviews = await prisma_1.prisma.review.findMany({
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
            property: true,
        },
    });
    console.log('=== DATABASE REVIEWS ===');
    console.log(JSON.stringify(reviews, null, 2));
}
main().finally(() => prisma_1.prisma.$disconnect());

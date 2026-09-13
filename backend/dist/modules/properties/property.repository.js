"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyRepository = void 0;
const database_1 = require("../../config/database");
const client_1 = require("@prisma/client");
class PropertyRepository {
    static async create(ownerId, data) {
        const { images, area, addressDetails, neighborhood, city, region, ...propertyData } = data;
        return database_1.prisma.property.create({
            data: {
                ...propertyData,
                region: region || city || 'Addis Ababa',
                city,
                price: new client_1.Prisma.Decimal(propertyData.price),
                areaSqMeters: area !== undefined ? new client_1.Prisma.Decimal(area) : undefined,
                detailedLocation: addressDetails || neighborhood,
                ownerId,
                status: client_1.PropertyStatus.DRAFT,
                images: images && images.length > 0
                    ? {
                        create: images.map((url, idx) => ({
                            url,
                            isPrimary: idx === 0,
                            sortOrder: idx,
                        })),
                    }
                    : undefined,
            },
            include: {
                images: true,
                owner: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true } },
                        identityVerification: { select: { nationalIdVerified: true, status: true } },
                    },
                },
            },
        });
    }
    static async findById(id) {
        return database_1.prisma.property.findUnique({
            where: { id },
            include: {
                images: true,
                owner: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true } },
                        identityVerification: { select: { nationalIdVerified: true, status: true } },
                    },
                },
            },
        });
    }
    static async findMany(where = {}, skip = 0, limit = 10) {
        const [properties, total] = await Promise.all([
            database_1.prisma.property.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    images: true,
                    owner: {
                        select: {
                            phone: true,
                            profile: { select: { firstName: true, lastName: true } },
                        },
                    },
                },
            }),
            database_1.prisma.property.count({ where }),
        ]);
        return { properties, total };
    }
    static async update(id, data) {
        return database_1.prisma.property.update({
            where: { id },
            data,
            include: { images: true },
        });
    }
    static async countOwnerActiveProperties(ownerId) {
        return database_1.prisma.property.count({
            where: { ownerId, status: { in: [client_1.PropertyStatus.PUBLISHED, client_1.PropertyStatus.DRAFT] } },
        });
    }
}
exports.PropertyRepository = PropertyRepository;

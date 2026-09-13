"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRepository = void 0;
const database_1 = require("../../config/database");
class RentalRepository {
    static async createRequest(data) {
        return database_1.prisma.rentalRequest.create({
            data: {
                propertyId: data.propertyId,
                renterId: data.renterId,
                message: data.message,
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        city: true,
                        areaName: true,
                        ownerId: true,
                        owner: {
                            select: {
                                id: true,
                                phone: true,
                                email: true,
                                profile: { select: { firstName: true, lastName: true } },
                            },
                        },
                    },
                },
                renter: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true } },
                    },
                },
            },
        });
    }
    static async findById(id) {
        return database_1.prisma.rentalRequest.findUnique({
            where: { id },
            include: {
                property: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                phone: true,
                                email: true,
                                profile: { select: { firstName: true, lastName: true } },
                            },
                        },
                    },
                },
                renter: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true } },
                    },
                },
            },
        });
    }
    static async findRenterRequests(renterId) {
        return database_1.prisma.rentalRequest.findMany({
            where: { renterId },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        city: true,
                        owner: {
                            select: {
                                phone: true,
                                profile: { select: { firstName: true, lastName: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async findOwnerRequests(ownerId) {
        return database_1.prisma.rentalRequest.findMany({
            where: {
                property: {
                    ownerId,
                },
            },
            include: {
                property: { select: { id: true, title: true, price: true, city: true } },
                renter: {
                    select: {
                        phone: true,
                        email: true,
                        profile: { select: { firstName: true, lastName: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async updateStatus(id, status) {
        return database_1.prisma.rentalRequest.update({
            where: { id },
            data: { status },
            include: { property: true, renter: true },
        });
    }
}
exports.RentalRepository = RentalRepository;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepository = void 0;
const database_1 = require("../../config/database");
const client_1 = require("@prisma/client");
class SubscriptionRepository {
    static async createPlan(data) {
        return database_1.prisma.subscriptionPlan.create({
            data: {
                name: data.name,
                price: new client_1.Prisma.Decimal(data.price),
                durationDays: data.durationDays ?? 30,
                maxListings: data.maxListings ?? 5,
                features: data.features ? JSON.parse(data.features) : [],
                isActive: true,
            },
        });
    }
    static async findPlanById(id) {
        return database_1.prisma.subscriptionPlan.findUnique({ where: { id } });
    }
    static async getActivePlans() {
        return database_1.prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });
    }
    static async getAllPlans() {
        return database_1.prisma.subscriptionPlan.findMany({ orderBy: { createdAt: 'desc' } });
    }
    static async updatePlan(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.price !== undefined)
            updateData.price = new client_1.Prisma.Decimal(data.price);
        if (data.durationDays !== undefined)
            updateData.durationDays = data.durationDays;
        if (data.maxListings !== undefined)
            updateData.maxListings = data.maxListings;
        if (data.features !== undefined)
            updateData.features = data.features;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        return database_1.prisma.subscriptionPlan.update({
            where: { id },
            data: updateData,
        });
    }
    static async createSubscription(data) {
        return database_1.prisma.subscription.create({ data, include: { plan: true } });
    }
    static async findActiveSubscription(ownerId) {
        return database_1.prisma.subscription.findFirst({
            where: {
                ownerId,
                status: client_1.SubscriptionStatus.ACTIVE,
                endDate: { gte: new Date() },
            },
            include: { plan: true },
            orderBy: { endDate: 'desc' },
        });
    }
    static async activateSubscription(subscriptionId, durationDays) {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
        return database_1.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: client_1.SubscriptionStatus.ACTIVE,
                startDate,
                endDate,
            },
            include: { plan: true },
        });
    }
}
exports.SubscriptionRepository = SubscriptionRepository;

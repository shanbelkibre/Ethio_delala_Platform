import { prisma } from '../../config/database';
import { SubscriptionPlan, SubscriptionStatus, Prisma } from '@prisma/client';

export type SubscriptionWithPlan = Prisma.SubscriptionGetPayload<{ include: { plan: true } }>;

export class SubscriptionRepository {
  static async createPlan(data: {
    name: string;
    price: number | Prisma.Decimal;
    durationDays?: number;
    maxListings?: number;
    features?: string;
  }): Promise<SubscriptionPlan> {
    return prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        price: new Prisma.Decimal(data.price),
        durationDays: data.durationDays ?? 30,
        maxListings: data.maxListings ?? 5,
        features: data.features ? JSON.parse(data.features) : [],
        isActive: true,
      },
    });
  }

  static async findPlanById(id: string): Promise<SubscriptionPlan | null> {
    return prisma.subscriptionPlan.findUnique({ where: { id } });
  }

  static async getActivePlans(): Promise<SubscriptionPlan[]> {
    return prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });
  }

  static async getAllPlans(): Promise<SubscriptionPlan[]> {
    return prisma.subscriptionPlan.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async updatePlan(id: string, data: {
    name?: string;
    price?: number;
    durationDays?: number;
    maxListings?: number;
    features?: string[];
    isActive?: boolean;
  }): Promise<SubscriptionPlan> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price);
    if (data.durationDays !== undefined) updateData.durationDays = data.durationDays;
    if (data.maxListings !== undefined) updateData.maxListings = data.maxListings;
    if (data.features !== undefined) updateData.features = data.features;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return prisma.subscriptionPlan.update({
      where: { id },
      data: updateData,
    });
  }

  static async createSubscription(data: {
    ownerId: string;
    planId: string;
    status: SubscriptionStatus;
  }): Promise<SubscriptionWithPlan> {
    return prisma.subscription.create({ data, include: { plan: true } });
  }

  static async findActiveSubscription(ownerId: string): Promise<SubscriptionWithPlan | null> {
    return prisma.subscription.findFirst({
      where: {
        ownerId,
        status: SubscriptionStatus.ACTIVE,
        endDate: { gte: new Date() },
      },
      include: { plan: true },
      orderBy: { endDate: 'desc' },
    });
  }

  static async activateSubscription(subscriptionId: string, durationDays: number): Promise<SubscriptionWithPlan> {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    return prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
      },
      include: { plan: true },
    });
  }
}


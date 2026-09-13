import { prisma } from '../../config/database';
import { SaleRequest, SaleStatus, Prisma } from '@prisma/client';

export class SaleRepository {
  static async createRequest(data: {
    propertyId: string;
    buyerId: string;
    offeredPrice?: number | Prisma.Decimal;
    message?: string;
  }): Promise<SaleRequest> {
    return prisma.saleRequest.create({
      data: {
        propertyId: data.propertyId,
        buyerId: data.buyerId,
        offeredPrice: data.offeredPrice !== undefined ? new Prisma.Decimal(data.offeredPrice) : undefined,
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
        buyer: {
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

  static async findById(id: string) {
    return prisma.saleRequest.findUnique({
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
        buyer: {
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

  static async findBuyerRequests(buyerId: string) {
    return prisma.saleRequest.findMany({
      where: { buyerId },
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

  static async findOwnerRequests(ownerId: string) {
    return prisma.saleRequest.findMany({
      where: {
        property: {
          ownerId,
        },
      },
      include: {
        property: { select: { id: true, title: true, price: true, city: true } },
        buyer: {
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

  static async updateStatus(id: string, status: SaleStatus): Promise<SaleRequest> {
    return prisma.saleRequest.update({
      where: { id },
      data: { status },
      include: { property: true, buyer: true },
    });
  }
}


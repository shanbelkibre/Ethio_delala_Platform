import { prisma } from '../../config/database';
import { RentalRequest, RentalStatus } from '@prisma/client';

export class RentalRepository {
  static async createRequest(data: {
    propertyId: string;
    renterId: string;
    message?: string;
  }): Promise<RentalRequest> {
    return prisma.rentalRequest.create({
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

  static async findById(id: string) {
    return prisma.rentalRequest.findUnique({
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

  static async findRenterRequests(renterId: string) {
    return prisma.rentalRequest.findMany({
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

  static async findOwnerRequests(ownerId: string) {
    return prisma.rentalRequest.findMany({
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

  static async updateStatus(id: string, status: RentalStatus): Promise<RentalRequest> {
    return prisma.rentalRequest.update({
      where: { id },
      data: { status },
      include: { property: true, renter: true },
    });
  }
}


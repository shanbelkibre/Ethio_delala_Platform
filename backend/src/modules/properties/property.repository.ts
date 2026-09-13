import { prisma } from '../../config/database';
import { Property, PropertyStatus, TransactionType, Prisma } from '@prisma/client';

export class PropertyRepository {
  static async create(ownerId: string, data: {
    title: string;
    description: string;
    propertyType: string;
    transactionType: TransactionType;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    city: string;
    areaName: string;
    neighborhood?: string;
    addressDetails?: string;
    images?: string[];
  }): Promise<Property> {
    const { images, area, addressDetails, neighborhood, city, ...propertyData } = data;

    return prisma.property.create({
      data: {
        ...propertyData,
        region: propertyData.region || city || 'Addis Ababa',
        city,
        price: new Prisma.Decimal(propertyData.price),
        areaSqMeters: area !== undefined ? new Prisma.Decimal(area) : undefined,
        detailedLocation: addressDetails || neighborhood,
        ownerId,
        status: PropertyStatus.DRAFT,
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

  static async findById(id: string): Promise<Property | null> {
    return prisma.property.findUnique({
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

  static async findMany(where: Prisma.PropertyWhereInput = {}, skip = 0, limit = 10): Promise<{ properties: Property[]; total: number }> {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
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
      prisma.property.count({ where }),
    ]);

    return { properties, total };
  }

  static async update(id: string, data: Prisma.PropertyUpdateInput): Promise<Property> {
    return prisma.property.update({
      where: { id },
      data,
      include: { images: true },
    });
  }

  static async countOwnerActiveProperties(ownerId: string): Promise<number> {
    return prisma.property.count({
      where: { ownerId, status: { in: [PropertyStatus.PUBLISHED, PropertyStatus.DRAFT] } },
    });
  }
}

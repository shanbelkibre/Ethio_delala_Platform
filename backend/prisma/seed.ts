import { prisma } from '../src/config/database';
import { PasswordService } from '../src/services/password.service';
import {
  RoleType,
  TransactionType,
  PropertyStatus,
  VerificationStatus,
  RentalStatus,
  SaleStatus,
  SubscriptionStatus,
  PaymentStatus,
  PaymentMethod,
  NotificationType,
  AdminActionType,
  ReportStatus,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

async function seed() {


  // ============================================================
  // 1. ROLES
  // ============================================================



  const roleNames: RoleType[] = [
    RoleType.ADMIN,
    RoleType.AGENT,
    RoleType.OWNER,
    RoleType.RENTER,
  ];

  const roles: Record<RoleType, { id: string }> = {} as Record<
    RoleType,
    { id: string }
  >;

  for (const name of roleNames) {
    roles[name] = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
      select: { id: true },
    });
  }

  // ============================================================
  // 2. ADMIN USER
  // ============================================================



  const adminPassword = await PasswordService.hash('Admin@123456');

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@ethiodellala.et',
    },
    update: {
      passwordHash: adminPassword,
      roleId: roles[RoleType.ADMIN].id,
      accountStatus: 'ACTIVE',
    },
    create: {
      email: 'admin@ethiodellala.et',
      phone: '+251911000001',
      passwordHash: adminPassword,
      roleId: roles[RoleType.ADMIN].id,
      accountStatus: 'ACTIVE',

      profile: {
        create: {
          firstName: 'System',
          lastName: 'Admin',
          region: 'Addis Ababa',
        },
      },

      identityVerification: {
        create: {
          emailVerified: true,
          emailVerifiedAt: new Date(),

          phoneOtpVerified: true,
          phoneVerifiedAt: new Date(),

          nationalIdReference: 'SEED-ADMIN-NATIONAL-ID',
          nationalIdVerified: true,
          nationalIdVerifiedAt: new Date(),

          status: VerificationStatus.VERIFIED,
          verifiedAt: new Date(),
        },
      },
    },
  });

  // ============================================================
  // 3. AGENT USER
  // ============================================================
  const agentPassword = await PasswordService.hash('Agent@123456');
  const agent = await prisma.user.upsert({
    where: {
      email: 'agent@ethiodellala.et',
    },
    update: {
      passwordHash: agentPassword,
      roleId: roles[RoleType.AGENT].id,
      accountStatus: 'ACTIVE',
    },
    create: {
      email: 'agent@ethiodellala.et',
      phone: '+251911000004',
      passwordHash: agentPassword,
      roleId: roles[RoleType.AGENT].id,
      accountStatus: 'ACTIVE',

      profile: {
        create: {
          firstName: 'Dawit',
          lastName: 'Tadesse',
          region: 'Addis Ababa',
          zone: 'Bole',
          assignedRegion: 'Addis Ababa',
        },
      },

      identityVerification: {
        create: {
          emailVerified: true,
          emailVerifiedAt: new Date(),

          phoneOtpVerified: true,
          phoneVerifiedAt: new Date(),

          nationalIdReference: 'SEED-AGENT-NATIONAL-ID',
          nationalIdVerified: true,
          nationalIdVerifiedAt: new Date(),

          status: VerificationStatus.VERIFIED,
          verifiedAt: new Date(),
        },
      },
    },
  });

  // ============================================================
  // 4. OWNER USER
  // ============================================================
  const ownerPassword = await PasswordService.hash('Owner@123456');

  const owner = await prisma.user.upsert({
    where: {
      email: 'owner@ethiodellala.et',
    },
    update: {
      passwordHash: ownerPassword,
      roleId: roles[RoleType.OWNER].id,
      accountStatus: 'ACTIVE',
    },
    create: {
      email: 'owner@ethiodellala.et',
      phone: '+251911000002',
      passwordHash: ownerPassword,
      roleId: roles[RoleType.OWNER].id,
      accountStatus: 'ACTIVE',

      profile: {
        create: {
          firstName: 'Abebe',
          lastName: 'Kebede',
          region: 'Addis Ababa',
        },
      },

      identityVerification: {
        create: {
          emailVerified: true,
          emailVerifiedAt: new Date(),

          phoneOtpVerified: true,
          phoneVerifiedAt: new Date(),

          nationalIdReference: 'SEED-OWNER-NATIONAL-ID',
          nationalIdVerified: true,
          nationalIdVerifiedAt: new Date(),

          status: VerificationStatus.VERIFIED,
          verifiedAt: new Date(),
        },
      },
    },
  });

  // ============================================================
  // 5. RENTER USER
  // ============================================================

  console.log('Creating renter...');

  const renterPassword = await PasswordService.hash('Renter@123456');

  const renter = await prisma.user.upsert({
    where: {
      email: 'renter@ethiodellala.et',
    },
    update: {
      passwordHash: renterPassword,
      roleId: roles[RoleType.RENTER].id,
      accountStatus: 'ACTIVE',
    },
    create: {
      email: 'renter@ethiodellala.et',
      phone: '+251911000003',
      passwordHash: renterPassword,
      roleId: roles[RoleType.RENTER].id,
      accountStatus: 'ACTIVE',

      profile: {
        create: {
          firstName: 'Tigist',
          lastName: 'Alemu',
          region: 'Addis Ababa',
        },
      },

      identityVerification: {
        create: {
          emailVerified: true,
          emailVerifiedAt: new Date(),

          phoneOtpVerified: true,
          phoneVerifiedAt: new Date(),

          nationalIdReference: 'SEED-RENTER-NATIONAL-ID',
          nationalIdVerified: true,
          nationalIdVerifiedAt: new Date(),

          status: VerificationStatus.VERIFIED,
          verifiedAt: new Date(),
        },
      },
    },
  });

  // ============================================================
  // 6. SUBSCRIPTION PLANS
  // ============================================================

  console.log('Creating subscription plans...');

  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: {
      name: 'Basic Plan',
    },
    update: {},
    create: {
      name: 'Basic Plan',
      price: new Decimal(500),
      durationDays: 30,
      maxListings: 3,

      features: [
        '3 Property Listings',
        'Standard Search Result Priority',
        'Direct Messaging',
      ],

      isActive: true,
    },
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: {
      name: 'Professional Plan',
    },
    update: {},
    create: {
      name: 'Professional Plan',
      price: new Decimal(1200),
      durationDays: 30,
      maxListings: 10,

      features: [
        '10 Property Listings',
        'Featured Search Placement',
        'Analytics Access',
        'Priority Support',
      ],

      isActive: true,
    },
  });

  // ============================================================
  // 7. OWNER SUBSCRIPTION
  // ============================================================

  console.log('Creating owner subscription...');

  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      ownerId: owner.id,
      planId: proPlan.id,
    },
  });

  const subscription =
    existingSubscription ??
    (await prisma.subscription.create({
      data: {
        ownerId: owner.id,
        planId: proPlan.id,

        status: SubscriptionStatus.ACTIVE,

        startDate: new Date(),

        endDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ),
      },
    }));

  // ============================================================
  // 8. SUBSCRIPTION PAYMENT
  // ============================================================

  console.log('Creating subscription payment...');

  const existingPayment =
    await prisma.subscriptionPayment.findFirst({
      where: {
        subscriptionId: subscription.id,
      },
    });

  if (!existingPayment) {
    await prisma.subscriptionPayment.create({
      data: {
        subscriptionId: subscription.id,

        amount: new Decimal(1200),
        currency: 'ETB',

        paymentMethod: PaymentMethod.CHAPA,
        paymentStatus: PaymentStatus.SUCCESS,

        paymentReference: `SEED-TX-${Date.now()}`,

        chapaTransactionReference: `CHAPA-SEED-${Date.now()}`,

        checkoutUrl: 'https://checkout.chapa.co/seed-demo',

        paidAt: new Date(),
      },
    });
  }

  // ============================================================
  // 9. RENT PROPERTY
  // ============================================================

  console.log('Creating rental property...');

  let rentProperty = await prisma.property.findFirst({
    where: {
      ownerId: owner.id,
      title: 'Modern 2 Bedroom Apartment in Bole',
    },
  });

  if (!rentProperty) {
    rentProperty = await prisma.property.create({
      data: {
        ownerId: owner.id,

        title: 'Modern 2 Bedroom Apartment in Bole',

        description:
          'Spacious apartment near Bole Medhanealem with modern amenities and high-speed internet.',

        propertyType: 'Apartment',

        transactionType: TransactionType.RENT,

        price: new Decimal(35000),

        areaSqMeters: new Decimal(120),

        rooms: 3,
        bedrooms: 2,
        bathrooms: 2,

        region: 'Addis Ababa',
        city: 'Addis Ababa',
        areaName: 'Bole',

        detailedLocation:
          'Near Medhanealem Church',

        latitude: new Decimal('8.9950'),
        longitude: new Decimal('38.7870'),

        availability: true,

        status: PropertyStatus.PUBLISHED,

        viewsCount: 125,

        images: {
          create: [
            {
              url: '/uploads/bole_apt_1.jpg',
              isPrimary: true,
              sortOrder: 1,
            },
            {
              url: '/uploads/bole_apt_2.jpg',
              isPrimary: false,
              sortOrder: 2,
            },
          ],
        },
      },
    });
  }

  // ============================================================
  // 10. SALE PROPERTY
  // ============================================================

  console.log('Creating sale property...');

  let saleProperty = await prisma.property.findFirst({
    where: {
      ownerId: owner.id,
      title: 'Luxury Villa for Sale in CMC',
    },
  });

  if (!saleProperty) {
    saleProperty = await prisma.property.create({
      data: {
        ownerId: owner.id,

        title: 'Luxury Villa for Sale in CMC',

        description:
          'Beautiful 4-bedroom villa with private garden, garage, and G+2 architecture.',

        propertyType: 'Villa',

        transactionType: TransactionType.SALE,

        price: new Decimal(25000000),

        areaSqMeters: new Decimal(350),

        rooms: 6,
        bedrooms: 4,
        bathrooms: 4,

        region: 'Addis Ababa',
        city: 'Addis Ababa',
        areaName: 'CMC',

        detailedLocation: 'CMC Michael',

        latitude: new Decimal('9.0150'),
        longitude: new Decimal('38.8450'),

        availability: true,

        status: PropertyStatus.PUBLISHED,

        viewsCount: 87,

        images: {
          create: [
            {
              url: '/uploads/cmc_villa_1.jpg',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    });
  }

  // ============================================================
  // 11. RENTAL REQUEST
  // ============================================================

  console.log('Creating rental request...');

  let rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: rentProperty.id,
      renterId: renter.id,
    },
  });

  if (!rentalRequest) {
    rentalRequest = await prisma.rentalRequest.create({
      data: {
        propertyId: rentProperty.id,
        renterId: renter.id,

        status: RentalStatus.PENDING,

        message:
          'I am interested in renting this apartment. Please provide more information.',

        moveInDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000,
        ),

        durationMonths: 12,
      },
    });
  }

  // ============================================================
  // 12. SALE REQUEST
  // ============================================================

  console.log('Creating sale request...');

  let saleRequest = await prisma.saleRequest.findFirst({
    where: {
      propertyId: saleProperty.id,
      buyerId: renter.id,
    },
  });

  if (!saleRequest) {
    saleRequest = await prisma.saleRequest.create({
      data: {
        propertyId: saleProperty.id,
        buyerId: renter.id,

        status: SaleStatus.PENDING,

        offeredPrice: new Decimal(24000000),

        message:
          'I am interested in purchasing this property. I would like to discuss the price and details.',
      },
    });
  }

  // ============================================================
  // 13. MESSAGES
  // ============================================================



  const existingMessage = await prisma.message.findFirst({
    where: {
      senderId: renter.id,
      receiverId: owner.id,
      rentalRequestId: rentalRequest.id,
    },
  });

  if (!existingMessage) {
    await prisma.message.create({
      data: {
        senderId: renter.id,
        receiverId: owner.id,

        propertyId: rentProperty.id,

        rentalRequestId: rentalRequest.id,

        content:
          'Hello, I am interested in this property. Is it still available?',

        isRead: false,
      },
    });
  }

  // ============================================================
  // 14. NOTIFICATIONS
  // ============================================================

  console.log('Creating notifications...');

  await prisma.notification.create({
    data: {
      userId: owner.id,

      title: 'New Rental Request',

      message:
        'You received a new rental request for your property.',

      type: NotificationType.RENTAL_REQUEST,

      link: `/rental-requests/${rentalRequest.id}`,

      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: renter.id,

      title: 'Rental Request Submitted',

      message:
        'Your rental request has been successfully submitted.',

      type: NotificationType.RENTAL_REQUEST,

      link: `/rental-requests/${rentalRequest.id}`,

      isRead: false,
    },
  });

  // ============================================================
  // 15. FAVORITE
  // ============================================================

  console.log('Creating favorite...');

  await prisma.favorite.upsert({
    where: {
      userId_propertyId: {
        userId: renter.id,
        propertyId: rentProperty.id,
      },
    },
    update: {},
    create: {
      userId: renter.id,
      propertyId: rentProperty.id,
    },
  });

  // ============================================================
  // 16. REVIEW
  // ============================================================

  console.log('Creating reviews from real tenants...');

  await prisma.review.upsert({
    where: {
      userId_propertyId: {
        userId: renter.id,
        propertyId: rentProperty.id,
      },
    },
    update: {
      rating: 5,
      comment:
        'Finding an apartment in Addis Ababa used to take weeks of hassle with brokers. With Delala Home Rentals, I inspected and moved into my 2-bedroom home in 3 days!',
    },
    create: {
      userId: renter.id,
      propertyId: rentProperty.id,
      rating: 5,
      comment:
        'Finding an apartment in Addis Ababa used to take weeks of hassle with brokers. With Delala Home Rentals, I inspected and moved into my 2-bedroom home in 3 days!',
    },
  });

  // Additional reviews
  if (saleProperty) {
    await prisma.review.upsert({
      where: {
        userId_propertyId: {
          userId: agent.id,
          propertyId: saleProperty.id,
        },
      },
      update: {
        rating: 5,
        comment:
          'Verified property deeds and digital contract signing was smooth and 100% transparent. Highly recommended for renters and buyers.',
      },
      create: {
        userId: agent.id,
        propertyId: saleProperty.id,
        rating: 5,
        comment:
          'Verified property deeds and digital contract signing was smooth and 100% transparent. Highly recommended for renters and buyers.',
      },
    });
  }

  // ============================================================
  // 17. ADMIN ACTION
  // ============================================================

  console.log('Creating admin action...');

  await prisma.adminAction.create({
    data: {
      adminId: admin.id,

      targetUserId: owner.id,

      actionType: AdminActionType.CREATE_USER,

      description:
        'Owner account created during initial platform setup.',
    },
  });

  // ============================================================
  // 18. REPORT
  // ============================================================

  console.log('Creating report...');

  const existingReport = await prisma.report.findFirst({
    where: {
      reporterId: renter.id,
      propertyId: saleProperty.id,
    },
  });

  if (!existingReport) {
    await prisma.report.create({
      data: {
        reporterId: renter.id,

        propertyId: saleProperty.id,

        reason: 'Property information needs verification',

        details:
          'This is a sample report created for development and testing.',

        status: ReportStatus.PENDING,
      },
    });
  }

  // ============================================================
  // 19. ANALYTICS EVENTS
  // ============================================================

  console.log('Creating analytics events...');

  await prisma.analyticsEvent.createMany({
    data: [
      {
        eventType: 'PROPERTY_VIEW',
        userId: renter.id,
        propertyId: rentProperty.id,
        metadata: {
          source: 'seed',
          device: 'web',
        },
      },
      {
        eventType: 'PROPERTY_VIEW',
        userId: renter.id,
        propertyId: saleProperty.id,
        metadata: {
          source: 'seed',
          device: 'mobile',
        },
      },
      {
        eventType: 'PROPERTY_FAVORITED',
        userId: renter.id,
        propertyId: rentProperty.id,
        metadata: {
          source: 'seed',
        },
      },
      {
        eventType: 'RENTAL_REQUEST_CREATED',
        userId: renter.id,
        propertyId: rentProperty.id,
        metadata: {
          source: 'seed',
        },
      },
      {
        eventType: 'SALE_REQUEST_CREATED',
        userId: renter.id,
        propertyId: saleProperty.id,
        metadata: {
          source: 'seed',
        },
      },
    ],
  });

  // ============================================================
  // 20. PLATFORM CONFIG
  // ============================================================

  console.log('Creating platform configuration...');

  const platformConfigs = [
    {
      key: 'site_title',
      value: 'Ethio Delala',
      description: 'Main platform title',
    },
    {
      key: 'site_tagline',
      value: 'Ethiopian Real Estate Platform',
      description: 'Main platform tagline',
    },
    {
      key: 'default_currency',
      value: 'ETB',
      description: 'Default platform currency',
    },
    {
      key: 'support_email',
      value: 'support@ethiodellala.et',
      description: 'Platform support email',
    },
    {
      key: 'maintenance_mode',
      value: 'false',
      description: 'Whether the platform is in maintenance mode',
    },
  ];

  for (const config of platformConfigs) {
    await prisma.platformConfig.upsert({
      where: {
        key: config.key,
      },
      update: {
        value: config.value,
        description: config.description,
      },
      create: config,
    });
  }

  // ============================================================
  // 21. AI VERIFICATION
  // ============================================================
  // AI verification is included as a development/demo record.
  // The real AI verification service will create these records
  // when the AI feature is implemented.

  console.log('Creating AI verification sample...');

  const existingAIVerification =
    await prisma.aIVerification.findFirst({
      where: {
        entityType: 'PROPERTY',
        entityId: rentProperty.id,
      },
    });

  if (!existingAIVerification) {
    await prisma.aIVerification.create({
      data: {
        entityType: 'PROPERTY',
        entityId: rentProperty.id,

        riskScore: 10,

        ocrData: {
          source: 'seed',
          documentDetected: false,
        },

        warnings: [],

        recommendation:
          'Low risk sample property. Manual verification not required in development seed.',
      },
    });
  }


}

seed()
  .catch((error) => {
    console.error(' Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
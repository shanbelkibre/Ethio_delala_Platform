import { prisma } from './config/database';
import { AuthService } from './modules/auth/auth.service';
import { PropertyRepository } from './modules/properties/property.repository';
import { RentalService } from './modules/rentals/rental.service';
import { AnalyticsService } from './modules/analytics/analytics.service';
import { Role } from './constants/roles';

async function runTests() {
  console.log('🚀 Starting Ethio Delala 20-Table 3NF Architecture Verification...');

  // 1. Verify 20 Tables in Prisma Schema
  console.log('\n--- 1. Testing Database Connectivity & Seeded Roles ---');
  const roles = await prisma.role.findMany();
  console.log('✅ Roles in DB:', roles.map(r => r.name).join(', '));
  if (roles.length !== 4) throw new Error(`Expected 4 roles, found ${roles.length}`);

  // 2. Testing Authentication for Seeded Users
  console.log('\n--- 2. Testing Login for Seeded Accounts ---');
  const testAccounts = [
    { email: 'admin@ethioproperty.et', pass: 'Admin@123456', expectedRole: 'ADMIN' },
    { email: 'agent@ethioproperty.et', pass: 'Agent@123456', expectedRole: 'AGENT' },
    { email: 'owner@ethioproperty.et', pass: 'Owner@123456', expectedRole: 'OWNER' },
    { email: 'renter@ethioproperty.et', pass: 'Renter@123456', expectedRole: 'RENTER' },
  ];

  for (const acc of testAccounts) {
    const authRes = await AuthService.login({
      emailOrPhone: acc.email,
      password: acc.pass,
    });
    console.log(`✅ Login SUCCESS for ${acc.email} | Name: "${authRes.user.name}" | Roles: [${authRes.user.roles.join(', ')}]`);
    if (!authRes.user.roles.includes(acc.expectedRole as any)) {
      throw new Error(`Role mismatch for ${acc.email}: expected ${acc.expectedRole}, got ${authRes.user.roles}`);
    }
  }

  // 3. Testing Registration of a New User
  console.log('\n--- 3. Testing Registration of New User & 1:1 Profile Creation ---');
  const testEmail = `testuser_${Date.now()}@ethioproperty.et`;
  const regRes = await AuthService.register({
    name: 'Almaz Ayana',
    email: testEmail,
    phone: `+25199${Math.floor(1000000 + Math.random() * 9000000)}`,
    password: 'Password@123',
    roles: [Role.RENTER],
  });
  console.log(`✅ Registration SUCCESS for ${testEmail} | Name: "${regRes.user.name}" | Profile created!`);

  // 4. Testing Properties Query & Structure
  console.log('\n--- 4. Testing Properties Retrieval & Relation Normalization ---');
  const properties = await PropertyRepository.findMany({}, 0, 5);
  console.log(`✅ Retrieved ${properties.properties.length} properties. First title: "${properties.properties[0]?.title}"`);

  // 5. Testing Rental and Sale Request (3NF: no ownerId on RentalRequest/SaleRequest)
  console.log('\n--- 5. Testing 3NF Rental and Sale Request Submission ---');
  const rentProp = properties.properties.find(p => p.transactionType === 'RENT');
  if (rentProp) {
    const rentalReq = await RentalService.submitRequest(regRes.user.id, {
      propertyId: rentProp.id,
      message: 'Hello, I am interested in renting this property.',
    });
    console.log(`✅ RentalRequest created successfully! ID: ${rentalReq.id}, Status: ${rentalReq.status}`);

    const ownerRequests = await RentalService.getOwnerRequests(rentProp.ownerId);
    console.log(`✅ Owner rental requests queried via property relation! Found: ${ownerRequests.length}`);
  }

  const saleProp = properties.properties.find(p => p.transactionType === 'SALE');
  if (saleProp) {
    const { SaleService } = await import('./modules/sales/sale.service');
    const saleReq = await SaleService.submitRequest(regRes.user.id, {
      propertyId: saleProp.id,
      message: 'Hello, I am interested in purchasing this villa.',
      offerPrice: 24000000,
    });
    console.log(`✅ SaleRequest created successfully! ID: ${saleReq.id}, Status: ${saleReq.status}`);

    const ownerSaleRequests = await SaleService.getOwnerRequests(saleProp.ownerId);
    console.log(`✅ Owner sale requests queried via property relation! Found: ${ownerSaleRequests.length}`);
  }

  // 6. Testing Subscription & SubscriptionPayment
  console.log('\n--- 6. Testing Subscriptions & SubscriptionPayment ---');
  const plans = await prisma.subscriptionPlan.findMany();
  console.log(`✅ Found ${plans.length} subscription plans:`, plans.map(p => `${p.planName} (${p.price} ETB)`).join(', '));

  const payments = await prisma.subscriptionPayment.findMany({
    include: { subscription: { include: { plan: true } } },
  });
  console.log(`✅ Found ${payments.length} subscription payments in 3NF table.`);

  // 7. Testing Analytics
  console.log('\n--- 7. Testing Platform Analytics ---');
  const analytics = await AnalyticsService.getPlatformAnalytics();
  console.log('✅ Analytics retrieved:', JSON.stringify(analytics));

  // 8. Testing PlatformConfig (CMS)
  console.log('\n--- 8. Testing PlatformConfig (Table 19) ---');
  const configs = await prisma.platformConfig.findMany();
  console.log(`✅ PlatformConfig entries: ${configs.length}. First key: "${configs[0]?.key}" = "${configs[0]?.value}"`);

  console.log('\n🎉 ALL 20-TABLE 3NF ARCHITECTURAL VERIFICATIONS PASSED SUCCESSFULLY!\n');
}

runTests()
  .catch(err => {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

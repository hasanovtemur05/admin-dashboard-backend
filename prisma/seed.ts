import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create super admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { phone: '+998901234567' },
    update: {},
    create: {
      phone: '+998901234567',
      email: 'admin@market.uz',
      password: hashedPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log('Created admin user:', admin.phone);

  // Create content manager
  const cmPassword = await bcrypt.hash('cm123456', 12);
  const contentManager = await prisma.user.upsert({
    where: { phone: '+998901234568' },
    update: {},
    create: {
      phone: '+998901234568',
      email: 'cm@market.uz',
      password: cmPassword,
      name: 'Content Manager',
      role: UserRole.CONTENT_MANAGER,
    },
  });

  console.log('Created content manager:', contentManager.phone);

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      icon: 'laptop',
      order: 1,
    },
  });

  const smartphones = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      icon: 'smartphone',
      order: 1,
      parentId: electronics.id,
    },
  });

  const laptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      icon: 'laptop',
      order: 2,
      parentId: electronics.id,
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      icon: 'shirt',
      order: 2,
    },
  });

  console.log('Created categories');

  // Create brands
  const apple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: {
      name: 'Apple',
      slug: 'apple',
    },
  });

  const samsung = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: {
      name: 'Samsung',
      slug: 'samsung',
    },
  });

  const nike = await prisma.brand.upsert({
    where: { slug: 'nike' },
    update: {},
    create: {
      name: 'Nike',
      slug: 'nike',
    },
  });

  console.log('Created brands');

  // Create products
  const iphone15 = await prisma.product.upsert({
    where: { slug: 'iphone-15-pro' },
    update: {},
    create: {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Latest Apple iPhone with A17 Pro chip',
      shortDesc: 'Apple flagship phone',
      sku: 'IPH-15-PRO',
      basePrice: 999.99,
      categoryId: smartphones.id,
      brandId: apple.id,
      rating: 4.8,
      reviewsCount: 125,
    },
  });

  const galaxyS24 = await prisma.product.upsert({
    where: { slug: 'galaxy-s24-ultra' },
    update: {},
    create: {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'galaxy-s24-ultra',
      description: 'Latest Samsung flagship with S Pen',
      shortDesc: 'Samsung flagship phone',
      sku: 'SAM-S24-Ultra',
      basePrice: 1199.99,
      categoryId: smartphones.id,
      brandId: samsung.id,
      rating: 4.7,
      reviewsCount: 98,
    },
  });

  const macbookPro = await prisma.product.upsert({
    where: { slug: 'macbook-pro-14' },
    update: {},
    create: {
      name: 'MacBook Pro 14"',
      slug: 'macbook-pro-14',
      description: 'Apple MacBook Pro with M3 Pro chip',
      shortDesc: 'Professional laptop',
      sku: 'MBP-14-M3',
      basePrice: 1999.99,
      categoryId: laptops.id,
      brandId: apple.id,
      rating: 4.9,
      reviewsCount: 67,
    },
  });

  console.log('Created products');

  // Create product variants
  await prisma.productVariant.createMany({
    data: [
      { productId: iphone15.id, color: 'Black', colorHex: '#000000', price: 999.99, stockQty: 50, sku: 'IPH-15-PRO-BLK' },
      { productId: iphone15.id, color: 'White', colorHex: '#FFFFFF', price: 999.99, stockQty: 45, sku: 'IPH-15-PRO-WHT' },
      { productId: iphone15.id, color: 'Blue', colorHex: '#0066CC', price: 999.99, stockQty: 30, sku: 'IPH-15-PRO-BLU' },
      { productId: galaxyS24.id, color: 'Titanium Black', colorHex: '#1A1A1A', price: 1199.99, stockQty: 40, sku: 'SAM-S24-BLK' },
      { productId: galaxyS24.id, color: 'Titanium Gray', colorHex: '#808080', price: 1199.99, stockQty: 35, sku: 'SAM-S24-GRY' },
      { productId: macbookPro.id, size: '14"', color: 'Space Black', colorHex: '#1A1A1A', price: 1999.99, stockQty: 20, sku: 'MBP-14-BLK' },
      { productId: macbookPro.id, size: '14"', color: 'Silver', colorHex: '#C0C0C0', price: 1999.99, stockQty: 25, sku: 'MBP-14-SLV' },
    ],
  });

  console.log('Created product variants');

  // Create banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Summer Sale',
        subtitle: 'Up to 50% off on electronics',
        imageUrl: '/banners/summer-sale.jpg',
        link: '/products?category=electronics',
        position: 'top',
        order: 1,
        isActive: true,
      },
      {
        title: 'New Arrivals',
        subtitle: 'Check out the latest products',
        imageUrl: '/banners/new-arrivals.jpg',
        link: '/products?sort=newest',
        position: 'middle',
        order: 1,
        isActive: true,
      },
    ],
  });

  console.log('Created banners');

  // Create weekly products
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  await prisma.weeklyProduct.createMany({
    data: [
      { productId: iphone15.id, weekStart, weekEnd, order: 1 },
      { productId: galaxyS24.id, weekStart, weekEnd, order: 2 },
      { productId: macbookPro.id, weekStart, weekEnd, order: 3 },
    ],
  });

  console.log('Created weekly products');

  console.log('Seeding completed!');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
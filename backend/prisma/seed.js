const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Realistic Kenyan farm produce categories
const categories = [
  'Vegetables',
  'Fruits',
  'Cereals',
  'Legumes',
  'Dairy Products',
  'Poultry',
  'Meat',
  'Herbs & Spices'
];

// Sample users data
const users = [
  {
    email: 'admin@agroconnect.ke',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Kamau',
    phoneNumber: '+254722123456',
    role: 'ADMIN'
  },
  {
    email: 'farmer1@gmail.com',
    password: 'password123',
    firstName: 'Mary',
    lastName: 'Wanjiku',
    phoneNumber: '+254733234567',
    role: 'FARMER',
    farmerRequestStatus: 'APPROVED'
  },
  {
    email: 'farmer2@gmail.com',
    password: 'password123',
    firstName: 'Peter',
    lastName: 'Mwangi',
    phoneNumber: '+254744345678',
    role: 'FARMER',
    farmerRequestStatus: 'APPROVED'
  },
  {
    email: 'farmer3@gmail.com',
    password: 'password123',
    firstName: 'Grace',
    lastName: 'Akinyi',
    phoneNumber: '+254755456789',
    role: 'FARMER',
    farmerRequestStatus: 'APPROVED'
  },
  {
    email: 'farmer4@gmail.com',
    password: 'password123',
    firstName: 'Samuel',
    lastName: 'Kiprop',
    phoneNumber: '+254766567890',
    role: 'FARMER',
    farmerRequestStatus: 'APPROVED'
  },
  {
    email: 'buyer1@gmail.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Njeri',
    phoneNumber: '+254777678901',
    role: 'BUYER'
  },
  {
    email: 'buyer2@gmail.com',
    password: 'password123',
    firstName: 'David',
    lastName: 'Ochieng',
    phoneNumber: '+254788789012',
    role: 'BUYER'
  },
  {
    email: 'buyer3@gmail.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Muthoni',
    phoneNumber: '+254799890123',
    role: 'BUYER'
  },
  {
    email: 'pending.farmer@gmail.com',
    password: 'password123',
    firstName: 'James',
    lastName: 'Mutua',
    phoneNumber: '+254700901234',
    role: 'BUYER',
    farmerRequestStatus: 'PENDING'
  }
];

// Realistic produce data with Unsplash images
const produceData = [
  // Vegetables
  {
    title: 'Fresh Tomatoes',
    description: 'Juicy red tomatoes grown organically in Kiambu. Perfect for salads and cooking.',
    price: 120.00,
    quantity: 150,
    unit: 'kg',
    location: 'Kiambu County',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1546470427-e5380e2523ef?w=500'
  },
  {
    title: 'Green Capsicums',
    description: 'Fresh bell peppers harvested this morning. Rich in vitamins and minerals.',
    price: 200.00,
    quantity: 80,
    unit: 'kg',
    location: 'Nakuru County',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500'
  },
  {
    title: 'Sukuma Wiki (Kales)',
    description: 'Fresh collard greens, a Kenyan staple vegetable. Packed with nutrients.',
    price: 50.00,
    quantity: 200,
    unit: 'bunches',
    location: 'Meru County',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500'
  },
  {
    title: 'Fresh Spinach',
    description: 'Organic spinach leaves, perfect for healthy meals and smoothies.',
    price: 80.00,
    quantity: 120,
    unit: 'bunches',
    location: 'Nyeri County',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500'
  },
  {
    title: 'Red Onions',
    description: 'Premium quality red onions with strong flavor. Essential for cooking.',
    price: 90.00,
    quantity: 300,
    unit: 'kg',
    location: 'Kajiado County',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500'
  },

  // Fruits
  {
    title: 'Sweet Bananas',
    description: 'Naturally ripened bananas from our farm. Sweet and nutritious.',
    price: 150.00,
    quantity: 100,
    unit: 'bunches',
    location: 'Machakos County',
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500'
  },
  {
    title: 'Fresh Mangoes',
    description: 'Juicy mangoes from the coast. Perfect sweetness and aroma.',
    price: 250.00,
    quantity: 75,
    unit: 'kg',
    location: 'Kilifi County',
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500'
  },
  {
    title: 'Avocados',
    description: 'Premium Hass avocados. Creamy texture and rich taste.',
    price: 300.00,
    quantity: 60,
    unit: 'kg',
    location: 'Murang\'a County',
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500'
  },
  {
    title: 'Oranges',
    description: 'Sweet and juicy oranges packed with Vitamin C.',
    price: 180.00,
    quantity: 120,
    unit: 'kg',
    location: 'Embu County',
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500'
  },

  // Cereals
  {
    title: 'White Maize',
    description: 'High quality white maize grain. Perfect for ugali and other dishes.',
    price: 45.00,
    quantity: 500,
    unit: 'kg',
    location: 'Trans Nzoia County',
    category: 'Cereals',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500'
  },
  {
    title: 'Brown Rice',
    description: 'Organic brown rice with high nutritional value.',
    price: 120.00,
    quantity: 200,
    unit: 'kg',
    location: 'Mwea, Kirinyaga County',
    category: 'Cereals',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'
  },
  {
    title: 'Wheat Grain',
    description: 'Premium wheat grain suitable for flour milling.',
    price: 55.00,
    quantity: 400,
    unit: 'kg',
    location: 'Uasin Gishu County',
    category: 'Cereals',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500'
  },

  // Legumes
  {
    title: 'Green Grams',
    description: 'Fresh green grams (mung beans) rich in protein.',
    price: 180.00,
    quantity: 150,
    unit: 'kg',
    location: 'Makueni County',
    category: 'Legumes',
    imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500'
  },
  {
    title: 'Red Kidney Beans',
    description: 'Premium quality kidney beans, excellent source of protein.',
    price: 200.00,
    quantity: 100,
    unit: 'kg',
    location: 'Bungoma County',
    category: 'Legumes',
    imageUrl: 'https://images.unsplash.com/photo-1562835155-a745737b818b?w=500'
  },

  // Dairy Products
  {
    title: 'Fresh Milk',
    description: 'Farm fresh cow milk, pasteurized and ready to drink.',
    price: 60.00,
    quantity: 200,
    unit: 'litres',
    location: 'Nyandarua County',
    category: 'Dairy Products',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500'
  },
  {
    title: 'Farm Butter',
    description: 'Homemade butter from fresh cream. Rich and creamy.',
    price: 800.00,
    quantity: 50,
    unit: 'kg',
    location: 'Nyandarua County',
    category: 'Dairy Products',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500'
  },

  // Poultry
  {
    title: 'Free Range Chicken',
    description: 'Healthy free-range chicken, naturally raised without antibiotics.',
    price: 600.00,
    quantity: 30,
    unit: 'birds',
    location: 'Kiambu County',
    category: 'Poultry',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500'
  },
  {
    title: 'Fresh Eggs',
    description: 'Farm fresh eggs from free-range chickens.',
    price: 15.00,
    quantity: 500,
    unit: 'pieces',
    location: 'Kiambu County',
    category: 'Poultry',
    imageUrl: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=500'
  },

  // Meat
  {
    title: 'Goat Meat',
    description: 'Fresh goat meat from pastured goats. Lean and flavorful.',
    price: 800.00,
    quantity: 25,
    unit: 'kg',
    location: 'Kajiado County',
    category: 'Meat',
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500'
  },

  // Herbs & Spices
  {
    title: 'Fresh Coriander',
    description: 'Aromatic coriander leaves for seasoning and garnishing.',
    price: 30.00,
    quantity: 100,
    unit: 'bunches',
    location: 'Meru County',
    category: 'Herbs & Spices',
    imageUrl: 'https://images.unsplash.com/photo-1509633829157-7d8ead8e4b11?w=500'
  },
  {
    title: 'Fresh Ginger',
    description: 'Organic ginger root with strong aroma and medicinal properties.',
    price: 350.00,
    quantity: 80,
    unit: 'kg',
    location: 'Nyeri County',
    category: 'Herbs & Spices',
    imageUrl: 'https://images.unsplash.com/photo-1536511468887-6d7b37e7dc44?w=500'
  }
];

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.produce.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Seed Categories
    console.log('📂 Seeding categories...');
    const createdCategories = [];
    for (const categoryName of categories) {
      const category = await prisma.category.create({
        data: {
          id: uuidv4(),
          name: categoryName,
        },
      });
      createdCategories.push(category);
      console.log(`✅ Created category: ${categoryName}`);
    }

    // Seed Users
    console.log('👥 Seeding users...');
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcryptjs.hash(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          role: userData.role,
          farmerRequestStatus: userData.farmerRequestStatus || 'NOT_REQUESTED',
        },
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${userData.firstName} ${userData.lastName} (${userData.role})`);
    }

    // Get farmers for produce seeding
    const farmers = createdUsers.filter(user => user.role === 'FARMER');

    // Seed Produce
    console.log('🥕 Seeding produce...');
    const createdProduce = [];
    for (let i = 0; i < produceData.length; i++) {
      const produce = produceData[i];
      const category = createdCategories.find(cat => cat.name === produce.category);
      const farmer = farmers[i % farmers.length]; // Distribute produce among farmers

      // Create date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const harvestDate = new Date();
      harvestDate.setDate(harvestDate.getDate() - daysAgo);

      const createdProduceItem = await prisma.produce.create({
        data: {
          id: uuidv4(),
          title: produce.title,
          description: produce.description,
          price: produce.price,
          quantity: produce.quantity,
          unit: produce.unit,
          date: harvestDate,
          location: produce.location,
          categoryId: category.id,
          farmerId: farmer.id,
          imageUrl: produce.imageUrl,
          status: 'AVAILABLE',
        },
      });
      createdProduce.push(createdProduceItem);
      console.log(`✅ Created produce: ${produce.title}`);
    }

    // Seed Orders
    console.log('🛒 Seeding orders...');
    const buyers = createdUsers.filter(user => user.role === 'BUYER');
    
    for (let i = 0; i < 15; i++) {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      const selectedProduce = [];
      let totalPrice = 0;

      // Select random produce items
      for (let j = 0; j < numItems; j++) {
        const randomProduce = createdProduce[Math.floor(Math.random() * createdProduce.length)];
        const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 quantity
        const itemPrice = randomProduce.price * quantity;
        
        selectedProduce.push({
          produceId: randomProduce.id,
          quantity: quantity,
          price: randomProduce.price,
        });
        
        totalPrice += Number(itemPrice);
      }

      // Create order date within last 14 days
      const orderDaysAgo = Math.floor(Math.random() * 14);
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - orderDaysAgo);

      const order = await prisma.order.create({
        data: {
          id: uuidv4(),
          userId: buyer.id,
          totalPrice: totalPrice,
          status: ['CONFIRMED', 'SHIPPED', 'DELIVERED'][Math.floor(Math.random() * 3)],
          paymentStatus: 'COMPLETED',
          paymentMethod: 'MPESA',
          verified: true,
          createdAt: orderDate,
          orderItems: {
            create: selectedProduce.map(item => ({
              id: uuidv4(),
              produceId: item.produceId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      console.log(`✅ Created order: ${order.id} for ${buyer.firstName} ${buyer.lastName}`);
    }

    // Create some pending farmer requests
    console.log('📋 Creating additional farmer requests...');
    const pendingRequests = [
      {
        email: 'aspiring.farmer1@gmail.com',
        firstName: 'Michael',
        lastName: 'Kiprotich',
        phoneNumber: '+254712345678'
      },
      {
        email: 'aspiring.farmer2@gmail.com',
        firstName: 'Catherine',
        lastName: 'Waweru',
        phoneNumber: '+254723456789'
      }
    ];

    for (const request of pendingRequests) {
      const hashedPassword = await bcryptjs.hash('password123', 10);
      await prisma.user.create({
        data: {
          id: uuidv4(),
          email: request.email,
          password: hashedPassword,
          firstName: request.firstName,
          lastName: request.lastName,
          phoneNumber: request.phoneNumber,
          role: 'BUYER',
          farmerRequestStatus: 'PENDING',
        },
      });
      console.log(`✅ Created pending farmer request: ${request.firstName} ${request.lastName}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Users: ${users.length + pendingRequests.length}`);
    console.log(`- Produce Items: ${produceData.length}`);
    console.log(`- Orders: 15`);
    console.log('\n🔐 Test Credentials:');
    console.log('Admin: admin@agroconnect.ke / admin123');
    console.log('Farmer: farmer1@gmail.com / password123');
    console.log('Buyer: buyer1@gmail.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
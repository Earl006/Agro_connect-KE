import { PrismaClient, Produce, Prisma } from '@prisma/client';
import { uploadToCloudinary } from '../utils/cloudinary.utils';

const prisma = new PrismaClient();

interface CreateProduceInput {
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  date: Date;
  location: string;
  categoryId: string;
  farmerId: string;
  image: Express.Multer.File;
}

interface UpdateProduceInput {
  title?: string;
  description?: string;
  price?: number;
  quantity?: number;
  unit?: string;
  date?: Date;
  location?: string;
  categoryId?: string;
  status?: 'AVAILABLE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  image?: Express.Multer.File;
}

export class ProduceService {
  static async createProduce(input: CreateProduceInput, farmerId: string): Promise<Produce> {
    // Validate farmer exists
    const farmer = await prisma.user.findFirst({
      where: {
        id: farmerId,
        role: 'FARMER'
      }
    });
  
    if (!farmer) {
      throw new Error('User is not authorized as a farmer');
    }
  
    // Upload image
    const imageUrl = await uploadToCloudinary(input.image);
  
    // Create produce with farmerId from token
    return prisma.produce.create({
      data: {
        title: input.title,
        description: input.description,
        price: new Prisma.Decimal(input.price),
        quantity: parseInt(input.quantity.toString()),
        unit: input.unit,
        date: input.date,
        location: input.location,
        imageUrl: imageUrl,
        category: {
          connect: { id: input.categoryId }
        },
        farmer: {
          connect: { id: farmerId } // Use farmerId from token
        }
      },
      include: {
        category: true,
        farmer: true
      }
    });
  }

  static async getProduceById(id: string): Promise<Produce | null> {
    return prisma.produce.findUnique({
      where: { id },
      include: {
        category: true,
        farmer: true,
      },
    });
  }

  static async getAllProduce(
    skip: number = 0,
    take: number = 10,
    where?: Prisma.ProduceWhereInput
  ): Promise<{ produce: Produce[]; total: number }> {
    const [produce, total] = await Promise.all([
      prisma.produce.findMany({
        skip,
        take,
        where,
        include: {
          category: true,
          farmer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.produce.count({ where }),
    ]);

    return { produce, total };
  }

  static async getFarmerProduce(
    farmerId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ produce: Produce[]; total: number }> {
    return this.getAllProduce(skip, take, { farmerId });
  }

  static async updateProduce(id: string, input: UpdateProduceInput): Promise<Produce> {
    const data: any = {};
    
    // Handle regular fields
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.unit !== undefined) data.unit = input.unit;
    if (input.date !== undefined) data.date = input.date;
    if (input.location !== undefined) data.location = input.location;
    if (input.status !== undefined) data.status = input.status;
    
    // Handle image upload
    if (input.image) {
      data.imageUrl = await uploadToCloudinary(input.image);
    }
    
    // Handle price conversion
    if (input.price !== undefined) {
      data.price = new Prisma.Decimal(input.price);
    }
    
    // Handle quantity conversion
    if (input.quantity !== undefined) {
      data.quantity = parseInt(input.quantity.toString());
    }
    
    // Handle category relationship
    if (input.categoryId) {
      data.category = {
        connect: { id: input.categoryId }
      };
    }

    return prisma.produce.update({
      where: { id },
      data,
      include: {
        category: true,
        farmer: true,
      },
    });
  }

  static async deleteProduce(id: string): Promise<Produce> {
    return prisma.produce.delete({
      where: { id },
    });
  }

  static async searchProduce(
    query: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ produce: Produce[]; total: number }> {
    const where: Prisma.ProduceWhereInput = {
      OR: [
        { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { location: { contains: query, mode: Prisma.QueryMode.insensitive } },
      ],
    };

    return this.getAllProduce(skip, take, where);
  }

  static async getProduceByCategory(
    categoryId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ produce: Produce[]; total: number }> {
    return this.getAllProduce(skip, take, { categoryId });
  }

  static async updateProduceStatus(id: string, status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'ARCHIVED'): Promise<Produce> {
    return prisma.produce.update({
      where: { id },
      data: { status },
      include: {
        category: true,
        farmer: true,
      },
    });
  }
}
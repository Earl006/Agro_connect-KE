import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import produceRoutes from './routes/produce.routes';
import orderRoutes from './routes/order.routes';

const cors = require('cors');
const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is alive',
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', produceRoutes);
app.use('/api/order', orderRoutes);

export default app;
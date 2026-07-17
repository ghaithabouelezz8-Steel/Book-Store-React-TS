import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

// 1. PLACE A NEW ORDER (Authenticated Users)
export async function createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { items } = req.body; 
    

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Order must contain at least one item.' });
      return;
    }

    const order = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const book = await tx.book.findUnique({ where: { id: item.bookId } });

        if (!book) {
          throw new Error(`Book with ID ${item.bookId} not found.`);
        }

        if (book.stock < item.quantity) {
          throw new Error(`Insufficient stock for book: ${book.title}. Available: ${book.stock}`);
        }

        await tx.book.update({
          where: { id: book.id },
          data: { stock: book.stock - item.quantity },
        });

        const itemTotal = book.price * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          bookId: book.id,
          quantity: Number(item.quantity),
          priceAtPurchase: book.price,
        });
      }

      return await tx.order.create({
        data: {
          userId,
          totalAmount,
          orderItems: { 
            create: orderItemsData,
          },
        },
        include: {
          orderItems: true, 
        },
      });
    });

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to place order' });
  }
}

// 2. GET USER ORDER HISTORY (Authenticated Users)
export async function getUserOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { 
          include: {
            book: true, 
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order history' });
  }
}
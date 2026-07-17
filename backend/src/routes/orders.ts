import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface CheckoutItem {
  id: string;
  quantity: number;
}

// POST /api/orders/checkout
router.post('/checkout', async (req: Request, res: Response): Promise<any> => {
  try {
    const { items, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Your shopping cart is completely empty." });
    }

    if (!userId) {
      return res.status(400).json({ error: "User authentication identification is required to complete orders." });
    }

    // Execute safe database operations inside an isolated batch transaction
    const finalOrder = await prisma.$transaction(async (tx) => {
      let calculatedTotal = 0;
      const orderItemsData = [];

      for (const item of items as CheckoutItem[]) {
        const dbBook = await tx.book.findUnique({
          where: { id: item.id }
        });

        if (!dbBook) {
          throw new Error(`Book with ID ${item.id} could not be found.`);
        }

        if (dbBook.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${dbBook.title}". Only ${dbBook.stock} remaining.`);
        }

        // 1. Deduct stock safely from inventory
        await tx.book.update({
          where: { id: item.id },
          data: { stock: dbBook.stock - item.quantity }
        });

        calculatedTotal += dbBook.price * item.quantity;

        // 2. Map payload arrays to mirror OrderItem exact schemas
        orderItemsData.push({
          bookId: item.id,
          quantity: item.quantity,
          priceAtPurchase: dbBook.price, // 👈 Matches your schema perfectly
        });
      }

      // 3. Create the parent Order record linked to its child items
      return await tx.order.create({
        data: {
          userId: userId,
          totalAmount: calculatedTotal, // 👈 Matches your schema perfectly
          orderItems: {                 // 👈 Matches your schema perfectly
            create: orderItemsData
          }
        },
        include: {
          orderItems: true
        }
      });
    });

    return res.status(201).json({ message: "Order placed successfully! 🚀", order: finalOrder });

  } catch (error: any) {
    console.error("Checkout transaction failed:", error.message);
    return res.status(400).json({ error: error.message || "An unexpected error occurred during processing." });
  }
});

export default router;
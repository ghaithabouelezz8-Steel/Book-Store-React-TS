import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to force 'id' into a clean string format
function cleanId(idParam: any): string {
  if (Array.isArray(idParam)) {
    return String(idParam[0]);
  }
  return String(idParam || '');
}

// 1. GET ALL BOOKS (Public)
export async function getAllBooks(req: Request, res: Response): Promise<void> {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books' });
  }
}

// 2. GET SINGLE BOOK BY ID (Public)
export async function getBookById(req: Request, res: Response): Promise<void> {
  try {
    const id = cleanId(req.params.id);

    if (!id) {
      res.status(400).json({ error: 'Invalid or missing Book ID' });
      return;
    }

    const book = await prisma.book.findUnique({ 
      where: { id } 
    });

    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the book' });
  }
}

// 3. CREATE BOOK (Admin Only)
export async function createBook(req: Request, res: Response): Promise<void> {
  try {
    // 1. Destructure coverImage from req.body explicitly
    const { title, author, description, price, stock, coverImage } = req.body;

    if (!title || !author || !description || price === undefined || stock === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // 2. We use fallback to null if coverImage wasn't provided in the request
    const newBook = await prisma.book.create({
      data: { 
        title, 
        author, 
        description, 
        price, 
        stock, 
        coverImage: coverImage || null 
      },
    });

    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
}

// 4. UPDATE BOOK (Admin Only)
export async function updateBook(req: Request, res: Response): Promise<void> {
  try {
    const id = cleanId(req.params.id);

    if (!id) {
      res.status(400).json({ error: 'Invalid or missing Book ID' });
      return;
    }

    // Explicitly destructure coverImage here too
    const { title, author, description, price, stock, coverImage } = req.body;

    const updatedBook = await prisma.book.update({
      where: { id },
      data: { 
        title, 
        author, 
        description, 
        price, 
        stock, 
        coverImage: coverImage !== undefined ? coverImage : undefined 
      },
    });

    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book. Ensure the ID is valid.' });
  }
}

// 5. DELETE BOOK (Admin Only)
export async function deleteBook(req: Request, res: Response): Promise<void> {
  try {
    const id = cleanId(req.params.id);

    if (!id) {
      res.status(400).json({ error: 'Invalid or missing Book ID' });
      return;
    }

    await prisma.book.delete({ 
      where: { id } 
    });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book. Ensure the ID is valid.' });
  }
}
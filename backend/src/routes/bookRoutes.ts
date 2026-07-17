import { Router } from 'express';
import { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook 
} from '../controllers/bookController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Protected Admin routes
router.post('/', authenticateToken, requireRole(['ADMIN']), createBook);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), updateBook);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteBook);

export default router;
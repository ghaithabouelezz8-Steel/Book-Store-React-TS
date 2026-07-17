import { Router, Response } from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route - requires a valid JWT token
router.get('/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  // Because of our middleware, req.user is guaranteed to exist here
  res.json({
    message: 'Welcome to your private profile dashboard!',
    user: req.user,
  });
});

export default router;
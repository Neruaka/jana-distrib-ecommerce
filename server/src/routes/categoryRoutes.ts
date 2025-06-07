import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Routes publiques
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Routes protégées (admin seulement)
router.post('/', authenticateToken, requireAdmin, createCategory);
router.put('/:id', authenticateToken, requireAdmin, updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);

export default router;
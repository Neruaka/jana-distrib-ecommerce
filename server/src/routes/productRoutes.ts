import { Router } from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getAvailableProducts,
  setProductOutOfStock,
  setProductInStock,
  uploadProductImage
} from '../controllers/productController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Routes publiques
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/available', getAvailableProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProductById);

// Routes protégées (admin seulement)
router.post('/', authenticateToken, requireAdmin, createProduct);
router.put('/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

// Routes pour la gestion de la disponibilité
router.put('/:id/out-of-stock', authenticateToken, requireAdmin, setProductOutOfStock);
router.put('/:id/in-stock', authenticateToken, requireAdmin, setProductInStock);

// Route pour l'upload d'images
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), uploadProductImage);

export default router;
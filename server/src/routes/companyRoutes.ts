import { Router } from 'express';
import { getCompany, updateCompanyInfo } from '../controllers/companyController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Route publique pour récupérer les informations de l'entreprise
router.get('/', getCompany);

// Route protégée pour les admins pour mettre à jour les informations de l'entreprise
router.put('/:id', authenticateToken, requireAdmin, updateCompanyInfo);

export default router;
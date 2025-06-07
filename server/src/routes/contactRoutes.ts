import { Router } from 'express';
import { sendContactMessage, getContactInfo } from '../controllers/contactController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting pour les messages de contact (max 5 messages par heure par IP)
const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5, // Maximum 5 messages par heure
  message: {
    error: 'Trop de messages envoyés. Veuillez réessayer dans une heure.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
router.post('/send', contactRateLimit, sendContactMessage);
router.get('/info', getContactInfo);

export default router;
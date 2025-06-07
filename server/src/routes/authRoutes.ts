import express from 'express';
import { login, verifyToken } from '../controllers/authController';

const router = express.Router();

// Route de connexion
router.post('/login', login);

// Route de vérification de token
router.get('/verify-token', verifyToken);

export default router;
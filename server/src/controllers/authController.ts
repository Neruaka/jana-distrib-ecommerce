import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { findAdminByEmail, updateAdminPassword, updateAdminResetToken, findAdminByResetToken } from '../models/adminModel';
import { sendEmail, createResetPasswordEmailTemplate } from '../utils/emailService';

// Get JWT secret with fallback
const getJWTSecret = (): string => {
  return process.env.JWT_SECRET || 'default_secret';
};

// Connexion admin
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Chercher l'admin par email
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      getJWTSecret(),
      { expiresIn: '24h' }
    );

    // Retourner le token et les infos admin (sans le mot de passe)
    return res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Demande de réinitialisation de mot de passe
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // Chercher l'admin par email
    const admin = await findAdminByEmail(email);
    if (!admin) {
      // Pour des raisons de sécurité, on retourne toujours success même si l'email n'existe pas
      return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    }

    // Générer un token de réinitialisation sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Hasher le token pour le stockage
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Sauvegarder le token hashé dans la base de données
    await updateAdminResetToken(admin.id, hashedResetToken, resetTokenExpiry);

    // Créer et envoyer l'email
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const emailTemplate = createResetPasswordEmailTemplate(resetToken, clientUrl);

    await sendEmail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Jana Distrib',
      html: emailTemplate
    });

    return res.json({ 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' 
    });

  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'envoi de l\'email' });
  }
};

// Réinitialisation du mot de passe
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token et nouveau mot de passe requis' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Hasher le token reçu pour le comparer
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Chercher l'admin avec ce token et vérifier qu'il n'a pas expiré
    const admin = await findAdminByResetToken(hashedToken);
    
    if (!admin || !admin.reset_token_expiry || admin.reset_token_expiry < new Date()) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe et supprimer le token de réinitialisation
    await updateAdminPassword(admin.id, hashedPassword);
    await updateAdminResetToken(admin.id, null, null);

    return res.json({ message: 'Mot de passe réinitialisé avec succès' });

  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Vérification du token
export const verifyToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ valid: false });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2) {
      return res.json({ valid: false });
    }

    const token = tokenParts[1];
    if (!token) {
      return res.json({ valid: false });
    }
    
    try {
      const decoded = jwt.verify(token, getJWTSecret()) as any;
      
      // Vérifier que l'admin existe toujours
      const admin = await findAdminByEmail(decoded.email);
      if (!admin) {
        return res.json({ valid: false });
      }

      return res.json({
        valid: true,
        admin: {
          id: admin.id,
          email: admin.email
        }
      });
    } catch (jwtError) {
      return res.json({ valid: false });
    }

  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return res.json({ valid: false });
  }
};
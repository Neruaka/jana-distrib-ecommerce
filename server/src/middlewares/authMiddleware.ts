import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface pour étendre la requête avec l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Get JWT secret with fallback
const getJWTSecret = (): string => {
  return process.env.JWT_SECRET || 'default_secret';
};

// Middleware pour authentifier le token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
      return;
    }
    
    // Extraire le token
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2) {
      res.status(401).json({ message: 'Format de token invalide.' });
      return;
    }
    
    const token = tokenParts[1];
    if (!token) {
      res.status(401).json({ message: 'Token manquant.' });
      return;
    }
    
    // Vérifier le token
    const decoded = jwt.verify(token, getJWTSecret());
    
    // Ajouter l'utilisateur à l'objet de requête
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Middleware pour vérifier les droits d'administration
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentification requise' });
    return;
  }
  
  // Pour cet exemple, on considère que tous les utilisateurs authentifiés sont des admins
  // Dans un vrai projet, vous vérifieriez les rôles/permissions ici
  next();
};

// Export de l'ancien nom pour la compatibilité
export const authMiddleware = authenticateToken;
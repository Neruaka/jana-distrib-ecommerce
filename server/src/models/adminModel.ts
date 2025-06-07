import pool from '../config/db';
import bcrypt from 'bcrypt';

export interface Admin {
  id: number;
  email: string;
  password: string;
  reset_token?: string;
  reset_token_expiry?: Date;
  created_at: Date;
  updated_at: Date;
}

// Trouver un admin par email
export const findAdminByEmail = async (email: string): Promise<Admin | null> => {
  try {
    const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'admin:', error);
    throw error;
  }
};

// Trouver un admin par token de réinitialisation
export const findAdminByResetToken = async (hashedToken: string): Promise<Admin | null> => {
  try {
    const result = await pool.query(
      'SELECT * FROM admin WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [hashedToken]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur lors de la recherche par token de réinitialisation:', error);
    throw error;
  }
};

// Créer un nouvel admin
export const createAdmin = async (email: string, password: string): Promise<Admin> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO admin (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la création d\'admin:', error);
    throw error;
  }
};

// Mettre à jour le mot de passe d'un admin par ID
export const updateAdminPassword = async (adminId: number, hashedPassword: string): Promise<void> => {
  try {
    await pool.query(
      'UPDATE admin SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, adminId]
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    throw error;
  }
};

// Mettre à jour le token de réinitialisation d'un admin
export const updateAdminResetToken = async (
  adminId: number, 
  resetToken: string | null, 
  resetTokenExpiry: Date | null
): Promise<void> => {
  try {
    await pool.query(
      'UPDATE admin SET reset_token = $1, reset_token_expiry = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [resetToken, resetTokenExpiry, adminId]
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du token de réinitialisation:', error);
    throw error;
  }
};

// Définir un token de réinitialisation (legacy - pour compatibilité)
export const setResetToken = async (email: string, token: string, expires: Date): Promise<void> => {
  try {
    await pool.query(
      'UPDATE admin SET reset_token = $1, reset_token_expiry = $2, updated_at = CURRENT_TIMESTAMP WHERE email = $3',
      [token, expires, email]
    );
  } catch (error) {
    console.error('Erreur lors de la définition du token de réinitialisation:', error);
    throw error;
  }
};

// Récupérer un admin par token de réinitialisation (legacy - pour compatibilité)
export const getAdminByResetToken = async (token: string): Promise<Admin | null> => {
  try {
    const result = await pool.query(
      'SELECT * FROM admin WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [token]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur lors de la recherche par token de réinitialisation:', error);
    throw error;
  }
};

// Exports pour compatibilité
export const getAdminByEmail = findAdminByEmail;
export const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
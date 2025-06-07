import pool from '../config/db';

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// Récupérer toutes les catégories
export const getAllCategoriesFromDB = async (): Promise<Category[]> => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
};

// Récupérer une catégorie par ID
export const getCategoryByIdFromDB = async (id: number): Promise<Category | null> => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    throw error;
  }
};

// Créer une nouvelle catégorie
export const createCategoryInDB = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  try {
    const { name, description } = categoryData;
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    throw error;
  }
};

// Mettre à jour une catégorie
export const updateCategoryInDB = async (id: number, categoryData: Partial<Category>): Promise<Category | null> => {
  try {
    const { name, description } = categoryData;
    const result = await pool.query(
      `UPDATE categories 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [name, description, id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    throw error;
  }
};

// Supprimer une catégorie
export const deleteCategoryFromDB = async (id: number): Promise<boolean> => {
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    throw error;
  }
};
import pool from '../config/db';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price_ht: number;
  tva: number;
  is_available: boolean; // Remplace 'stock' par un booléen simple
  image_url?: string;
  category_id: number;
  is_fresh: boolean;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

// Récupérer tous les produits
export const getAllProductsFromDB = async (): Promise<Product[]> => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
};

// Récupérer un produit par ID
export const getProductByIdFromDB = async (id: number): Promise<Product | null> => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    throw error;
  }
};

// Créer un nouveau produit
export const createProductInDB = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  try {
    const {
      name,
      description,
      price_ht,
      tva,
      is_available,
      image_url,
      category_id,
      is_fresh,
      is_featured
    } = productData;

    const result = await pool.query(`
      INSERT INTO products (name, description, price_ht, tva, is_available, image_url, category_id, is_fresh, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [name, description, price_ht, tva, is_available, image_url, category_id, is_fresh, is_featured]);

    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    throw error;
  }
};

// Mettre à jour un produit
export const updateProductInDB = async (id: number, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const {
      name,
      description,
      price_ht,
      tva,
      is_available,
      image_url,
      category_id,
      is_fresh,
      is_featured
    } = productData;

    const result = await pool.query(`
      UPDATE products 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price_ht = COALESCE($3, price_ht),
          tva = COALESCE($4, tva),
          is_available = COALESCE($5, is_available),
          image_url = COALESCE($6, image_url),
          category_id = COALESCE($7, category_id),
          is_fresh = COALESCE($8, is_fresh),
          is_featured = COALESCE($9, is_featured),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [name, description, price_ht, tva, is_available, image_url, category_id, is_fresh, is_featured, id]);

    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    throw error;
  }
};

// Supprimer un produit
export const deleteProductFromDB = async (id: number): Promise<boolean> => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    throw error;
  }
};

// Récupérer les produits par catégorie
export const getProductsByCategoryFromDB = async (categoryId: number): Promise<Product[]> => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.category_id = $1 
      ORDER BY p.created_at DESC
    `, [categoryId]);
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error);
    throw error;
  }
};

// Récupérer les produits en vedette
export const getFeaturedProductsFromDB = async (): Promise<Product[]> => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_featured = true AND p.is_available = true
      ORDER BY p.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits en vedette:', error);
    throw error;
  }
};

// Récupérer les produits disponibles
export const getAvailableProductsFromDB = async (): Promise<Product[]> => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_available = true
      ORDER BY p.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits disponibles:', error);
    throw error;
  }
};
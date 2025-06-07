import pool from '../config/db';

export interface Company {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  siret?: string;
  tva_number?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}

// Récupérer les informations de l'entreprise
export const getCompanyInfo = async (): Promise<Company | null> => {
  try {
    const result = await pool.query('SELECT * FROM company ORDER BY id LIMIT 1');
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de l\'entreprise:', error);
    throw error;
  }
};

// Mettre à jour les informations de l'entreprise
export const updateCompany = async (id: number, companyData: Partial<Company>): Promise<Company | null> => {
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      website,
      siret,
      tva_number,
      logo_url
    } = companyData;

    const result = await pool.query(
      `UPDATE company 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           address = COALESCE($3, address),
           phone = COALESCE($4, phone),
           email = COALESCE($5, email),
           website = COALESCE($6, website),
           siret = COALESCE($7, siret),
           tva_number = COALESCE($8, tva_number),
           logo_url = COALESCE($9, logo_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [name, description, address, phone, email, website, siret, tva_number, logo_url, id]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
    throw error;
  }
};
import { Request, Response } from 'express';
import { getCompanyInfo, updateCompany } from '../models/companyModel';

// Récupérer les informations de l'entreprise
export const getCompany = async (req: Request, res: Response): Promise<Response> => {
  try {
    const company = await getCompanyInfo();
    return res.json(company);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de l\'entreprise:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de la récupération des informations de l\'entreprise' 
    });
  }
};

// Mettre à jour les informations de l'entreprise
export const updateCompanyInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const companyData = req.body;
    
    if (!id) {
      return res.status(400).json({ message: 'ID d\'entreprise requis' });
    }
    
    const companyId = parseInt(id, 10);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: 'ID d\'entreprise invalide' });
    }
    
    const updatedCompany = await updateCompany(companyId, companyData);
    
    if (!updatedCompany) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    
    return res.json(updatedCompany);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de l\'entreprise' 
    });
  }
};
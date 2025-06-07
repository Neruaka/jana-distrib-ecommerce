import { Request, Response } from 'express';
import { 
  getAllCategoriesFromDB, 
  getCategoryByIdFromDB, 
  createCategoryInDB, 
  updateCategoryInDB, 
  deleteCategoryFromDB 
} from '../models/categoryModel';

// Récupérer toutes les catégories
export const getAllCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const categories = await getAllCategoriesFromDB();
    return res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer une catégorie par ID
export const getCategoryById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de catégorie requis' });
    }
    
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'ID de catégorie invalide' });
    }
    
    const category = await getCategoryByIdFromDB(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    return res.json(category);
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une nouvelle catégorie
export const createCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const categoryData = req.body;
    const newCategory = await createCategoryInDB(categoryData);
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de catégorie requis' });
    }
    
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'ID de catégorie invalide' });
    }
    
    const categoryData = req.body;
    const updatedCategory = await updateCategoryInDB(categoryId, categoryData);
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    return res.json(updatedCategory);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une catégorie
export const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de catégorie requis' });
    }
    
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'ID de catégorie invalide' });
    }
    
    const deleted = await deleteCategoryFromDB(categoryId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    return res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
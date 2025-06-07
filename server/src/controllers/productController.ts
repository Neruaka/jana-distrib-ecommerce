import { Request, Response } from 'express';
import { 
  getAllProductsFromDB, 
  getProductByIdFromDB, 
  createProductInDB, 
  updateProductInDB, 
  deleteProductFromDB,
  getFeaturedProductsFromDB,
  getProductsByCategoryFromDB,
  getAvailableProductsFromDB
} from '../models/productModel';

// Récupérer tous les produits
export const getAllProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const products = await getAllProductsFromDB();
    return res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un produit par ID
export const getProductById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de produit requis' });
    }
    
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }
    
    const product = await getProductByIdFromDB(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    return res.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouveau produit
export const createProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      name,
      description,
      price_ht,
      tva,
      is_available = true, // Par défaut, nouveau produit est disponible
      image_url,
      category_id,
      is_fresh = false,
      is_featured = false
    } = req.body;

    // Validation des champs requis
    if (!name || !price_ht || !tva || !category_id) {
      return res.status(400).json({ 
        message: 'Les champs nom, prix HT, TVA et catégorie sont requis' 
      });
    }

    const productData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      price_ht: parseFloat(price_ht),
      tva: parseFloat(tva),
      is_available: Boolean(is_available),
      image_url: image_url ? image_url.trim() : null,
      category_id: parseInt(category_id),
      is_fresh: Boolean(is_fresh),
      is_featured: Boolean(is_featured)
    };

    const newProduct = await createProductInDB(productData);
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un produit
export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de produit requis' });
    }
    
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }
    
    const productData = req.body;
    
    // Convertir les types si nécessaire
    if (productData.price_ht) productData.price_ht = parseFloat(productData.price_ht);
    if (productData.tva) productData.tva = parseFloat(productData.tva);
    if (productData.category_id) productData.category_id = parseInt(productData.category_id);
    if (productData.is_available !== undefined) productData.is_available = Boolean(productData.is_available);
    if (productData.is_fresh !== undefined) productData.is_fresh = Boolean(productData.is_fresh);
    if (productData.is_featured !== undefined) productData.is_featured = Boolean(productData.is_featured);
    
    const updatedProduct = await updateProductInDB(productId, productData);
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    return res.json(updatedProduct);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un produit
export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de produit requis' });
    }
    
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }
    
    const deleted = await deleteProductFromDB(productId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    return res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les produits vedettes
export const getFeaturedProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const products = await getFeaturedProductsFromDB();
    return res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits vedettes:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les produits par catégorie
export const getProductsByCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { categoryId } = req.params;
    
    if (!categoryId) {
      return res.status(400).json({ message: 'ID de catégorie requis' });
    }
    
    const categoryIdNum = parseInt(categoryId, 10);
    if (isNaN(categoryIdNum)) {
      return res.status(400).json({ message: 'ID de catégorie invalide' });
    }
    
    const products = await getProductsByCategoryFromDB(categoryIdNum);
    return res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les produits disponibles
export const getAvailableProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const products = await getAvailableProductsFromDB();
    return res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits disponibles:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre un produit en rupture de stock
export const setProductOutOfStock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de produit requis' });
    }
    
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }
    
    const updatedProduct = await updateProductInDB(productId, { is_available: false });
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    return res.json({ 
      message: 'Produit mis en rupture de stock',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Erreur lors de la mise en rupture:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Remettre un produit en stock
export const setProductInStock = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de produit requis' });
    }
    
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }
    
    const updatedProduct = await updateProductInDB(productId, { is_available: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    return res.json({ 
      message: 'Produit remis en stock',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Erreur lors de la remise en stock:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Upload d'image pour produit
export const uploadProductImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    // Construire l'URL relative de l'image
    const imageUrl = `/uploads/${req.file.filename}`;
    
    return res.json({ 
      message: 'Image uploadée avec succès',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    return res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image' });
  }
};
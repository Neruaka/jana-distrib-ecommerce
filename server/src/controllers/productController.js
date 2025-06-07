"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getFeaturedProducts = exports.getProductsByCategory = exports.getProductById = exports.getAllProducts = void 0;
const productModel = __importStar(require("../models/productModel"));
// Récupérer tous les produits
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel.getAllProducts();
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
});
exports.getAllProducts = getAllProducts;
// Récupérer un produit par son ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const product = yield productModel.getProductById(id);
        if (!product) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
    }
});
exports.getProductById = getProductById;
// Récupérer les produits par catégorie
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const products = yield productModel.getProductsByCategory(categoryId);
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits par catégorie' });
    }
});
exports.getProductsByCategory = getProductsByCategory;
// Récupérer les produits mis en avant
const getFeaturedProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const featuredProducts = yield productModel.getFeaturedProducts();
        res.status(200).json(featuredProducts);
    }
    catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits mis en avant' });
    }
});
exports.getFeaturedProducts = getFeaturedProducts;
// Créer un nouveau produit
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProduct = yield productModel.createProduct(req.body);
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Erreur lors de la création du produit' });
    }
});
exports.createProduct = createProduct;
// Mettre à jour un produit
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const updatedProduct = yield productModel.updateProduct(id, req.body);
        if (!updatedProduct) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
    }
});
exports.updateProduct = updateProduct;
// Supprimer un produit
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const deleted = yield productModel.deleteProduct(id);
        if (!deleted) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }
        res.status(200).json({ message: 'Produit supprimé avec succès' });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
    }
});
exports.deleteProduct = deleteProduct;

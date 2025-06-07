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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const categoryModel = __importStar(require("../models/categoryModel"));
// Récupérer toutes les catégories
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryModel.getAllCategories();
        res.status(200).json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
    }
});
exports.getAllCategories = getAllCategories;
// Récupérer une catégorie par son ID
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const category = yield categoryModel.getCategoryById(id);
        if (!category) {
            res.status(404).json({ message: 'Catégorie non trouvée' });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie' });
    }
});
exports.getCategoryById = getCategoryById;
// Créer une nouvelle catégorie
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCategory = yield categoryModel.createCategory(req.body);
        res.status(201).json(newCategory);
    }
    catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
    }
});
exports.createCategory = createCategory;
// Mettre à jour une catégorie
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const updatedCategory = yield categoryModel.updateCategory(id, req.body);
        if (!updatedCategory) {
            res.status(404).json({ message: 'Catégorie non trouvée' });
            return;
        }
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie' });
    }
});
exports.updateCategory = updateCategory;
// Supprimer une catégorie
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const deleted = yield categoryModel.deleteCategory(id);
        if (!deleted) {
            res.status(404).json({ message: 'Catégorie non trouvée' });
            return;
        }
        res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie' });
    }
});
exports.deleteCategory = deleteCategory;

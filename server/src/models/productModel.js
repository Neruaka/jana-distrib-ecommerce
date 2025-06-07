"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getFeaturedProducts = exports.getProductsByCategory = exports.getProductById = exports.getAllProducts = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.name
  `);
    return result.rows;
});
exports.getAllProducts = getAllProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `, [id]);
    return result.rows.length ? result.rows[0] : null;
});
exports.getProductById = getProductById;
const getProductsByCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = $1
    ORDER BY p.name
  `, [categoryId]);
    return result.rows;
});
exports.getProductsByCategory = getProductsByCategory;
const getFeaturedProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_featured = true
    ORDER BY p.name
  `);
    return result.rows;
});
exports.getFeaturedProducts = getFeaturedProducts;
const createProduct = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(`
    INSERT INTO products 
    (name, description, price_ht, tva, stock, image_url, category_id, is_fresh, is_featured) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING *
  `, [
        product.name,
        product.description,
        product.price_ht,
        product.tva,
        product.stock,
        product.image_url,
        product.category_id,
        product.is_fresh,
        product.is_featured
    ]);
    return result.rows[0];
});
exports.createProduct = createProduct;
const updateProduct = (id, product) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(`
    UPDATE products 
    SET name = $1, description = $2, price_ht = $3, tva = $4, stock = $5, 
        image_url = $6, category_id = $7, is_fresh = $8, is_featured = $9, updated_at = CURRENT_TIMESTAMP
    WHERE id = $10 
    RETURNING *
  `, [
        product.name,
        product.description,
        product.price_ht,
        product.tva,
        product.stock,
        product.image_url,
        product.category_id,
        product.is_fresh,
        product.is_featured,
        id
    ]);
    return result.rows.length ? result.rows[0] : null;
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query('DELETE FROM products WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
});
exports.deleteProduct = deleteProduct;

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
exports.validatePassword = exports.getAdminByResetToken = exports.setResetToken = exports.updateAdminPassword = exports.createAdmin = exports.getAdminByEmail = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAdminByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query('SELECT * FROM admin WHERE email = $1', [email]);
    return result.rows.length ? result.rows[0] : null;
});
exports.getAdminByEmail = getAdminByEmail;
const createAdmin = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(admin.password, salt);
    const result = yield db_1.default.query('INSERT INTO admin (email, password) VALUES ($1, $2) RETURNING *', [admin.email, hashedPassword]);
    return result.rows[0];
});
exports.createAdmin = createAdmin;
const updateAdminPassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
    const result = yield db_1.default.query('UPDATE admin SET password = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE email = $2', [hashedPassword, email]);
    return (result.rowCount || 0) > 0;
});
exports.updateAdminPassword = updateAdminPassword;
const setResetToken = (email, token, expires) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query('UPDATE admin SET reset_token = $1, reset_token_expires = $2 WHERE email = $3', [token, expires, email]);
    return (result.rowCount || 0) > 0;
});
exports.setResetToken = setResetToken;
const getAdminByResetToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query('SELECT * FROM admin WHERE reset_token = $1 AND reset_token_expires > NOW()', [token]);
    return result.rows.length ? result.rows[0] : null;
});
exports.getAdminByResetToken = getAdminByResetToken;
const validatePassword = (storedPassword, providedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(providedPassword, storedPassword);
});
exports.validatePassword = validatePassword;

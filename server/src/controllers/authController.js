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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const adminModel = __importStar(require("../models/adminModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Connexion administrateur
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Vérifier si l'admin existe
        const admin = yield adminModel.getAdminByEmail(email);
        if (!admin) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }
        // Vérifier le mot de passe
        const isValidPassword = yield adminModel.validatePassword(admin.password, password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }
        // Générer un JWT
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });
        res.status(200).json({
            message: 'Connexion réussie',
            token,
            admin: {
                id: admin.id,
                email: admin.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});
exports.login = login;
// Demande de réinitialisation du mot de passe
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Vérifier si l'admin existe
        const admin = yield adminModel.getAdminByEmail(email);
        if (!admin) {
            // Pour des raisons de sécurité, on renvoie un message de succès même si l'email n'existe pas
            res.status(200).json({ message: 'Si cet email existe, vous recevrez un email de réinitialisation' });
            return;
        }
        // Générer un token de réinitialisation
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // Expire dans 1 heure
        // Sauvegarder le token en base de données
        yield adminModel.setResetToken(email, resetToken, resetTokenExpires);
        // Créer un transporteur email
        const transporter = nodemailer_1.default.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        // URL de réinitialisation
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        // Options email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}" target="_blank">Réinitialiser mon mot de passe</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
      `
        };
        // Envoyer l'email
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email de réinitialisation envoyé' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation' });
    }
});
exports.forgotPassword = forgotPassword;
// Réinitialisation du mot de passe
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        // Vérifier le token
        const admin = yield adminModel.getAdminByResetToken(token);
        if (!admin) {
            res.status(400).json({ message: 'Token invalide ou expiré' });
            return;
        }
        // Mettre à jour le mot de passe
        yield adminModel.updateAdminPassword(admin.email, password);
        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
});
exports.resetPassword = resetPassword;
// Vérification du token d'authentification
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Le middleware auth a déjà vérifié le token
        // req.user est défini par le middleware auth
        res.status(200).json({
            valid: true,
            message: 'Token valide',
            admin: req.user
        });
    }
    catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({ message: 'Erreur lors de la vérification du token' });
    }
});
exports.verifyToken = verifyToken;

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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Charger les variables d'environnement
dotenv_1.default.config();
// Initialiser l'application Express
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Dossier pour les fichiers statiques (images des produits)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/products', productRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// Route pour envoyer des emails depuis le formulaire de contact
app.post('/api/contact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, message, cart } = req.body;
        // Créer un transporteur pour l'envoi d'email
        const transporter = nodemailer_1.default.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        // Formater les produits du panier si présents
        let cartHTML = '';
        if (cart && cart.length > 0) {
            cartHTML = `
        <h3>Commande:</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix unitaire HT</th>
            <th>Total HT</th>
          </tr>
          ${cart.map((item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price_ht.toFixed(2)} €</td>
              <td>${(item.price_ht * item.quantity).toFixed(2)} €</td>
            </tr>
          `).join('')}
        </table>
        <p><strong>Total HT: </strong>${cart.reduce((total, item) => total + (item.price_ht * item.quantity), 0).toFixed(2)} €</p>
      `;
        }
        // Options pour le mail
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // L'email de l'administrateur
            subject: `Nouveau message de ${name} via le formulaire de contact`,
            html: `
        <h1>Nouveau message du formulaire de contact</h1>
        <h2>Informations client:</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</p>
        <h2>Message:</h2>
        <p>${message}</p>
        ${cartHTML}
      `
        };
        // Envoyer le mail
        yield transporter.sendMail(mailOptions);
        // Si un panier est présent, envoyer également une confirmation au client
        if (cart && cart.length > 0 && email) {
            const clientMailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Confirmation de votre demande - Italian Food Shop',
                html: `
          <h1>Merci pour votre demande!</h1>
          <p>Cher(e) ${name},</p>
          <p>Nous avons bien reçu votre demande et nous vous contacterons dans les plus brefs délais.</p>
          <p>Voici un récapitulatif des produits que vous avez sélectionnés:</p>
          ${cartHTML}
          <p>Cordialement,</p>
          <p>L'équipe Italian Food Shop</p>
        `
            };
            yield transporter.sendMail(clientMailOptions);
        }
        res.status(200).json({ message: 'Message envoyé avec succès' });
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
    }
}));
// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('API Italian Food Shop - Serveur en ligne');
});
// Port sur lequel le serveur va écouter
const PORT = process.env.PORT || 5000;
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

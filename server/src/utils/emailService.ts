import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Interface pour les options d'email
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Classe pour le service d'email
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuration du transporteur email
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Vérifier la configuration email
    this.transporter.verify((error, success) => {
      if (error) {
        console.log('❌ Erreur de configuration email:', error);
      } else {
        console.log('✅ Configuration email prête');
      }
    });
  }

  // Fonction pour envoyer un email
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"Jana Distrib" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('📧 Email envoyé avec succès à:', options.to);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
  }

  // Template pour l'email de réinitialisation de mot de passe
  createResetPasswordEmailTemplate(resetToken: string, clientUrl: string): string {
    const resetUrl = `${clientUrl}/admin/reset-password?token=${resetToken}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Réinitialisation de mot de passe - Jana Distrib</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { 
            display: inline-block; 
            background: #4CAF50; 
            color: white; 
            padding: 12px 25px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Jana Distrib</h1>
            <h2>Réinitialisation de mot de passe</h2>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte administrateur Jana Distrib.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </p>
            <p><strong>Important :</strong> Ce lien est valide pendant 1 heure seulement.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
            <p>Cordialement,<br>L'équipe Jana Distrib</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Jana Distrib. Tous droits réservés.</p>
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p>${resetUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
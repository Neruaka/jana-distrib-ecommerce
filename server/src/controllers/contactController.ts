import { Request, Response } from 'express';
import emailService from '../utils/emailService';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Traiter le formulaire de contact
export const sendContactMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, subject, message }: ContactFormData = req.body;

    // Validation des champs requis
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis' 
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Adresse email invalide' 
      });
    }

    // Créer le contenu de l'email
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; background: #f9f9f9; border: 1px solid #ddd; }
          .info-row { margin-bottom: 15px; }
          .label { font-weight: bold; color: #4CAF50; }
          .message-box { background: white; padding: 15px; border-left: 4px solid #4CAF50; margin-top: 15px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Nouveau Message de Contact</h1>
            <p>Jana Distrib - Site Web</p>
          </div>
          <div class="content">
            <div class="info-row">
              <span class="label">👤 Nom :</span> ${name}
            </div>
            <div class="info-row">
              <span class="label">📧 Email :</span> ${email}
            </div>
            <div class="info-row">
              <span class="label">📝 Sujet :</span> ${subject}
            </div>
            <div class="info-row">
              <span class="label">📅 Date :</span> ${new Date().toLocaleString('fr-FR')}
            </div>
            <div class="message-box">
              <h3>💬 Message :</h3>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          <div class="footer">
            <p>Message envoyé depuis le site web Jana Distrib</p>
            <p>Répondre directement à : ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email
    await emailService.sendEmail({
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER || 'contact@janadistrib.com',
      subject: `[Jana Distrib] ${subject}`,
      html: emailContent
    });

    // Email de confirmation pour l'expéditeur
    const confirmationEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Message Reçu</h1>
            <p>Jana Distrib</p>
          </div>
          <div class="content">
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Nous avons bien reçu votre message concernant : <strong>${subject}</strong></p>
            <p>Notre équipe vous répondra dans les plus brefs délais.</p>
            <p>Merci de nous avoir contactés !</p>
            <br>
            <p>Cordialement,<br>L'équipe Jana Distrib</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email de confirmation
    await emailService.sendEmail({
      to: email,
      subject: '[Jana Distrib] Confirmation de réception de votre message',
      html: confirmationEmail
    });

    return res.status(200).json({ 
      message: 'Message envoyé avec succès. Vous recevrez une confirmation par email.' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message de contact:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.' 
    });
  }
};

// Obtenir les informations de contact (pour affichage sur la page contact)
export const getContactInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const contactInfo = {
      email: process.env.CONTACT_EMAIL || 'contact@janadistrib.com',
      phone: process.env.CONTACT_PHONE || '+33 1 23 45 67 89',
      address: process.env.CONTACT_ADDRESS || '123 Rue de l\'Exemple, 75001 Paris, France',
      businessHours: {
        monday: '8h00 - 18h00',
        tuesday: '8h00 - 18h00', 
        wednesday: '8h00 - 18h00',
        thursday: '8h00 - 18h00',
        friday: '8h00 - 18h00',
        saturday: '9h00 - 17h00',
        sunday: 'Fermé'
      }
    };

    return res.json(contactInfo);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de contact:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
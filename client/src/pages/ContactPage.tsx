import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import axios from 'axios';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactType, setContactType] = useState('question');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.post(`${apiUrl}/contact/send`, {
        name,
        email,
        subject,
        message,
        contactType
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setContactType('question');
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" color="primary">
          Contactez-nous
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Nos Coordonnées
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
              <LocationIcon color="primary" sx={{ mr: 2 }} />
              <Typography>58 rue Edouard Vaillant, 91200 Athis-Mons</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon color="primary" sx={{ mr: 2 }} />
              <Typography>06 61 54 75 52</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon color="primary" sx={{ mr: 2 }} />
              <Typography>jana.distribution@gmail.com</Typography>
            </Box>

            <Typography variant="body1" sx={{ mt: 4 }}>
              Notre équipe est à votre disposition pour répondre à toutes vos questions concernant nos produits ou services.
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
              Horaires d'ouverture: du lundi au vendredi, de 9h à 18h.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Envoyez-nous un message
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Votre nom"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Votre email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Sujet"
                    fullWidth
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    select
                    label="Type de contact"
                    fullWidth
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    disabled={isLoading}
                  >
                    <MenuItem value="question">Question générale</MenuItem>
                    <MenuItem value="order">Question sur une commande</MenuItem>
                    <MenuItem value="support">Support technique</MenuItem>
                    <MenuItem value="partnership">Partenariat</MenuItem>
                    <MenuItem value="other">Autre</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Votre message"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Envoyer"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ContactPage;
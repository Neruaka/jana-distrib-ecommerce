import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  IconButton,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// Interface pour le formulaire de contact
interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  clientType: 'particulier' | 'professionnel';
}

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalHT, getTotalTTC } = useCart();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation du formulaire avec Formik et Yup
  const formik = useFormik<ContactFormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      clientType: 'particulier'
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Le nom est obligatoire'),
      email: Yup.string().email('Email invalide').required('L\'email est obligatoire'),
      phone: Yup.string(),
      message: Yup.string(),
      clientType: Yup.string().oneOf(['particulier', 'professionnel']).required()
    }),
    onSubmit: async (values) => {
      if (cart.length === 0) {
        setSubmitError('Votre panier est vide');
        return;
      }
      
      setSubmitLoading(true);
      setSubmitError(null);
      
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        await axios.post(`${apiUrl}/contact/send`, {
          ...values,
          subject: `Demande de devis - Panier de ${values.name}`,
          message: `${values.message}\n\nDétails du panier:\n${cart.map(item => 
            `- ${item.quantity} x ${item.name} = ${(item.price_ht * item.quantity * (1 + item.tva / 100)).toFixed(2)}€`
          ).join('\n')}\n\nTotal TTC: ${getTotalTTC().toFixed(2)}€`,
          cart: cart
        });
        
        setSubmitSuccess(true);
        clearCart();
        setTimeout(() => setDialogOpen(false), 3000);
      } catch (error) {
        console.error('Error submitting order:', error);
        setSubmitError('Une erreur s\'est produite lors de l\'envoi de votre demande. Veuillez réessayer.');
      } finally {
        setSubmitLoading(false);
      }
    }
  });

  // Gérer l'ouverture du formulaire de commande
  const handleOpenDialog = () => {
    setDialogOpen(true);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  // Gérer la fermeture du formulaire de commande
  const handleCloseDialog = () => {
    setDialogOpen(false);
    formik.resetForm();
  };

  // Formater le prix TTC
  const formatPrice = (price: number): string => {
    return price.toFixed(2) + ' €';
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Titre de la page */}
      <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
        Votre Panier
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {/* Contenu du panier */}
      {cart.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Votre panier est vide
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Vous n'avez pas encore ajouté de produits à votre panier.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/products"
            size="large"
            sx={{ mt: 2 }}
          >
            Explorer nos produits
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Liste des produits */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ p: 3, mb: { xs: 4, lg: 0 } }}>
              {/* En-tête du tableau */}
              <Grid container sx={{ fontWeight: 'bold', pb: 2, display: { xs: 'none', sm: 'flex' } }}>
                <Grid size={6}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Produit
                  </Typography>
                </Grid>
                <Grid size={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Prix unitaire
                  </Typography>
                </Grid>
                <Grid size={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Quantité
                  </Typography>
                </Grid>
                <Grid size={2} sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Total
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              {/* Produits */}
              {cart.map((item) => {
                const itemTotalHT = item.price_ht * item.quantity;
                const itemTotalTTC = itemTotalHT * (1 + item.tva / 100);

                return (
                  <Box key={item.id}>
                    <Grid container alignItems="center" sx={{ py: 3 }}>
                      {/* Produit avec image et nom */}
                      <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          component="img"
                          src={item.image_url || '/product-placeholder.jpg'}
                          alt={item.name}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mr: 2
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" component={RouterLink} to={`/products/${item.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: { xs: 'block', sm: 'none' } }}>
                            Prix unitaire: {formatPrice(item.price_ht * (1 + item.tva / 100))}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Prix unitaire */}
                      <Grid size={{ xs: 4, sm: 2 }} sx={{ textAlign: { xs: 'left', sm: 'center' }, mt: { xs: 2, sm: 0 }, display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="body2">
                          {formatPrice(item.price_ht * (1 + item.tva / 100))}
                        </Typography>
                      </Grid>

                      {/* Quantité avec boutons +/- */}
                      <Grid size={{ xs: 6, sm: 2 }} sx={{ textAlign: 'center', mt: { xs: 2, sm: 0 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'center' } }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            size="small"
                            variant="outlined"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item.id, value);
                              }
                            }}
                            inputProps={{ min: 1, style: { textAlign: 'center', width: '40px' } }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>

                      {/* Total et bouton supprimer */}
                      <Grid size={{ xs: 6, sm: 2 }} sx={{ textAlign: 'right', mt: { xs: 2, sm: 0 } }}>
                        <Typography variant="body2" fontWeight={600}>
                          {formatPrice(itemTotalTTC)}
                        </Typography>
                      </Grid>

                      {/* Bouton supprimer */}
                      <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-end' }, mt: { xs: 2, sm: 0 } }}>
                        <IconButton 
                          color="error" 
                          onClick={() => removeFromCart(item.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Divider />
                  </Box>
                );
              })}

              {/* Boutons en bas du panier */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button 
                  component={RouterLink} 
                  to="/products" 
                  variant="outlined"
                >
                  Continuer les achats
                </Button>
                <Button 
                  color="error" 
                  onClick={() => clearCart()}
                  variant="outlined"
                >
                  Vider le panier
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Résumé et commande */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Résumé de la commande
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Sous-total HT:</Typography>
                  <Typography fontWeight={500}>{formatPrice(getTotalHT())}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>TVA:</Typography>
                  <Typography fontWeight={500}>{formatPrice(getTotalTTC() - getTotalHT())}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={600}>
                    Total TTC:
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="primary.main">
                    {formatPrice(getTotalTTC())}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<EmailIcon />}
                  onClick={handleOpenDialog}
                  sx={{ mt: 3 }}
                >
                  Demander un devis
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pour passer commande, remplissez le formulaire de contact avec votre panier. 
                  Nous vous contacterons rapidement pour finaliser votre commande.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Formulaire de contact pour la commande */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            <Typography variant="h5" fontWeight={600}>
              Demande de devis / commande
            </Typography>
          </DialogTitle>
          <DialogContent>
            {submitSuccess ? (
              <Alert severity="success" sx={{ mt: 2 }}>
                Votre demande a été envoyée avec succès ! Nous vous contacterons dans les plus brefs délais.
              </Alert>
            ) : (
              <>
                {submitError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {submitError}
                  </Alert>
                )}
                
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
                  Veuillez remplir ce formulaire pour nous envoyer votre demande. Nous vous contacterons rapidement pour finaliser votre commande.
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                      <FormLabel component="legend">Type de client:</FormLabel>
                      <RadioGroup
                        row
                        name="clientType"
                        value={formik.values.clientType}
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel 
                          value="particulier" 
                          control={<Radio />} 
                          label="Particulier" 
                        />
                        <FormControlLabel 
                          value="professionnel" 
                          control={<Radio />} 
                          label="Professionnel" 
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Nom complet"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.phone && Boolean(formik.errors.phone)}
                      helperText={formik.touched.phone && formik.errors.phone}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Message (facultatif)"
                      name="message"
                      multiline
                      rows={4}
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.message && Boolean(formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message}
                      placeholder="Précisez ici toute information complémentaire concernant votre commande"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, mb: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Récapitulatif de votre panier
                  </Typography>
                  <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2 }}>
                    {cart.map((item) => (
                      <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {item.quantity} x {item.name}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatPrice(item.price_ht * item.quantity * (1 + item.tva / 100))}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Total TTC:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                      {formatPrice(getTotalTTC())}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog} disabled={submitLoading}>
              {submitSuccess ? 'Fermer' : 'Annuler'}
            </Button>
            {!submitSuccess && (
              <Button 
                type="submit" 
                variant="contained" 
                disabled={submitLoading}
                startIcon={submitLoading ? <CircularProgress size={20} /> : null}
              >
                {submitLoading ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default CartPage;
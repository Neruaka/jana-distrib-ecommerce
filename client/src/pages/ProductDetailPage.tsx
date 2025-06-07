import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Breadcrumbs,
  TextField,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

// Type pour un produit
interface Product {
  id: number;
  name: string;
  description: string;
  price_ht: number;
  tva: number;
  is_available: boolean;
  image_url: string | null;
  category_id: number;
  is_fresh: boolean;
  is_featured: boolean;
  category_name: string;
}

const ProductDetailPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Charger les détails du produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/products/${id}`);
        
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Impossible de charger les détails du produit. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Gérer la modification de quantité
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else {
      // Pour les produits avec is_available, on peut permettre une quantité raisonnable
      // par défaut (par exemple, maximum de 10 par commande)
      const maxQuantity = 10;
      setQuantity(Math.min(value, maxQuantity));
    }
  };
  
  // Ajouter au panier
  const handleAddToCart = () => {
    if (product && product.is_available) {
      addToCart({
        id: product.id,
        name: product.name,
        price_ht: product.price_ht,
        tva: product.tva,
        image_url: product.image_url || undefined,
        quantity: quantity
      });
      setSnackbarOpen(true);
    }
  };
  
  // Fermer la notification
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // Formater le prix TTC
  const formatPriceTTC = (price_ht: number, tva: number): string => {
    const priceTTC = price_ht * (1 + tva / 100);
    return priceTTC.toFixed(2) + ' €';
  };
  
  // Formater le prix HT
  const formatPriceHT = (price_ht: number): string => {
    return price_ht.toFixed(2) + ' € HT';
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Typography 
          sx={{ 
            color: 'text.secondary'
          }}
        >
          Accueil
        </Typography>
        <Typography 
          sx={{ 
            color: 'text.secondary'
          }}
        >
          Produits
        </Typography>
        {product && product.category_name && (
          <Typography 
            sx={{ 
              color: 'text.secondary'
            }}
          >
            {product.category_name}
          </Typography>
        )}
        {product && (
          <Typography color="text.primary">
            {product.name}
          </Typography>
        )}
      </Breadcrumbs>

      {/* Contenu principal */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>
      ) : product ? (
        <Grid container spacing={4}>
          {/* Image du produit */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={product.image_url || '/product-placeholder.jpg'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                objectFit: 'cover'
              }}
            />
          </Grid>
          
          {/* Informations du produit */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              {/* Catégorie et badges */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  {product.category_name}
                </Typography>
                {product.is_fresh && (
                  <Chip 
                    label="Produit frais" 
                    color="secondary" 
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
              </Box>

              {/* Nom du produit */}
              <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
                {product.name}
              </Typography>

              {/* Prix */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Prix HT: {typeof product.price_ht === 'string' ? parseFloat(product.price_ht).toFixed(2) : product.price_ht.toFixed(2)} €
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight={600}>
                  Prix TTC: {formatPriceTTC(product.price_ht, product.tva)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  TVA: {product.tva}%
                </Typography>
              </Box>

              {/* Statut de disponibilité */}
              <Box sx={{ mb: 3 }}>
                {product.is_available ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                    <CheckCircleIcon />
                    <Typography variant="body1" fontWeight={600}>
                      Produit disponible
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                    <Typography variant="body1" fontWeight={600}>
                      Produit temporairement indisponible
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Description */}
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              {/* Quantité et ajout au panier */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TextField
                  type="number"
                  label="Quantité"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: 10 }}
                  disabled={!product.is_available}
                  sx={{ width: '120px' }}
                />
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CartIcon />}
                  onClick={handleAddToCart}
                  disabled={!product.is_available}
                  sx={{ flexGrow: 1 }}
                >
                  {product.is_available ? 'Ajouter au panier' : 'Indisponible'}
                </Button>
              </Box>

              {/* Boutons d'action */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/products"
                  startIcon={<ArrowBackIcon />}
                >
                  Retour aux produits
                </Button>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/cart"
                  startIcon={<CartIcon />}
                >
                  Voir le panier
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="error" sx={{ my: 4 }}>Produit non trouvé</Alert>
      )}
      
      {/* Notification d'ajout au panier */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={`${product?.name} ajouté au panier`}
        action={
          <Button 
            color="secondary" 
            size="small" 
            component={RouterLink}
            to="/cart"
          >
            Voir le panier
          </Button>
        }
      />
    </Container>
  );
};

export default ProductDetailPage;
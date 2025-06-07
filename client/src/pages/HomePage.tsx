import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Paper,
  Divider,
  useTheme,
  IconButton,
  Slide
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Restaurant as RestaurantIcon,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import apropos from './about-us.jpg'
import carrou1 from './banner/carrou1.jpg'
import carrou2 from './banner/carrou2.jpg'
import carrou3 from './banner/carrou3.jpg'


// Interface pour les produits
interface Product {
  id: number;
  name: string;
  description: string;
  price_ht: number;
  tva: number;
  image_url: string;
  is_fresh: boolean;
  is_featured: boolean;
  category_name: string;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  
  const theme = useTheme();
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/products/featured`);
        setFeaturedProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des produits mis en avant:', err);
        setError('Impossible de charger les produits mis en avant. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  // Images de bannière
  const bannerImages = [
    carrou1, 
    carrou2, 
    carrou3
  ];
  
  // Textes et titres pour chaque bannière
  const bannerContent = [
    {
      title: "Découvrez l'authenticité italienne",
      subtitle: "Des produits frais et de qualité importés directement d'Italie"
    },
    {
      title: "Des prix imbattables",
      subtitle: "Des produits d'exception à prix grossiste, pour particuliers et professionnels"
    },
    {
      title: "Saveurs d'Italie",
      subtitle: "Redécouvrez le goût authentique de la cuisine italienne"
    }
  ];
  
  // Auto-défilement des bannières
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    
    return () => {
      clearInterval(timer);
    };
  }, [bannerImages.length]);
  
  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % bannerImages.length);
  };
  
  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };
  
  // Formater le prix TTC
  const formatPriceTTC = (price_ht: number, tva: number): string => {
    const priceTTC = price_ht * (1 + tva / 100);
    return priceTTC.toFixed(2) + ' €';
  };

  return (
    <Box>
      {/* Section Bannière */}
      <Box 
        sx={{ 
          position: 'relative',
          height: { xs: '50vh', md: '70vh' },
          overflow: 'hidden'
        }}
      >
        {bannerImages.map((image, index) => (
          <Slide
            key={index}
            direction="left"
            in={activeSlide === index}
            mountOnEnter
            unmountOnExit
            timeout={500}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${image})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  color: 'white',
                  p: 4,
                  maxWidth: '800px'
                }}
              >
                <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                  {bannerContent[index].title}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {bannerContent[index].subtitle}
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  component={RouterLink}
                  to="/products"
                  sx={{ 
                    mt: 4,
                    bgcolor: 'secondary.main',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    }
                  }}
                >
                  Découvrir nos produits
                </Button>
              </Box>
            </Box>
          </Slide>
        ))}
        
        <IconButton
          sx={{
            position: 'absolute',
            left: theme.spacing(2),
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.1)' 
              : 'rgba(255,255,255,0.5)',
            color: theme.palette.mode === 'dark' ? 'white' : 'inherit',
            '&:hover': { 
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.2)' 
                : 'rgba(255,255,255,0.8)' 
            }
          }}
          onClick={handlePrev}
        >
          <ArrowLeftIcon />
        </IconButton>
        
        <IconButton
          sx={{
            position: 'absolute',
            right: theme.spacing(2),
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.1)' 
              : 'rgba(255,255,255,0.5)',
            color: theme.palette.mode === 'dark' ? 'white' : 'inherit',
            '&:hover': { 
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.2)' 
                : 'rgba(255,255,255,0.8)' 
            }
          }}
          onClick={handleNext}
        >
          <ArrowRightIcon />
        </IconButton>
      </Box>

      {/* Avantages */}
      <Box sx={{ 
        bgcolor: theme.palette.mode === 'dark' 
          ? 'background.paper' 
          : 'grey.100', 
        py: 6 
      }}>
        <Container>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 6
                  }
                }}
              >
                <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Qualité Supérieure
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Des produits italiens authentiques sélectionnés avec soin directement auprès des producteurs.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 6
                  }
                }}
              >
                <StoreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Prix Compétitifs
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Des tarifs avantageux pour les particuliers et les professionnels, moins chers que les supermarchés.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 6
                  }
                }}
              >
                <LocalShippingIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Livraison Professionnelle
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Service de livraison pour particuliers et professionnels dans toute la région.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Produits Vedette */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
            Nos Produits Vedettes
          </Typography>
          <Divider sx={{ width: '80px', mx: 'auto', mb: 3, borderColor: 'primary.main', borderWidth: 3 }} />
          <Typography variant="subtitle1" color="text.secondary">
            Découvrez notre sélection de produits italiens authentiques
          </Typography>
        </Box>
        
        {loading ? (
          <Typography>Chargement des produits...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card 
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image_url || '/product-placeholder.jpg'}
                    alt={product.name}
                  />
                  {product.is_fresh && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'secondary.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 'bold',
                      }}
                    >
                      Frais
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="overline" color="text.secondary">
                      {product.category_name}
                    </Typography>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2">
                          Prix TTC:
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                          {formatPriceTTC(product.price_ht, product.tva)}
                        </Typography>
                      </Box>
                      <Button 
                        component={RouterLink}
                        to={`/products/${product.id}`}
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                      >
                        Détails
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button 
            variant="contained" 
            size="large"
            component={RouterLink}
            to="/products"
            endIcon={<ArrowForwardIcon />}
          >
            Voir tous nos produits
          </Button>
        </Box>
      </Container>

      {/* Section Qui sommes-nous */}
      <Box sx={{ 
        bgcolor: theme.palette.mode === 'dark' 
          ? 'background.paper' 
          : 'grey.100', 
        py: 8 
      }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box 
                component="img"
                src={apropos} 
                alt="À propos de nous"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 6,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
                Qui Sommes-Nous
              </Typography>
              <Divider sx={{ width: '80px', mb: 3, borderColor: 'primary.main', borderWidth: 3 }} />
              <Typography variant="body1" paragraph>
                Janna Distribution est spécialisé dans l'importation et la distribution de produits agroalimentaires de haute qualité.
              </Typography>
              <Typography variant="body1" paragraph>
                Notre mission est de proposer des produits exceptionnels à des prix compétitifs, tant pour les particuliers que pour les professionnels de la restauration.
              </Typography>
              <Typography variant="body1" paragraph>
                Nous mettons un point d'honneur à sélectionner des produits frais, savoureux et authentiques directement auprès de producteurs respectueux des traditions.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                component={RouterLink}
                to="/contact"
                sx={{ mt: 2 }}
              >
                Contactez-nous
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Instagram as InstagramIcon, 
  Twitter as TwitterIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useDarkMode } from '../../App';
import logo from './logo.png';

const Footer: React.FC = () => {
  const theme = useTheme();
  const { darkMode } = useDarkMode();
  const year = new Date().getFullYear();
  
  return (
    <Box 
      sx={{
        bgcolor: darkMode ? '#1a1a1a' : 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
        borderTop: darkMode ? '1px solid #333' : 'none'
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo et description */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to="/" 
              sx={{ 
                color: 'white',
                textDecoration: 'none',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                mb: 2
              }}
            >
              <img 
                src={logo}  
                alt="Jana Distrib" 
                style={{ height: '40px', marginRight: '10px', filter: 'brightness(0) invert(1)' }} 
              />
              Jana Distrib
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Jana Distrib est votre partenaire de confiance pour une distribution de produits alimentaires de qualité, 
              frais et authentiques, à des prix abordables pour les particuliers et les professionnels.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }} 
                aria-label="Facebook"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }} 
                aria-label="Instagram"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }} 
                aria-label="Twitter"
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Liens rapides */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Navigation
            </Typography>
            <Link 
              component={RouterLink} 
              to="/" 
              color="inherit" 
              display="block" 
              sx={{ 
                mb: 1,
                '&:hover': {
                  color: darkMode ? '#81C784' : '#C8E6C9',
                  transform: 'translateX(5px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Accueil
            </Link>
            <Link 
              component={RouterLink} 
              to="/products" 
              color="inherit" 
              display="block" 
              sx={{ 
                mb: 1,
                '&:hover': {
                  color: darkMode ? '#81C784' : '#C8E6C9',
                  transform: 'translateX(5px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Nos Produits
            </Link>
            <Link 
              component={RouterLink} 
              to="/contact" 
              color="inherit" 
              display="block" 
              sx={{ 
                mb: 1,
                '&:hover': {
                  color: darkMode ? '#81C784' : '#C8E6C9',
                  transform: 'translateX(5px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Contact
            </Link>
            <Link 
              component={RouterLink} 
              to="/cart" 
              color="inherit" 
              display="block" 
              sx={{ 
                mb: 1,
                '&:hover': {
                  color: darkMode ? '#81C784' : '#C8E6C9',
                  transform: 'translateX(5px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Panier
            </Link>
          </Grid>
          
          {/* Contact */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                58 rue Edouard Vaillant, 91200 Athis-Mons
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                06 61 54 75 52
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                jana.distribution@gmail.com
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            © {year} Jana Distrib. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Tooltip,
  Zoom
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  ContactMail as ContactMailIcon,
  AdminPanelSettings as AdminIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../App';
import logo from './logo.png';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminMenuAnchor, setAdminMenuAnchor] = useState<null | HTMLElement>(null);
  
  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminMenuAnchor(event.currentTarget);
  };
  
  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };
  
  const handleLogout = () => {
    logout();
    handleAdminMenuClose();
    navigate('/');
  };
  
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };
  
  const adminMenu = (
    <Menu
      anchorEl={adminMenuAnchor}
      open={Boolean(adminMenuAnchor)}
      onClose={handleAdminMenuClose}
      PaperProps={{
        sx: {
          background: darkMode 
            ? 'linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)'
            : 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
          backdropFilter: 'blur(20px)',
          border: darkMode ? '1px solid #333' : '1px solid #E0E0E0',
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <MenuItem component={Link} to="/admin" onClick={handleAdminMenuClose}>
        Tableau de bord
      </MenuItem>
      <MenuItem component={Link} to="/admin/products" onClick={handleAdminMenuClose}>
        Gestion des produits
      </MenuItem>
      <MenuItem component={Link} to="/admin/categories" onClick={handleAdminMenuClose}>
        Gestion des catégories
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        Déconnexion
      </MenuItem>
    </Menu>
  );

  const drawerContent = (
    <Box
      sx={{ 
        width: 250,
        background: darkMode 
          ? 'linear-gradient(180deg, #1E1E1E 0%, #2A2A2A 100%)'
          : 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
        height: '100%'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItemButton 
          component={Link} 
          to="/"
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(8px)',
              backgroundColor: darkMode ? 'rgba(102, 187, 106, 0.1)' : 'rgba(76, 175, 80, 0.1)',
            }
          }}
        >
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Accueil" />
        </ListItemButton>
        <ListItemButton 
          component={Link} 
          to="/products"
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(8px)',
              backgroundColor: darkMode ? 'rgba(102, 187, 106, 0.1)' : 'rgba(76, 175, 80, 0.1)',
            }
          }}
        >
          <ListItemIcon><StoreIcon /></ListItemIcon>
          <ListItemText primary="Nos Produits" />
        </ListItemButton>
        <ListItemButton 
          component={Link} 
          to="/contact"
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(8px)',
              backgroundColor: darkMode ? 'rgba(102, 187, 106, 0.1)' : 'rgba(76, 175, 80, 0.1)',
            }
          }}
        >
          <ListItemIcon><ContactMailIcon /></ListItemIcon>
          <ListItemText primary="Contact" />
        </ListItemButton>
        {isAuthenticated && (
          <ListItemButton 
            component={Link} 
            to="/admin"
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(8px)',
                backgroundColor: darkMode ? 'rgba(102, 187, 106, 0.1)' : 'rgba(76, 175, 80, 0.1)',
              }
            }}
          >
            <ListItemIcon><AdminIcon /></ListItemIcon>
            <ListItemText primary="Administration" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'transparent',
        backdropFilter: 'blur(20px)',
        boxShadow: 'none',
        borderBottom: `1px solid ${darkMode ? '#333' : '#E0E0E0'}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ 
                mr: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(90deg)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700, 
              color: 'primary.main', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <img 
              src={logo} 
              alt="Jana Distrib" 
              style={{ 
                height: '40px', 
                marginRight: '10px',
                transition: 'all 0.3s ease',
              }} 
            />
            Jana Distrib
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                sx={{ 
                  mx: 1, 
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    '&::after': {
                      width: '100%',
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: '2px',
                    background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                    transition: 'width 0.3s ease',
                  }
                }}
              >
                Accueil
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/products"
                sx={{ 
                  mx: 1, 
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    '&::after': {
                      width: '100%',
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: '2px',
                    background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                    transition: 'width 0.3s ease',
                  }
                }}
              >
                Nos Produits
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/contact"
                sx={{ 
                  mx: 1, 
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    '&::after': {
                      width: '100%',
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: '2px',
                    background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                    transition: 'width 0.3s ease',
                  }
                }}
              >
                Contact
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Bouton de basculement du mode sombre */}
            <Tooltip title={darkMode ? "Mode clair" : "Mode sombre"} TransitionComponent={Zoom}>
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  mx: 1,
                  background: darkMode 
                    ? 'linear-gradient(45deg, #FFD54F 30%, #FFF176 90%)'
                    : 'linear-gradient(45deg, #3F51B5 30%, #5C6BC0 90%)',
                  color: darkMode ? '#1A1A1A' : '#FFFFFF',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'rotate(0deg)',
                  '&:hover': {
                    transform: 'rotate(180deg) scale(1.1)',
                    boxShadow: darkMode 
                      ? '0 8px 25px rgba(255, 213, 79, 0.4)'
                      : '0 8px 25px rgba(63, 81, 181, 0.4)',
                  },
                }}
              >
                {darkMode ? (
                  <LightModeIcon sx={{ fontSize: '1.2rem' }} />
                ) : (
                  <DarkModeIcon sx={{ fontSize: '1.2rem' }} />
                )}
              </IconButton>
            </Tooltip>

            <IconButton 
              color="inherit" 
              component={Link} 
              to="/cart"
              aria-label="Panier"
              sx={{ 
                ml: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  '& .MuiBadge-badge': {
                    transform: 'scale(1.2)',
                  }
                }
              }}
            >
              <Badge 
                badgeContent={getTotalItems()} 
                color="secondary"
                sx={{
                  '& .MuiBadge-badge': {
                    transition: 'all 0.3s ease',
                    animation: getTotalItems() > 0 ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(1)',
                      },
                      '50%': {
                        transform: 'scale(1.2)',
                      },
                      '100%': {
                        transform: 'scale(1)',
                      },
                    },
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <IconButton
                color="primary"
                onClick={handleAdminMenuOpen}
                sx={{ 
                  ml: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(15deg) scale(1.1)',
                  }
                }}
              >
                <AdminIcon />
              </IconButton>
            ) : (
              <Button
                color="primary"
                variant="outlined"
                component={Link}
                to="/admin/login"
                sx={{ 
                  ml: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Admin
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Menu Admin */}
      {adminMenu}
      
      {/* Drawer pour mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            background: darkMode 
              ? 'linear-gradient(180deg, #1E1E1E 0%, #2A2A2A 100%)'
              : 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
            backdropFilter: 'blur(20px)',
            border: darkMode ? '1px solid #333' : '1px solid #E0E0E0',
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  LinearProgress,
  Grid
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
  recentProducts: any[];
  recentCategories: any[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    featuredProducts: 0,
    recentProducts: [],
    recentCategories: []
  });
  const [loading, setLoading] = useState(true);

  // Charger les statistiques du dashboard
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Charger les produits et catégories
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${apiUrl}/products`),
        axios.get(`${apiUrl}/categories`)
      ]);

      const products = productsResponse.data;
      const categories = categoriesResponse.data;

      // Calculer les statistiques
      const lowStockProducts = products.filter((p: any) => p.stock <= 10 && p.stock > 0).length;
      const outOfStockProducts = products.filter((p: any) => p.stock === 0).length;
      const featuredProducts = products.filter((p: any) => p.is_featured).length;

      // Produits récents (5 derniers)
      const recentProducts = products
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // Catégories récentes (3 dernières)
      const recentCategories = categories
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        lowStockProducts,
        outOfStockProducts,
        featuredProducts,
        recentProducts,
        recentCategories
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const getStockLevel = (stock: number) => {
    if (stock === 0) return { color: 'error', label: 'Rupture' };
    return { color: 'success', label: 'Normal' };
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Tableau de bord administrateur
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vue d'ensemble de votre boutique en ligne
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Alertes importantes */}
      {(stats.outOfStockProducts > 0 || stats.lowStockProducts > 0) && (
        <Alert 
          severity={stats.outOfStockProducts > 0 ? 'error' : 'warning'} 
          sx={{ mb: 4 }}
          icon={<WarningIcon />}
        >
          <Box>
            {stats.outOfStockProducts > 0 && (
              <Typography variant="body2">
                ⚠️ {stats.outOfStockProducts} produit(s) en rupture de stock
              </Typography>
            )}
            {stats.lowStockProducts > 0 && (
              <Typography variant="body2">
                📦 {stats.lowStockProducts} produit(s) avec un stock faible (≤10)
              </Typography>
            )}
          </Box>
        </Alert>
      )}

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.totalProducts}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Produits totaux
                  </Typography>
                </Box>
                <ProductIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                component={RouterLink} 
                to="/admin/products"
                sx={{ color: 'white' }}
                endIcon={<ArrowForwardIcon />}
              >
                Gérer les produits
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.totalCategories}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Catégories
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                component={RouterLink} 
                to="/admin/categories"
                sx={{ color: 'white' }}
                endIcon={<ArrowForwardIcon />}
              >
                Gérer les catégories
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.featuredProducts}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Produits vedettes
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                component={RouterLink} 
                to="/admin/products"
                sx={{ color: 'white' }}
                endIcon={<ArrowForwardIcon />}
              >
                Gérer les produits vedettes
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            height: '100%', 
            background: stats.outOfStockProducts > 0 
              ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' 
              : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
            color: 'white' 
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.outOfStockProducts}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Ruptures de stock
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                component={RouterLink} 
                to="/admin/products?filter=outOfStock"
                sx={{ color: 'white' }}
                endIcon={<ArrowForwardIcon />}
              >
                Voir les produits en rupture
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Actions rapides */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon />
          Actions rapides
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              component={RouterLink}
              to="/admin/product-form"
              variant="outlined"
              fullWidth
              startIcon={<ProductIcon />}
              sx={{ py: 2 }}
            >
              Nouveau produit
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              component={RouterLink}
              to="/admin/categories"
              variant="outlined"
              fullWidth
              startIcon={<CategoryIcon />}
              sx={{ py: 2 }}
            >
              Nouvelle catégorie
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              component={RouterLink}
              to="/admin/products?filter=outOfStock"
              variant="outlined"
              fullWidth
              startIcon={<WarningIcon />}
              sx={{ py: 2 }}
              color="warning"
            >
              Produits en rupture
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Contenu principal en deux colonnes */}
      <Grid container spacing={4}>
        {/* Colonne gauche - Produits récents */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Produits récents
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentProducts.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Aucun produit trouvé
              </Typography>
            ) : (
              <List>
                {stats.recentProducts.map((product, index) => {
                  const stockInfo = getStockLevel(product.stock);
                  return (
                    <ListItem key={product.id} divider={index < stats.recentProducts.length - 1}>
                      <ListItemIcon>
                        <Avatar
                          src={product.image_url || '/product-placeholder.jpg'}
                          alt={product.name}
                          variant="rounded"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight={500}>
                              {product.name}
                            </Typography>
                            {/* <Chip
                              label={stockInfo.label}
                              size="small"
                              color={stockInfo.color as any}
                              variant="outlined"
                            /> */}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {product.price_ht}€ HT
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Créé le {new Date(product.created_at).toLocaleDateString('fr-FR')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                component={RouterLink} 
                to="/admin/products"
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
              >
                Voir tous les produits
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Colonne droite - Informations et catégories */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container spacing={3}>
            {/* Niveau de stock global */}
            <Grid size={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  État des stocks
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Disponibilité globale
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {stats.totalProducts > 0 ? Math.round(((stats.totalProducts - stats.outOfStockProducts) / stats.totalProducts) * 100) : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.totalProducts > 0 ? ((stats.totalProducts - stats.outOfStockProducts) / stats.totalProducts) * 100 : 0}
                    color="success"
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${stats.totalProducts - stats.outOfStockProducts} En stock`}
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    label={`${stats.outOfStockProducts} Rupture`}
                    color="error" 
                    size="small" 
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Catégories récentes */}
            <Grid size={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Catégories récentes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {stats.recentCategories.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    Aucune catégorie trouvée
                  </Typography>
                ) : (
                  <List dense>
                    {stats.recentCategories.map((category, index) => (
                      <ListItem key={category.id} divider={index < stats.recentCategories.length - 1}>
                        <ListItemIcon>
                          <CategoryIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={category.name}
                          secondary={`Créé le ${new Date(category.created_at).toLocaleDateString('fr-FR')}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                    component={RouterLink} 
                    to="/admin/categories"
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Gérer les catégories
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;

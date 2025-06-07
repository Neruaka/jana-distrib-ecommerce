import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
  TablePagination,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Avatar,
  Box as MuiBox,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Inventory as ProductIcon,
  FilterList as FilterIcon,
  PhotoCamera as PhotoIcon,
  WarningAmber as OutOfStockIcon,
  RemoveShoppingCart as SetOutOfStockIcon,
  Star as StarIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WarningIcon from '@mui/icons-material/Warning';

interface Product {
  id: number;
  name: string;
  description: string;
  price_ht: number;
  tva: number;
  is_available: boolean; // Remplace 'stock' par un booléen
  category_id: number;
  category_name: string;
  image_url?: string;
  is_fresh: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price_ht: string;
  tva: string;
  is_available: boolean; // Remplace 'stock' par un booléen
  category_id: string;
  image_url: string;
  is_fresh: boolean;
  is_featured: boolean;
}

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price_ht: '',
    tva: '20',
    is_available: true,
    category_id: '',
    image_url: '',
    is_fresh: false,
    is_featured: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all'); // Remplace stockFilter
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  // Charger les produits
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Ajouter l'authentification pour la récupération des produits (pour les opérations admin)
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: { 'Authorization': `Bearer ${token}` }
      } : {};
      
      const response = await axios.get(`${apiUrl}/products`, config);
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories
  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast.error('Erreur lors du chargement des catégories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fonction pour mettre un produit en rupture de stock
  const handleSetOutOfStock = async (product: Product) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour modifier un produit');
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      await axios.put(`${apiUrl}/products/${product.id}/out-of-stock`, {}, config);
      
      toast.success(`${product.name} mis en rupture de stock`);
      fetchProducts();
    } catch (error: any) {
      console.error('Erreur lors de la mise en rupture:', error);
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        navigate('/admin/login');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise en rupture');
      }
    }
  };

  // Fonction pour remettre un produit en stock
  const handleSetInStock = async (product: Product) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour modifier un produit');
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      await axios.put(`${apiUrl}/products/${product.id}/in-stock`, {}, config);
      
      toast.success(`${product.name} remis en stock`);
      fetchProducts();
    } catch (error: any) {
      console.error('Erreur lors de la remise en stock:', error);
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        navigate('/admin/login');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la remise en stock');
      }
    }
  };

  // Filtrer les produits selon les filtres actifs
  const filteredProducts = products.filter(product => {
    // Filtre de recherche
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtre de catégorie
    const matchesCategory = categoryFilter === 'all' || 
      (product.category_id && product.category_id.toString() === categoryFilter);
    
    // Filtre de disponibilité
    const matchesAvailability = availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && product.is_available) ||
      (availabilityFilter === 'out' && !product.is_available) ||
      (availabilityFilter === 'featured' && product.is_featured);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Pagination
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Ouvrir le dialog pour créer/éditer
  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price_ht: product.price_ht.toString(),
        tva: product.tva.toString(),
        is_available: product.is_available,
        category_id: product.category_id.toString(),
        image_url: product.image_url || '',
        is_fresh: product.is_fresh,
        is_featured: product.is_featured
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price_ht: '',
        tva: '20',
        is_available: true,
        category_id: '',
        image_url: '',
        is_fresh: false,
        is_featured: false
      });
    }
    setDialogOpen(true);
  };

  // Fermer le dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.price_ht || !formData.category_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSubmitLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price_ht: parseFloat(formData.price_ht),
        tva: parseFloat(formData.tva),
        is_available: formData.is_available,
        category_id: parseInt(formData.category_id),
        image_url: formData.image_url.trim() || null,
        is_fresh: formData.is_fresh,
        is_featured: formData.is_featured
      };

      if (editingProduct) {
        // Modification
        await axios.put(`${apiUrl}/products/${editingProduct.id}`, productData);
        toast.success('Produit modifié avec succès');
      } else {
        // Création
        await axios.post(`${apiUrl}/products`, productData);
        toast.success('Produit créé avec succès');
      }

      handleCloseDialog();
      fetchProducts();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Confirmer la suppression
  const handleDeleteConfirm = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  // Supprimer le produit
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Ajouter l'authentification pour la suppression
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour supprimer un produit');
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      await axios.delete(`${apiUrl}/products/${productToDelete.id}`, config);
      toast.success('Produit supprimé avec succès');
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        navigate('/admin/login');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  // Ouvrir le dialog de visualisation
  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setViewDialogOpen(true);
  };

  // Gestion des changements de pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculer le prix TTC
  const calculatePriceTTC = (priceHT: number, tva: number) => {
    return (priceHT * (1 + tva / 100)).toFixed(2);
  };

  // Fonction utilitaire pour s'assurer qu'un prix est un nombre
  const ensureNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  };

  // Fonction pour formater un prix
  const formatPrice = (price: any): string => {
    return ensureNumber(price).toFixed(2);
  };

  // Statistiques
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.is_available).length;
  const outOfStockProducts = products.filter(p => !p.is_available).length;
  const featuredProducts = products.filter(p => p.is_featured).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ProductIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  Gestion des produits
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Gérez le catalogue de produits de votre boutique
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchProducts}
              disabled={loading}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/admin/product-form')}
            >
              Nouveau produit
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Statistiques */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 200px' }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight={700}>
              {totalProducts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Produits totaux
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight={700}>
              {availableProducts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Produits disponibles
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main" fontWeight={700}>
              {outOfStockProducts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rupture de stock
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight={700}>
              {featuredProducts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Produits vedettes
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Actions rapides */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon />
          Actions rapides
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              onClick={() => {
                setAvailabilityFilter('out');
                setPage(0);
              }}
              variant="outlined"
              fullWidth
              startIcon={<OutOfStockIcon />}
              sx={{ py: 2 }}
              color="error"
            >
              Rupture de stock
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              onClick={() => {
                setAvailabilityFilter('featured');
                setPage(0);
              }}
              variant="outlined"
              fullWidth
              startIcon={<StarIcon />}
              sx={{ py: 2 }}
              color="primary"
            >
              Produits en vedette
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              onClick={() => {
                setAvailabilityFilter('all');
                setCategoryFilter('all');
                setSearchTerm('');
                setPage(0);
              }}
              variant="outlined"
              fullWidth
              startIcon={<RefreshIcon />}
              sx={{ py: 2 }}
            >
              Réinitialiser filtres
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
          <Box sx={{ flex: '2 1 300px' }}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 200px' }}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Catégorie"
              >
                <MenuItem value="all">Toutes les catégories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 200px' }}>
            <FormControl fullWidth>
              <InputLabel>Disponibilité</InputLabel>
              <Select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                label="Disponibilité"
              >
                <MenuItem value="all">Tous les produits</MenuItem>
                <MenuItem value="available">Disponibles</MenuItem>
                <MenuItem value="out">Rupture de stock</MenuItem>
                <MenuItem value="featured">Produits en vedette</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon />
            <Typography variant="body2" color="text.secondary">
              {filteredProducts.length} résultat(s)
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des produits */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Prix HT</TableCell>
                <TableCell>Prix TTC</TableCell>
                <TableCell>Disponibilité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm || categoryFilter !== 'all' || availabilityFilter !== 'all' 
                        ? 'Aucun produit trouvé' 
                        : 'Aucun produit'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Avatar
                        src={product.image_url || '/product-placeholder.jpg'}
                        alt={product.name}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          {product.is_featured && (
                            <Chip label="Vedette" size="small" color="primary" variant="outlined" />
                          )}
                          {product.is_fresh && (
                            <Chip label="Frais" size="small" color="secondary" variant="outlined" />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {product.category_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {formatPrice(product.price_ht)} €
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {calculatePriceTTC(ensureNumber(product.price_ht), ensureNumber(product.tva))} €
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.is_available ? 'Disponible' : 'Rupture'}
                        size="small"
                        color={product.is_available ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.is_available ? 'En vente' : 'Indisponible'}
                        size="small"
                        color={product.is_available ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/admin/product-form/${product.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {product.is_available ? (
                          <Tooltip title="Mettre en rupture">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleSetOutOfStock(product)}
                            >
                              <SetOutOfStockIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Remettre en stock">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleSetInStock(product)}
                            >
                              <InventoryIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteConfirm(product)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count}`
          }
        />
      </Paper>

      {/* Dialog de création/modification */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  fullWidth
                  label="Nom du produit"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    label="Catégorie"
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 100%' }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px' }}>
                <TextField
                  fullWidth
                  label="Prix HT (€)"
                  type="number"
                  value={formData.price_ht}
                  onChange={(e) => setFormData({ ...formData, price_ht: e.target.value })}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px' }}>
                <TextField
                  fullWidth
                  label="TVA (%)"
                  type="number"
                  value={formData.tva}
                  onChange={(e) => setFormData({ ...formData, tva: e.target.value })}
                  required
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 100%' }}>
                <TextField
                  fullWidth
                  label="URL de l'image"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://exemple.com/image.jpg"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhotoIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    />
                  }
                  label="Produit disponible"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_fresh}
                      onChange={(e) => setFormData({ ...formData, is_fresh: e.target.checked })}
                    />
                  }
                  label="Produit frais"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                  }
                  label="Produit vedette"
                />
              </Box>
              {formData.price_ht && formData.tva && (
                <Box sx={{ flex: '1 1 100%' }}>
                  <Alert severity="info">
                    Prix TTC calculé: {calculatePriceTTC(parseFloat(formData.price_ht), parseFloat(formData.tva))} €
                  </Alert>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitLoading}
          >
            {submitLoading ? <CircularProgress size={20} /> : (editingProduct ? 'Modifier' : 'Créer')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de visualisation */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Détails du produit</DialogTitle>
        <DialogContent>
          {viewingProduct && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Avatar
                    src={viewingProduct.image_url || '/product-placeholder.jpg'}
                    alt={viewingProduct.name}
                    variant="rounded"
                    sx={{ width: 120, height: 120, mx: 'auto' }}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>{viewingProduct.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {viewingProduct.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 200px' }}>
                    <Typography variant="body2" color="text.secondary">Catégorie:</Typography>
                    <Typography variant="body1">{viewingProduct.category_name}</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 200px' }}>
                    <Typography variant="body2" color="text.secondary">ID:</Typography>
                    <Typography variant="body1">#{viewingProduct.id}</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 200px' }}>
                    <Typography variant="body2" color="text.secondary">Prix HT:</Typography>
                    <Typography variant="body1">{formatPrice(viewingProduct.price_ht)} €</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 200px' }}>
                    <Typography variant="body2" color="text.secondary">Prix TTC:</Typography>
                    <Typography variant="body1">{calculatePriceTTC(ensureNumber(viewingProduct.price_ht), ensureNumber(viewingProduct.tva))} €</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 200px' }}>
                    <Typography variant="body2" color="text.secondary">TVA:</Typography>
                    <Typography variant="body1">{viewingProduct.tva}%</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 200px' }}>
                    <Typography variant="body2" color="text.secondary">Disponibilité:</Typography>
                    <Typography variant="body1">{viewingProduct.is_available ? 'Disponible' : 'Rupture de stock'}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {viewingProduct.is_featured && (
                      <Chip label="Produit vedette" color="primary" size="small" />
                    )}
                    {viewingProduct.is_fresh && (
                      <Chip label="Produit frais" color="secondary" size="small" />
                    )}
                    <Chip 
                      label={viewingProduct.is_available ? 'Disponible' : 'Rupture'} 
                      color={viewingProduct.is_available ? 'success' : 'error'} 
                      size="small" 
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 200px' }}>
                    <Typography variant="body2" color="text.secondary">Créé le:</Typography>
                    <Typography variant="body2">{new Date(viewingProduct.created_at).toLocaleDateString('fr-FR')}</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 200px' }}>
                    <Typography variant="body2" color="text.secondary">Modifié le:</Typography>
                    <Typography variant="body2">{new Date(viewingProduct.updated_at).toLocaleDateString('fr-FR')}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Fermer</Button>
          {viewingProduct && (
            <Button 
              onClick={() => {
                setViewDialogOpen(false);
                handleOpenDialog(viewingProduct);
              }}
              variant="contained"
            >
              Modifier
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.name}" ?
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Cette action est irréversible. Le produit sera définitivement supprimé du catalogue.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProductsPage;

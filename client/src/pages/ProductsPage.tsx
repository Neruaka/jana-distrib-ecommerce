import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid,
  Card,
  CardMedia, 
  CardContent, 
  CardActions,
  Button, 
  Box, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Paper,
  Skeleton
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  AddShoppingCart as CartIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  Nature as NatureIcon
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';

// Types
interface Product {
  id: number;
  name: string;
  description: string;
  price_ht: number;
  tva: number;
  is_available: boolean;
  image_url?: string;
  category_id: number;
  is_fresh: boolean;
  is_featured: boolean;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

const ProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart } = useCart();

  const productsPerPage = 9;

  // États
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState('name');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showOnlyFresh, setShowOnlyFresh] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Chargement initial des produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        let endpoint = `${apiUrl}/products`;
        
        // Si un categoryId est fourni dans l'URL, filtrer par cette catégorie
        if (categoryId) {
          endpoint = `${apiUrl}/products/category/${categoryId}`;
          setCategoryFilter(parseInt(categoryId));
        }
        
        const response = await axios.get(endpoint);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Chargement des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fonction pour calculer le prix TTC
  const calculatePriceTTC = (priceHT: number | string, tva: number | string): string => {
    const numPriceHT = typeof priceHT === 'string' ? parseFloat(priceHT) : priceHT;
    const numTva = typeof tva === 'string' ? parseFloat(tva) : tva;
    const priceTTC = numPriceHT * (1 + numTva / 100);
    return priceTTC.toFixed(2);
  };

  // Filtrage des produits
  const filteredProducts = products.filter(product => {
    // Filtre de recherche
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre de catégorie
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    
    // Filtre de prix
    const priceTTC = parseFloat(calculatePriceTTC(product.price_ht, product.tva));
    const matchesPrice = priceFilter === 'all' ||
                        (priceFilter === 'low' && priceTTC < 10) ||
                        (priceFilter === 'medium' && priceTTC >= 10 && priceTTC < 50) ||
                        (priceFilter === 'high' && priceTTC >= 50);
    
    // Filtres booléens
    const matchesFeatured = !showOnlyFeatured || product.is_featured;
    const matchesFresh = !showOnlyFresh || product.is_fresh;
    const matchesAvailable = !showOnlyAvailable || product.is_available;
    
    return matchesSearch && matchesCategory && matchesPrice && 
           matchesFeatured && matchesFresh && matchesAvailable;
  });

  // Tri des produits
  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price_asc':
        return a.price_ht - b.price_ht;
      case 'price_desc':
        return b.price_ht - a.price_ht;
      case 'availability':
        return Number(b.is_available) - Number(a.is_available);
      case 'featured':
        return Number(b.is_featured) - Number(a.is_featured);
      default:
        return 0;
    }
  });
  
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const pageCount = Math.ceil(sortedProducts.length / productsPerPage);
  
  // Ajouter au panier
  const handleAddToCart = (product: Product) => {
    if (!product.is_available) {
      toast.error('Ce produit n\'est plus disponible');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price_ht: product.price_ht,
      tva: product.tva,
      image_url: product.image_url,
      quantity: 1
    });
    
    toast.success(`${product.name} ajouté au panier`);
  };

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Titre de la page */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
          {categoryId ? `Produits - ${categories.find(c => c.id === parseInt(categoryId))?.name || 'Catégorie'}` : 'Nos Produits'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Découvrez notre sélection de produits de qualité
        </Typography>
      </Box>

      {/* Filtres */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterIcon />
            <Typography variant="h6" fontWeight={600}>
              Filtres et recherche
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {sortedProducts.length} produit(s) trouvé(s)
          </Typography>
        </Box>
          
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Première ligne - Recherche et Catégorie */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: { md: 2 } }}>
              <TextField
                fullWidth
                placeholder="Rechercher un produit..."
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
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as number | 'all')}
                  label="Catégorie"
                >
                  <MenuItem value="all">Toutes les catégories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Deuxième ligne - Tri et Prix */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Trier par</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Trier par"
                >
                  <MenuItem value="name">Nom (A-Z)</MenuItem>
                  <MenuItem value="price_asc">Prix croissant</MenuItem>
                  <MenuItem value="price_desc">Prix décroissant</MenuItem>
                  <MenuItem value="availability">Disponibilité</MenuItem>
                  <MenuItem value="featured">Produits vedettes</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Gamme de prix</InputLabel>
                <Select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  label="Gamme de prix"
                >
                  <MenuItem value="all">Tous les prix</MenuItem>
                  <MenuItem value="low">Moins de 10€</MenuItem>
                  <MenuItem value="medium">10€ - 50€</MenuItem>
                  <MenuItem value="high">Plus de 50€</MenuItem>
                </Select>
              </FormControl>
            </Box> */}
          </Box>

          {/* Troisième ligne - Filtres booléens */}
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="Produits vedettes"
                clickable
                color={showOnlyFeatured ? 'primary' : 'default'}
                icon={<StarIcon />}
                onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
              />
              <Chip
                label="Produits frais"
                clickable
                color={showOnlyFresh ? 'primary' : 'default'}
                icon={<NatureIcon />}
                onClick={() => setShowOnlyFresh(!showOnlyFresh)}
              />
              {/* <Chip
                label="Disponibles"
                clickable
                color={showOnlyAvailable ? 'primary' : 'default'}
                onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
              /> */}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {sortedProducts.length} produit(s) affiché(s)
          </Typography>
        </Box>
      </Paper>

      {/* Grille des produits */}
      {loading ? (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3 
        }}>
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} width="60%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <OfferIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Aucun produit trouvé
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Essayez de modifier vos critères de recherche ou de filtrage.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setPriceFilter('all');
              setShowOnlyFeatured(false);
              setShowOnlyFresh(false);
              setShowOnlyAvailable(false);
            }}
          >
            Réinitialiser les filtres
          </Button>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3 
        }}>
          {currentProducts.map((product) => (
            <Card 
              key={product.id}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image_url || '/placeholder-product.jpg'}
                  alt={product.name}
                  sx={{
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
                
                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {product.is_featured && (
                    <Chip
                      label="Vedette"
                      size="small"
                      color="primary"
                      icon={<StarIcon />}
                    />
                  )}
                  {product.is_fresh && (
                    <Chip
                      label="Frais"
                      size="small"
                      color="success"
                      icon={<NatureIcon />}
                    />
                  )}
                </Box>
                
                {/* Stock badge */}
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  {product.is_available === false ? (
                    <Chip label="Rupture" size="small" color="error" />
                  ) : null}
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  fontWeight={600} 
                  gutterBottom
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '3.2em',
                  }}
                >
                  {product.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.category_name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  paragraph
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '4.5em',
                  }}
                >
                  {product.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {calculatePriceTTC(product.price_ht, product.tva)} €
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      TTC ({Number(product.price_ht).toFixed(2)}€ HT)
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    TVA: {product.tva}%
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    component={RouterLink}
                    to={`/products/${product.id}`}
                    sx={{ flex: 1 }}
                  >
                    Détails
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CartIcon />}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.is_available === false}
                    sx={{ flex: 1 }}
                  >
                    {product.is_available === false ? 'Rupture' : 'Ajouter'}
                  </Button>
                </Box>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Section d'aide */}
      {!loading && filteredProducts.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 6, p: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
          <OfferIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Besoin d'aide pour votre choix ?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Notre équipe est là pour vous conseiller et vous aider à trouver les produits parfaits.
          </Typography>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/contact"
            sx={{ mt: 2 }}
          >
            Nous contacter
          </Button>
        </Box>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductsPage;
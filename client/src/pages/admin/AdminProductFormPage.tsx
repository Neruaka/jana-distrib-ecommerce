import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Card,
  CardMedia,
  CardContent,
  Divider,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoIcon,
  Euro as EuroIcon,
  Inventory as InventoryIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  name: string;
  description: string;
  price_ht: number;
  tva: number;
  is_available: boolean;
  category_id: number;
  category_name: string;
  image_url?: string;
  is_fresh: boolean;
  is_featured: boolean;
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
  is_available: boolean;
  category_id: string;
  image_url: string;
  is_fresh: boolean;
  is_featured: boolean;
}

const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageTabValue, setImageTabValue] = useState(0); // 0 = Upload, 1 = URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
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

  // Charger le produit à modifier
  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Ajouter l'authentification pour la récupération du produit
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: { 'Authorization': `Bearer ${token}` }
      } : {};
      
      const response = await axios.get(`${apiUrl}/products/${id}`, config);
      const product = response.data;
      
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
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      toast.error('Erreur lors du chargement du produit');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id, isEditing]);

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price_ht || !formData.category_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSubmitLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour effectuer cette action');
        navigate('/admin/login');
        return;
      }
      
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

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      if (isEditing) {
        await axios.put(`${apiUrl}/products/${id}`, productData, config);
        toast.success('Produit modifié avec succès');
      } else {
        await axios.post(`${apiUrl}/products`, productData, config);
        toast.success('Produit créé avec succès');
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        navigate('/admin/login');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Calculer le prix TTC
  const calculatePriceTTC = () => {
    if (!formData.price_ht || !formData.tva) return '0.00';
    const priceHT = parseFloat(formData.price_ht);
    const tva = parseFloat(formData.tva);
    return (priceHT * (1 + tva / 100)).toFixed(2);
  };

  // Gestion de la sélection de fichier
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Type de fichier non autorisé. Seuls les formats JPEG, PNG et WebP sont acceptés.');
        return;
      }

      // Vérifier la taille du fichier (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux. Taille maximum: 5MB.');
        return;
      }

      setSelectedFile(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload du fichier
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Aucun fichier sélectionné');
      return;
    }

    try {
      setUploadLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const formDataUpload = new FormData();
      formDataUpload.append('image', selectedFile);

      // Récupérer le token d'authentification depuis le localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour uploader une image');
        return;
      }

      const response = await axios.post(`${apiUrl}/products/upload-image`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      // Construire l'URL complète de l'image
      const baseUrl = apiUrl.replace('/api', '');
      const uploadedImageUrl = `${baseUrl}${response.data.imageUrl}`;
      setFormData({ ...formData, image_url: uploadedImageUrl });
      setPreviewUrl(uploadedImageUrl);
      toast.success('Image uploadée avec succès');
      
      // Réinitialiser le fichier sélectionné
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error);
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 404) {
        toast.error('Service d\'upload non disponible. Vérifiez que le serveur est démarré.');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'upload de l\'image');
      }
    } finally {
      setUploadLoading(false);
    }
  };

  // Supprimer l'image sélectionnée
  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' });
    setPreviewUrl('');
    setSelectedFile(null);
  };

  // Changement d'onglet pour l'image
  const handleImageTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setImageTabValue(newValue);
    if (newValue === 0) {
      // Onglet Upload - garder l'image actuelle si elle existe
    } else {
      // Onglet URL - réinitialiser le fichier sélectionné
      setSelectedFile(null);
      setPreviewUrl(formData.image_url || '');
    }
  };

  // Mettre à jour l'aperçu quand l'URL change
  useEffect(() => {
    if (imageTabValue === 1 && formData.image_url) {
      setPreviewUrl(formData.image_url);
    }
  }, [formData.image_url, imageTabValue]);

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin/dashboard" underline="hover" color="inherit">
          Administration
        </Link>
        <Link component={RouterLink} to="/admin/products" underline="hover" color="inherit">
          Produits
        </Link>
        <Typography color="text.primary">
          {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
        </Typography>
      </Breadcrumbs>

      {/* En-tête */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 4 }}>
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PhotoIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {id ? 'Modifier le produit' : 'Nouveau produit'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {id ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit au catalogue'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/products')}
          >
            Retour
          </Button>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Formulaire principal */}
          <Box sx={{ flex: '2 1 400px' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhotoIcon />
                Informations générales
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Nom du produit"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Pommes bio"
                />
                
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={4}
                  placeholder="Description détaillée du produit..."
                />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 200px' }}>
                    <TextField
                      fullWidth
                      label="Prix HT (€)"
                      type="number"
                      value={formData.price_ht}
                      onChange={(e) => setFormData({ ...formData, price_ht: e.target.value })}
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EuroIcon />
                          </InputAdornment>
                        ),
                      }}
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
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 200px' }}>
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
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_fresh}
                        onChange={(e) => setFormData({ ...formData, is_fresh: e.target.checked })}
                      />
                    }
                    label="Produit frais"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      />
                    }
                    label="Produit vedette"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_available}
                        onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      />
                    }
                    label="Disponible à la vente"
                  />
                </Box>

                {formData.price_ht && formData.tva && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Prix TTC calculé:</strong> {calculatePriceTTC()} €
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Paper>

            {/* Section Image */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhotoIcon />
                Image du produit
              </Typography>

              <Tabs value={imageTabValue} onChange={handleImageTabChange} sx={{ mb: 3 }}>
                <Tab icon={<UploadIcon />} label="Upload d'image" />
                <Tab icon={<LinkIcon />} label="URL d'image" />
              </Tabs>

              {imageTabValue === 0 && (
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload-input"
                    type="file"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="image-upload-input">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<UploadIcon />}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Choisir une image
                    </Button>
                  </label>

                  {selectedFile && (
                    <Box sx={{ mb: 2 }}>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="body2">
                              <strong>Fichier sélectionné:</strong> {selectedFile.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleFileUpload}
                            disabled={uploadLoading}
                            startIcon={uploadLoading ? <CircularProgress size={16} /> : <UploadIcon />}
                          >
                            {uploadLoading ? 'Upload...' : 'Uploader'}
                          </Button>
                        </Box>
                      </Alert>
                    </Box>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    Formats acceptés: JPEG, PNG, WebP • Taille maximum: 5MB
                  </Typography>
                </Box>
              )}

              {imageTabValue === 1 && (
                <TextField
                  fullWidth
                  label="URL de l'image"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://exemple.com/image.jpg"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {(formData.image_url || previewUrl) && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle2">Aperçu de l'image</Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={handleRemoveImage}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Card sx={{ maxWidth: 300 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={previewUrl || formData.image_url}
                      alt="Aperçu"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/product-placeholder.jpg';
                      }}
                    />
                  </Card>
                </Box>
              )}
            </Paper>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/products')}
                disabled={submitLoading}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={submitLoading}
                startIcon={submitLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                {submitLoading ? 'Sauvegarde...' : (id ? 'Modifier' : 'Créer')}
              </Button>
            </Box>
          </Box>

          {/* Aperçu et aide */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhotoIcon />
                Aperçu du produit
              </Typography>
              
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={previewUrl || formData.image_url || '/product-placeholder.jpg'}
                  alt={formData.name || 'Aperçu du produit'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/product-placeholder.jpg';
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {formData.name || 'Nom du produit'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formData.description || 'Description du produit'}
                  </Typography>
                  {formData.price_ht && (
                    <Typography variant="h6" color="primary" fontWeight={600}>
                      {calculatePriceTTC()} € TTC
                    </Typography>
                  )}
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {formData.is_fresh && (
                      <Chip label="Produit frais" size="small" color="success" />
                    )}
                    {formData.is_featured && (
                      <Chip label="Produit vedette" size="small" color="primary" />
                    )}
                    {!formData.is_available && (
                      <Chip label="Indisponible" size="small" color="error" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Guide d'utilisation
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Upload d'image:</strong> Uploadez une image depuis votre ordinateur. Elle sera stockée sur le serveur.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>URL d'image:</strong> Utilisez une image déjà hébergée sur internet.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Formats acceptés: JPEG, PNG, WebP
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Taille maximum: 5MB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • L'aperçu se met à jour automatiquement
              </Typography>
            </Paper>
          </Box>
        </Box>
      </form>
    </Container>
  );
};

export default AdminProductFormPage;
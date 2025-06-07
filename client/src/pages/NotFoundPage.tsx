import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <Container sx={{ py: 8, textAlign: 'center' }}>
    <Typography variant="h2" color="error" gutterBottom>
      404
    </Typography>
    <Typography variant="h5" gutterBottom>
      Page non trouvée
    </Typography>
    <Typography variant="body1" sx={{ mb: 4 }}>
      La page que vous recherchez n'existe pas.
    </Typography>
    <Button variant="contained" component={RouterLink} to="/">
      Retour à l'accueil
    </Button>
  </Container>
);

export default NotFoundPage;

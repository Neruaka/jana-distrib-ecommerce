import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Fade } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/admin/ForgotPasswordPage';
import ResetPasswordPage from './pages/admin/ResetPasswordPage';

// Context
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Dark Mode Context
interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Thème dynamique avec mode sombre et animations
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#66BB6A' : '#4CAF50',
        light: darkMode ? '#98EE99' : '#80E27E',
        dark: darkMode ? '#338A3E' : '#087F23',
      },
      secondary: {
        main: darkMode ? '#FF7043' : '#FF5722',
        light: darkMode ? '#FFAB91' : '#FF8A50',
        dark: darkMode ? '#D84315' : '#C41C00',
      },
      background: {
        default: darkMode ? '#121212' : '#F5F5F5',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#212121',
        secondary: darkMode ? '#B0B0B0' : '#757575',
      },
      divider: darkMode ? '#333333' : '#E0E0E0',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
      },
    },
    shape: {
      borderRadius: 12,
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: darkMode 
              ? 'linear-gradient(135deg, #0D1117 0%, #161B22 50%, #21262D 100%)'
              : 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 50%, #DEE2E6 100%)',
            minHeight: '100vh',
            transition: 'all 0.3s ease-in-out',
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: darkMode ? '#444 #222' : '#C1C1C1 #F1F1F1',
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: darkMode ? '#222' : '#F1F1F1',
          },
          '*::-webkit-scrollbar-thumb': {
            background: darkMode ? '#444' : '#C1C1C1',
            borderRadius: '4px',
            '&:hover': {
              background: darkMode ? '#555' : '#A8A8A8',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
            padding: '10px 24px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateY(0)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? '0 8px 25px rgba(102, 187, 106, 0.3)'
                : '0 8px 25px rgba(76, 175, 80, 0.3)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            background: darkMode 
              ? 'linear-gradient(45deg, #66BB6A 30%, #81C784 90%)'
              : 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
            '&:hover': {
              background: darkMode 
                ? 'linear-gradient(45deg, #81C784 30%, #A5D6A7 90%)'
                : 'linear-gradient(45deg, #66BB6A 30%, #81C784 90%)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.12)',
            borderRadius: 16,
            background: darkMode 
              ? 'linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)'
              : 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
            border: darkMode ? '1px solid #333' : '1px solid #E0E0E0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateY(0)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: darkMode 
                ? '0 16px 40px rgba(0, 0, 0, 0.6)'
                : '0 16px 40px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode 
              ? 'linear-gradient(90deg, #1E1E1E 0%, #2A2A2A 100%)'
              : 'linear-gradient(90deg, #FFFFFF 0%, #F8F9FA 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: darkMode ? '1px solid #333' : '1px solid #E0E0E0',
            boxShadow: darkMode 
              ? '0 4px 20px rgba(0, 0, 0, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: darkMode 
              ? 'linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)'
              : 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
            border: darkMode ? '1px solid #333' : '1px solid #E0E0E0',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
              '&.Mui-focused': {
                transform: 'translateY(-2px)',
                boxShadow: darkMode 
                  ? '0 4px 20px rgba(102, 187, 106, 0.3)'
                  : '0 4px 20px rgba(76, 175, 80, 0.3)',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            background: darkMode 
              ? 'linear-gradient(45deg, #66BB6A 30%, #81C784 90%)'
              : 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: darkMode 
                ? '0 8px 25px rgba(102, 187, 106, 0.4)'
                : '0 8px 25px rgba(76, 175, 80, 0.4)',
            },
          },
        },
      },
    },
  });

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Router>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ flex: '1 0 auto' }}>
                  <Fade in={true} timeout={500}>
                    <div>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/category/:categoryId" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
                        <Route 
                          path="/admin" 
                          element={
                            <ProtectedRoute>
                              <AdminDashboard />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/admin/dashboard" 
                          element={
                            <ProtectedRoute>
                              <AdminDashboard />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/admin/products" 
                          element={
                            <ProtectedRoute>
                              <AdminProductsPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/admin/product-form" 
                          element={
                            <ProtectedRoute>
                              <AdminProductFormPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/admin/product-form/:id" 
                          element={
                            <ProtectedRoute>
                              <AdminProductFormPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/admin/categories" 
                          element={
                            <ProtectedRoute>
                              <AdminCategoriesPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </div>
                  </Fade>
                </main>
                <Footer />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme={darkMode ? 'dark' : 'light'}
                  style={{
                    fontSize: '14px',
                  }}
                />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
};

export default App;

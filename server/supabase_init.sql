-- Script SQL compatible Supabase pour Jana Distrib
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Création de la table admin
CREATE TABLE IF NOT EXISTS public.admin (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table categories
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table company
CREATE TABLE IF NOT EXISTS public.company (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    siret VARCHAR(50),
    tva_number VARCHAR(50),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table products
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_ht NUMERIC(10,2) NOT NULL,
    tva NUMERIC(5,2) DEFAULT 20.00 NOT NULL,
    image_url VARCHAR(500),
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    is_fresh BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des données admin
INSERT INTO public.admin (id, email, password, reset_token, reset_token_expiry, created_at, updated_at) VALUES
(1, 'admin@asfde.fr', '$2b$10$X8qZ8s9/p5BvKGMuO2NQk.VRJQz7YqLmY5yVFJ/fLKmY3zQ9/4i0.', NULL, NULL, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542'),
(2, 'jannadistrib@gmail.com', '$2b$10$pZV0W2xzwwRht3gYTJlhH.0ki6cPNrcGCrI3zfrGSNavrhWEaWrRG', NULL, NULL, '2025-05-25 23:42:55.452231', '2025-05-26 00:10:01.38929'),
(3, 'nerualo@asfde.fr', '$2b$10$XqZ8s9/p5BvKGMuO2NQk.VRJQz7YqLmY5yVFJ/fLKmY3zQ9/4i0.', NULL, NULL, '2025-05-25 23:42:55.452231', '2025-05-25 23:42:55.452231');

-- Insertion des catégories
INSERT INTO public.categories (id, name, description, created_at, updated_at) VALUES
(1, 'Fruits', 'Fruits frais de saison', '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542'),
(2, 'Légumes', 'Légumes frais du potager', '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542'),
(3, 'Produits laitiers', 'Lait, fromages, yaourts', '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542'),
(4, 'Viandes', 'Viandes fraîches et charcuterie', '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542'),
(5, 'Poissons', 'Poissons et fruits de mer', '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542'),
(6, 'Épicerie', 'Produits d''épicerie sèche', '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542'),
(8, 'Pains et pâtisseries', 'Pains frais et pâtisseries', '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542');

-- Insertion des informations de l'entreprise
INSERT INTO public.company (id, name, description, address, phone, email, website, siret, tva_number, logo_url, created_at, updated_at) VALUES
(1, 'Jana Distrib', 'Jana Distrib est votre partenaire de confiance pour une distribution de produits alimentaires de qualité. Nous proposons une large gamme de produits frais et authentiques pour répondre à tous vos besoins.', '58 rue Edouard Vaillant, 91200 Athis-Mons', '06 61 54 75 52', 'jana.distribution@gmail.com', 'https://www.janadistrib.fr', 'À définir', 'À définir', NULL, '2025-05-25 23:42:55.452231', '2025-05-25 23:42:55.452231');

-- Insertion des produits
INSERT INTO public.products (id, name, description, price_ht, tva, image_url, category_id, is_fresh, is_featured, created_at, updated_at, is_available) VALUES
(1, 'Pommes Gala', 'Pommes Gala croquantes et sucrées', 2.50, 5.50, 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400', 1, true, true, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(3, 'Oranges', 'Oranges juteuses pour jus ou à croquer', 3.20, 5.50, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', 1, true, true, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(4, 'Fraises', 'Fraises de saison parfumées', 4.50, 5.50, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', 1, true, true, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(5, 'Tomates cerises', 'Tomates cerises colorées', 3.80, 5.50, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', 2, true, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(6, 'Carottes', 'Carottes nouvelles tendres', 2.20, 5.50, 'https://images.unsplash.com/photo-1445282768818-728615cc0f79?w=400', 2, true, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(7, 'Salade verte', 'Salade fraîche du jour', 1.50, 5.50, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 2, true, true, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(8, 'Courgettes', 'Courgettes fraîches du potager', 2.80, 5.50, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', 2, true, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(9, 'Lait entier Bio', 'Lait entier biologique 1L', 1.95, 5.50, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 3, true, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(10, 'Fromage de chèvre', 'Fromage de chèvre crémeux', 5.80, 5.50, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', 3, true, true, '2025-05-25 23:18:51.185542', '2025-06-07 06:42:28.640732', true),
(11, 'Yaourts nature', 'Yaourts nature par 4', 3.20, 5.50, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 3, true, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(12, 'Escalope de poulet', 'Escalope de poulet fermier', 12.50, 10.00, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', 4, true, true, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(13, 'Steak haché', 'Steak haché pur bœuf', 15.80, 10.00, 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400', 4, true, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(14, 'Pâtes complètes', 'Pâtes complètes bio 500g', 2.80, 5.50, 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400', 6, false, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(15, 'Riz basmati', 'Riz basmati parfumé 1kg', 4.20, 5.50, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 6, false, true, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(16, 'Huile d''olive', 'Huile d''olive extra vierge 500ml', 8.50, 20.00, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', 6, false, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(17, 'Jus d''orange', 'Jus d''orange pressé 1L', 3.50, 5.50, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', NULL, true, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(18, 'Eau minérale', 'Eau minérale naturelle 1.5L', 0.85, 5.50, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', NULL, false, false, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(19, 'Pain complet', 'Pain complet artisanal', 2.80, 5.50, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 8, true, true, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true),
(20, 'Croissants', 'Croissants pur beurre x6', 4.50, 10.00, 'https://images.unsplash.com/photo-1555507036-ab794f4a3e30?w=400', 8, true, true, '2025-05-25 23:18:51.185542', '2025-05-25 23:18:51.185542', true);

-- Mise à jour des séquences pour éviter les conflits d'ID
SELECT setval('public.admin_id_seq', COALESCE((SELECT MAX(id) FROM public.admin), 1), true);
SELECT setval('public.categories_id_seq', COALESCE((SELECT MAX(id) FROM public.categories), 1), true);
SELECT setval('public.company_id_seq', COALESCE((SELECT MAX(id) FROM public.company), 1), true);
SELECT setval('public.products_id_seq', COALESCE((SELECT MAX(id) FROM public.products), 1), true);

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_admin_email ON public.admin (email);
CREATE INDEX IF NOT EXISTS idx_admin_reset_token ON public.admin (reset_token);
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories (name);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_fresh ON public.products (is_fresh);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products (is_available);

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE 'Base de données Jana Distrib créée avec succès !';
    RAISE NOTICE 'Comptes admin disponibles :';
    RAISE NOTICE '- admin@asfde.fr';
    RAISE NOTICE '- jannadistrib@gmail.com';
    RAISE NOTICE '- nerualo@asfde.fr';
    RAISE NOTICE 'Mot de passe par défaut : admin123 (changez-le rapidement !)';
END $$;
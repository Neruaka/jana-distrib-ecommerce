--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    reset_token character varying(255),
    reset_token_expiry timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_id_seq OWNER TO postgres;

--
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    address text,
    phone character varying(50),
    email character varying(255),
    website character varying(255),
    siret character varying(50),
    tva_number character varying(50),
    logo_url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.company OWNER TO postgres;

--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_id_seq OWNER TO postgres;

--
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_id_seq OWNED BY public.company.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price_ht numeric(10,2) NOT NULL,
    tva numeric(5,2) DEFAULT 20.00 NOT NULL,
    image_url character varying(500),
    category_id integer,
    is_fresh boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_available boolean DEFAULT true
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: COLUMN products.is_available; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.is_available IS 'Indicates if the product is available for sale (replaces stock management)';


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (id, email, password, reset_token, reset_token_expiry, created_at, updated_at) FROM stdin;
1	admin@asfde.fr	$2b$10$X8qZ8s9/p5BvKGMuO2NQk.VRJQz7YqLmY5yVFJ/fLKmY3zQ9/4i0.	\N	\N	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542
3	nerualo@asfde.fr	$2b$10$XqZ8s9/p5BvKGMuO2NQk.VRJQz7YqLmY5yVFJ/fLKmY3zQ9/4i0.	\N	\N	2025-05-25 23:42:55.452231	2025-05-25 23:42:55.452231
2	jannadistrib@gmail.com	$2b$10$pZV0W2xzwwRht3gYTJlhH.0ki6cPNrcGCrI3zfrGSNavrhWEaWrRG	\N	\N	2025-05-25 23:42:55.452231	2025-05-26 00:10:01.38929
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description, created_at, updated_at) FROM stdin;
1	Fruits	Fruits frais de saison	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542
2	Légumes	Légumes frais du potager	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542
3	Produits laitiers	Lait, fromages, yaourts	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542
4	Viandes	Viandes fraîches et charcuterie	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542
5	Poissons	Poissons et fruits de mer	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542
6	Épicerie	Produits d'épicerie sèche	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542
8	Pains et pâtisseries	Pains frais et pâtisseries	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542
9	test	test	2025-06-07 06:10:01.264159	2025-06-07 06:10:01.264159
10	poulet pla pla	le poulet est plapla	2025-06-07 10:41:15.277856	2025-06-07 10:41:15.277856
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company (id, name, description, address, phone, email, website, siret, tva_number, logo_url, created_at, updated_at) FROM stdin;
1	Jana Distrib	Jana Distrib est votre partenaire de confiance pour une distribution de produits alimentaires de qualité. Nous proposons une large gamme de produits frais et authentiques pour répondre à tous vos besoins.	58 rue Edouard Vaillant, 91200 Athis-Mons	06 61 54 75 52	jana.distribution@gmail.com	https://www.janadistrib.fr	À définir	À définir	\N	2025-05-25 23:42:55.452231	2025-05-25 23:42:55.452231
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price_ht, tva, image_url, category_id, is_fresh, is_featured, created_at, updated_at, is_available) FROM stdin;
1	Pommes Gala	Pommes Gala croquantes et sucrées	2.50	5.50	https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400	1	t	t	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
3	Oranges	Oranges juteuses pour jus ou à croquer	3.20	5.50	https://images.unsplash.com/photo-1547514701-42782101795e?w=400	1	t	t	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
4	Fraises	Fraises de saison parfumées	4.50	5.50	https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400	1	t	t	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
5	Tomates cerises	Tomates cerises colorées	3.80	5.50	https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400	2	t	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
6	Carottes	Carottes nouvelles tendres	2.20	5.50	https://images.unsplash.com/photo-1445282768818-728615cc0f79?w=400	2	t	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
7	Salade verte	Salade fraîche du jour	1.50	5.50	https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400	2	t	t	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
8	Courgettes	Courgettes fraîches du potager	2.80	5.50	https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400	2	t	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
9	Lait entier Bio	Lait entier biologique 1L	1.95	5.50	https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400	3	t	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
11	Yaourts nature	Yaourts nature par 4	3.20	5.50	https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400	3	t	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
12	Escalope de poulet	Escalope de poulet fermier	12.50	10.00	https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400	4	t	t	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
13	Steak haché	Steak haché pur bœuf	15.80	10.00	https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400	4	t	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
14	Pâtes complètes	Pâtes complètes bio 500g	2.80	5.50	https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400	6	f	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
15	Riz basmati	Riz basmati parfumé 1kg	4.20	5.50	https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400	6	f	t	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
16	Huile d'olive	Huile d'olive extra vierge 500ml	8.50	20.00	https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400	6	f	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
19	Pain complet	Pain complet artisanal	2.80	5.50	https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400	8	t	t	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
20	Croissants	Croissants pur beurre x6	4.50	10.00	https://images.unsplash.com/photo-1555507036-ab794f4a3e30?w=400	8	t	t	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
17	Jus d'orange	Jus d'orange pressé 1L	3.50	5.50	https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400	\N	t	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
18	Eau minérale	Eau minérale naturelle 1.5L	0.85	5.50	https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400	\N	f	f	2025-05-25 23:18:51.185542	2025-05-25 23:18:51.185542	t
10	Froge de chèvre	Fromage de chèvre crémeux	5.80	5.50	https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400	3	t	t	2025-05-25 23:18:51.185542	2025-06-07 06:42:28.640732	t
21	test	tete	12.00	20.00	\N	1	f	f	2025-06-07 06:41:18.260984	2025-06-07 06:42:41.430447	t
23	caca	caca	12.00	20.00	http://localhost:5000/uploads/product-1749281189778-862866608.png	1	f	f	2025-06-07 09:26:33.532572	2025-06-07 10:41:57.353953	t
24	flokon davwan	ascasc	10.00	20.00	https://auto.cdn-rivamedia.com/1302799/171761111-big.jpg	10	t	t	2025-06-07 10:43:43.958373	2025-06-07 10:43:54.31688	f
\.


--
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_id_seq', 3, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_id_seq', 1, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 24, true);


--
-- Name: admin admin_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_email_key UNIQUE (email);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: idx_admin_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_email ON public.admin USING btree (email);


--
-- Name: idx_admin_reset_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_reset_token ON public.admin USING btree (reset_token);


--
-- Name: idx_categories_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_categories_name ON public.categories USING btree (name);


--
-- Name: idx_products_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);


--
-- Name: idx_products_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_is_featured ON public.products USING btree (is_featured);


--
-- Name: idx_products_is_fresh; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_is_fresh ON public.products USING btree (is_fresh);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--


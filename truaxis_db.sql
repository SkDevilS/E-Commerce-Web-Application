-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2026 at 09:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `truaxis_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `pincode` varchar(10) NOT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `full_name`, `phone`, `address_line1`, `address_line2`, `city`, `state`, `pincode`, `is_default`, `created_at`) VALUES
(1, 3, 'Soham Karmakar', '01234567890', 'xyz road', '', 'Kolkata', 'Bengal', '200601', 0, '2026-01-07 16:10:12'),
(2, 4, 'fwf', 'fwFEf', 'wFefeFE', 'F', 'efWFWFW', 'fWFEWF', '6545646', 0, '2026-01-07 16:17:29');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `user_id`, `product_id`, `quantity`, `size`, `color`, `created_at`) VALUES
(8, 4, 3, 1, NULL, NULL, '2026-01-07 16:16:26'),
(9, 4, 4, 1, NULL, NULL, '2026-01-07 16:16:26');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address_id` int(11) NOT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `receipt_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `address_id`, `total_amount`, `status`, `payment_method`, `payment_status`, `created_at`, `updated_at`, `receipt_number`) VALUES
(1, 'ORD-20260108010000-5M7B', 3, 1, 33996, 'shipped', 'card', 'completed', '2026-01-07 19:30:00', '2026-01-07 19:39:05', 'RCPSY596MJV'),
(2, 'ORD-20260108010917-I9PL', 3, 1, 8999, 'confirmed', 'upi', 'completed', '2026-01-07 19:39:17', '2026-01-07 19:39:17', 'RCPA58ZAQYV');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `size`, `color`) VALUES
(1, 1, 1, 1, 8999, NULL, NULL),
(2, 1, 2, 2, 7999, NULL, NULL),
(3, 1, 3, 1, 8999, NULL, NULL),
(4, 2, 1, 1, 8999, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payment_details`
--

CREATE TABLE `payment_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `card_number_last4` varchar(4) DEFAULT NULL,
  `card_holder_name` varchar(100) DEFAULT NULL,
  `card_expiry_month` varchar(2) DEFAULT NULL,
  `card_expiry_year` varchar(4) DEFAULT NULL,
  `upi_id` varchar(100) DEFAULT NULL,
  `upi_name` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_details`
--

INSERT INTO `payment_details` (`id`, `order_id`, `payment_method`, `card_number_last4`, `card_holder_name`, `card_expiry_month`, `card_expiry_year`, `upi_id`, `upi_name`, `created_at`) VALUES
(1, 1, 'card', '4862', 'Soham Karmakar', '10', '2034', NULL, NULL, '2026-01-07 19:30:01'),
(2, 2, 'upi', NULL, NULL, NULL, NULL, 'sohamkarmakar@paytm', 'Soham Karmakar', '2026-01-07 19:39:17');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` float NOT NULL,
  `original_price` float DEFAULT NULL,
  `is_on_sale` tinyint(1) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `section_id` int(11) NOT NULL,
  `images` text DEFAULT NULL,
  `sizes` text DEFAULT NULL,
  `colors` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `sku`, `title`, `slug`, `description`, `price`, `original_price`, `is_on_sale`, `stock`, `section_id`, `images`, `sizes`, `colors`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'PC-001', 'Premium Perfume Gift Set - Luxury Collection', 'premium-perfume-gift-set-luxury', 'Luxury fragrance gift set with 3 premium perfumes. Perfect for gifting. Long-lasting fragrance.', 8999, 12999, 1, 13, 1, '[\"https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_456/01/nm_3370107_100000_m\"]', '[\"50ml Set\", \"100ml Set\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 19:39:17'),
(2, 'PC-002', 'High-End Grooming Kit - Complete Set', 'high-end-grooming-kit-complete', 'Complete grooming kit with electric trimmer, shaver, and accessories. Professional quality.', 7999, 10999, 1, 18, 1, '[\"https://specials-images.forbesimg.com/imageserve/5d30e19aeab9270008f9c069/960x0.jpg?fit=scale\"]', '[\"Standard\", \"Premium\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 19:30:01'),
(3, 'PC-004', 'Premium Skincare Set - Anti-Aging', 'premium-skincare-set-anti-aging', 'Complete anti-aging skincare set with serum, cream, and cleanser. Imported quality.', 8999, 12999, 1, 17, 1, '[\"https://media-cldnry.s-nbcnews.com/image/upload/t_fit-720w,f_auto,q_auto:best/newscms/2022_38/1908988/inhomespa-medspaset-pdp-1000-r7-6328cf29b6bf8.jpg\"]', '[\"30ml Set\", \"50ml Set\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 19:30:01'),
(4, 'PC-006', 'Premium Soap Bar - 6 Pack', 'premium-soap-bar-6pack', 'Premium toilet soap bars with moisturizing formula. Gentle on skin.', 299, 399, 1, 50, 1, '[\"https://plus.unsplash.com/premium_photo-1664544673664-04dd7cd85c18?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687\"]', '[\"6 Pack\", \"12 Pack\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(5, 'PC-007', 'Anti-Dandruff Shampoo - 400ml', 'anti-dandruff-shampoo-400ml', 'Effective anti-dandruff shampoo with natural ingredients. Controls dandruff and itchiness.', 349, 499, 1, 45, 1, '[\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800\"]', '[\"200ml\", \"400ml\", \"1L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(6, 'PC-008', 'Hair Oil - Coconut & Almond - 200ml', 'hair-oil-coconut-almond-200ml', 'Nourishing hair oil with coconut and almond extracts. Promotes hair growth.', 199, 299, 1, 40, 1, '[\"https://th.bing.com/th/id/R.4dd122e8475f5410b9162f228f55dec1?rik=jcbMy%2fhxIivaTg&riu=http%3a%2f%2fmarillas.com%2fcdn%2fshop%2ffiles%2f464DCF4C-5045-41AD-99DD-CA71C93E466E_1200x1200.webp%3fv%3d1731721651&ehk=zFXy8cWgOyXkcI4zz4NebU%2f2xMuA0i5TD17Te%2fDzw88%3d&risl=&pid=ImgRaw&r=0\"]', '[\"100ml\", \"200ml\", \"500ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(7, 'PC-009', 'Whitening Toothpaste - 200g', 'whitening-toothpaste-200g', 'Advanced whitening toothpaste with fluoride. Removes stains and protects enamel.', 149, 199, 1, 60, 1, '[\"https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800\"]', '[\"100g\", \"200g\", \"400g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(8, 'PC-010', 'Shaving Cream - Sensitive Skin - 200g', 'shaving-cream-sensitive-skin-200g', 'Smooth shaving cream for sensitive skin. Rich lather and moisturizing formula.', 249, 349, 1, 35, 1, '[\"https://i5.walmartimages.com/seo/2-pack-SoftSheen-Carson-Magic-Shave-Hair-Removal-Cream-Bald-Head-Maintenance-Depilatory-Cream-for-Coarse-Hair-6-oz_f3bb7b38-4d60-4750-a25b-962ec4d07259.c1b4f4eb7b50232316c593e6394418aa.jpeg\"]', '[\"100g\", \"200g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(9, 'PC-011', 'Talcum Powder - Baby Soft - 400g', 'talcum-powder-baby-soft-400g', 'Gentle talcum powder with baby soft fragrance. Keeps skin dry and fresh.', 179, 249, 1, 55, 1, '[\"https://govitaburwood.com.au/cdn/shop/files/Untitled_19_1_1200x1200.png?v=1715410011\"]', '[\"200g\", \"400g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(10, 'PC-012', 'Face Wash - Deep Cleansing - 150ml', 'face-wash-deep-cleansing-150ml', 'Deep cleansing face wash removes dirt and oil. Suitable for all skin types.', 199, 299, 1, 48, 1, '[\"https://th.bing.com/th/id/R.0bd43fa76e6a09637d445d1187650fb7?rik=QZ8Snb5XVek0XA&riu=http%3a%2f%2fsokostore.com%2fcdn%2fshop%2ffiles%2fXL_p0191844311.webp%3fcrop%3dcenter%26height%3d500%26v%3d1691081781%26width%3d500&ehk=AIRUsj1r6iyzSal1dXNjK%2bYUAZ51B8XSXlTmc7Wcm0k%3d&risl=&pid=ImgRaw&r=0\"]', '[\"100ml\", \"150ml\", \"250ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(11, 'PC-013', 'Moisturizing Lotion - 400ml', 'moisturizing-lotion-400ml', 'Long-lasting moisturizing lotion. Keeps skin soft and hydrated all day.', 349, 499, 1, 42, 1, '[\"https://images.ctfassets.net/hi7q3yino4h2/5lSaRO647LXqux0HlUhpVn/6ac72fe8aa33d7886b558b57315a055d/Daily_Moisturizing_Lotion.JPEG\"]', '[\"200ml\", \"400ml\", \"1L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(12, 'PC-014', 'Deodorant Spray - Fresh - 150ml', 'deodorant-spray-fresh-150ml', 'Long-lasting deodorant spray with fresh fragrance. 48-hour protection.', 299, 399, 1, 38, 1, '[\"https://www.shoppersbd.com/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/p/o/polo-club-150ml-womens-body-spray-_2_.jpg\"]', '[\"100ml\", \"150ml\", \"250ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(13, 'PC-015', 'Lip Balm - SPF 15 - 4g', 'lip-balm-spf15-4g', 'Moisturizing lip balm with SPF 15 protection. Prevents chapped lips.', 149, 199, 1, 50, 1, '[\"https://mystisea.com/cdn/shop/files/NickaKHydroCareLipBalm.png?v=1718152929\"]', '[\"4g\", \"10g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(14, 'HC-001', 'Detergent Powder - 2kg', 'detergent-powder-2kg', 'Powerful detergent powder removes tough stains. Suitable for all fabrics.', 299, 399, 1, 60, 2, '[\"https://5.imimg.com/data5/SELLER/Default/2023/10/351402566/NS/EL/VO/64699478/hp-2kg-detergent-powder-1000x1000.jpg\"]', '[\"1kg\", \"2kg\", \"5kg\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(15, 'HC-002', 'Dishwashing Liquid - 1L', 'dishwashing-liquid-1l', 'Effective dishwashing liquid cuts through grease. Gentle on hands.', 199, 299, 1, 55, 2, '[\"https://5.imimg.com/data5/SELLER/Default/2022/8/FN/KV/CT/156316247/500ml-aadis-dish-wash-liquid-gel-500x500.jpeg\"]', '[\"500ml\", \"1L\", \"2L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(16, 'HC-003', 'Floor Cleaner - Multi-Surface - 1L', 'floor-cleaner-multi-surface-1l', 'Multi-surface floor cleaner. Safe for tiles, marble, and wooden floors.', 249, 349, 1, 45, 2, '[\"https://5.imimg.com/data5/SELLER/Default/2020/10/DQ/KS/TV/4185856/concrete-floor-cleaner.jpeg\"]', '[\"500ml\", \"1L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(17, 'HC-004', 'Toilet Cleaner - 1L', 'toilet-cleaner-1l', 'Powerful toilet cleaner removes stains and kills germs. Fresh fragrance.', 179, 249, 1, 50, 2, '[\"https://5.imimg.com/data5/SELLER/Default/2024/6/428823388/ND/SU/FD/142334731/1l-winfresh-toilet-cleaner-1000x1000.jpg\"]', '[\"500ml\", \"1L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(18, 'HC-005', 'Glass Cleaner - 500ml', 'glass-cleaner-500ml', 'Streak-free glass cleaner. Perfect for windows, mirrors, and glass surfaces.', 149, 199, 1, 40, 2, '[\"https://images.unsplash.com/photo-1737372849706-5128b0f211d3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688\"]', '[\"250ml\", \"500ml\", \"1L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(19, 'HC-006', 'Room Freshener - Lavender - 500ml', 'room-freshener-lavender-500ml', 'Long-lasting room freshener with lavender fragrance. Eliminates odors.', 299, 399, 1, 35, 2, '[\"https://5.imimg.com/data5/ML/DX/JV/SELLER-3938935/lavender-room-freshener.jpg\"]', '[\"250ml\", \"500ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(20, 'HC-007', 'Disinfectant Spray - 500ml', 'disinfectant-spray-500ml', 'Powerful disinfectant spray kills 99.9% germs. Safe for surfaces.', 349, 499, 1, 42, 2, '[\"https://tse2.mm.bing.net/th/id/OIP.gSLcrvWj9TFlzzqb4iDS4AAAAA?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3\"]', '[\"250ml\", \"500ml\", \"1L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(21, 'HC-008', 'Air Freshener Spray - Citrus - 400ml', 'air-freshener-spray-citrus-400ml', 'Refreshing citrus air freshener. Instant odor elimination.', 199, 299, 1, 38, 2, '[\"https://tse3.mm.bing.net/th/id/OIP.lJc8RvfrYLE4l6jPYXkI1QAAAA?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3\"]', '[\"200ml\", \"400ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(22, 'MISC-001', 'Scented Candles - Set of 3', 'scented-candles-set-of-3', 'Premium scented candles with long burn time. Multiple fragrance options.', 599, 899, 1, 30, 3, '[\"https://plus.unsplash.com/premium_photo-1684407617180-02d36c20a687?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FuZGxlJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600\"]', '[\"Set of 3\", \"Set of 6\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(23, 'MISC-002', 'Mosquito Coils - Pack of 10', 'mosquito-coils-pack-of-10', 'Effective mosquito coils. Long-lasting protection against mosquitoes.', 99, 149, 1, 50, 3, '[\"https://images.unsplash.com/photo-1608465343292-800ef1936b26?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9zcXVpdG8lMjBjb2lsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600\"]', '[\"Pack of 10\", \"Pack of 20\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(24, 'MISC-003', 'Mosquito Vaporizer - Liquid', 'mosquito-vaporizer-liquid', 'Electric mosquito vaporizer with refill liquid. 45 nights protection.', 299, 399, 1, 35, 3, '[\"https://media.istockphoto.com/id/1716378611/photo/spray-bottle-with-green-liquid-isolated-on-white-background-clipping-path-included.webp?a=1&b=1&s=612x612&w=0&k=20&c=AnpeUlnmqI3czNF946M9-mX0OaRDV2ESz9HD6D8usI8=\"]', '[\"45ml\", \"90ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(25, 'PC-018', 'Dove Nourishing Body Wash - 500ml', 'dove-nourishing-body-wash-500ml', 'Dove\'s signature moisturizing body wash with NutriumMoisture technology. Gentle cleansing formula that nourishes deep into skin, leaving it soft, smooth, and radiant. Dermatologically tested and suitable for daily use.', 876, 1549, 1, 45, 1, '[\"/dove.jpeg\"]', '[\"250ml\", \"500ml\", \"1L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(26, 'PC-019', 'Head & Shoulders Anti-Dandruff Shampoo - 650ml', 'head-shoulders-anti-dandruff-shampoo-650ml', 'Head & Shoulders clinically proven anti-dandruff shampoo with advanced formula. Effectively fights dandruff, relieves scalp itchiness, and removes flakes from the first wash. Leaves hair clean, fresh, and 100% flake-free with regular use.', 540, 899, 1, 50, 1, '[\"/head.jpeg\"]', '[\"340ml\", \"650ml\", \"1L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(27, 'PC-020', 'Mamaearth Onion Hair Oil - 250ml', 'mamaearth-onion-hair-oil-250ml', 'Mamaearth\'s natural onion hair oil enriched with redensyl and biotin. Promotes hair growth, reduces hair fall, and strengthens hair from roots. Made with toxin-free ingredients, this oil nourishes the scalp and adds natural shine to hair.', 720, 999, 1, 40, 1, '[\"/mamaearth.jpeg\"]', '[\"150ml\", \"250ml\", \"400ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(28, 'PC-021', 'Sunsilk Smooth & Manageable Shampoo - 650ml', 'sunsilk-smooth-manageable-shampoo-650ml', 'Sunsilk Smooth & Manageable shampoo with revolutionary formula. Infused with egg ceramide complex that deeply nourishes hair, making it silky smooth and easy to manage. Tames frizz and leaves hair beautifully soft with lasting fragrance.', 597, 899, 1, 55, 1, '[\"/Sunsilk.jpeg\"]', '[\"340ml\", \"650ml\", \"1L\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(29, 'PC-052', 'Lakme 9 to 5 Vitamin C+ Face Wash - 100g', 'lakme-9to5-vitamin-c-face-wash-100g', 'Lakme 9 to 5 Vitamin C+ Face Wash with microcrystalline beads for refreshed and glowing skin. Fortifies skin barrier against ageing, pollution, and sun damage. Brightens and revitalizes skin.', 269, 325, 1, 50, 1, '[\"/lakmefacewash.jpg\"]', '[\"50g\", \"100g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(30, 'PC-053', 'Lakme 9 to 5 Primer + Matte Lip Color', 'lakme-9to5-primer-matte-lip-color', 'Lakme 9 to 5 Primer + Matte Lip Color with built-in primer for long-lasting matte finish. Enriched with vitamin E for soft, smooth lips. Transfer-proof formula that stays all day.', 420, 525, 1, 45, 1, '[\"/lakmelipcolour.jpg\"]', '[\"3.6g\"]', '[\"Red\", \"Pink\", \"Nude\", \"Coral\", \"Mauve\"]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(31, 'PC-054', 'Lakme Absolute Matte Lipstick', 'lakme-absolute-matte-lipstick', 'Lakme Absolute Matte Lipstick with royal matte finish. Enriched with argan oil for moisturized lips. Long-lasting formula with intense color payoff. Glides smoothly for perfect application.', 525, 650, 1, 42, 1, '[\"/lakmelipstick.jpg\"]', '[\"3.7g\"]', '[\"Red\", \"Pink\", \"Nude\", \"Berry\", \"Coral\"]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(32, 'PC-055', 'MAC Retro Matte Lipstick', 'mac-retro-matte-lipstick', 'MAC Retro Matte Lipstick with vivid, full-coverage color. Matte finish that stays put for hours. Iconic shades loved by makeup artists worldwide. Premium quality formula.', 1950, 2200, 1, 30, 1, '[\"/maclipstick.jpg\"]', '[\"3g\"]', '[\"Ruby Woo\", \"Russian Red\", \"Chili\", \"Dangerous\", \"Relentlessly Red\"]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(33, 'PC-056', 'SUGAR Matte As Hell Crayon Lipstick', 'sugar-matte-as-hell-crayon-lipstick', 'SUGAR Matte As Hell Crayon Lipstick with intense matte finish. Easy-to-use crayon format for precise application. Long-lasting, transfer-proof formula. Enriched with vitamin E.', 949, 1199, 1, 38, 1, '[\"/sugarlipstick.jpg\"]', '[\"2.8g\"]', '[\"Scarlett O\'Hara\", \"Holly Golightly\", \"Rose Dawson\", \"Jackie Brown\", \"Cherry Darling\"]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(34, 'PC-057', 'RENEE Madness pH Lipstick', 'renee-madness-ph-lipstick', 'RENEE Madness pH Lipstick that changes color based on your pH level. Black lipstick transforms into glossy pink payoff. Long-lasting nourishment with unique color-changing formula.', 399, 499, 1, 48, 1, '[\"/reneekajal.jpg\"]', '[\"3.5g\"]', '[\"Black to Pink\", \"Black to Red\", \"Black to Coral\"]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(35, 'PC-058', 'L\'Oreal Paris Total Repair 5 Shampoo - 340ml', 'loreal-paris-total-repair-5-shampoo-340ml', 'L\'Oreal Paris Total Repair 5 Shampoo with Pro-Keratin and Ceramide. Fights 5 signs of damaged hair - hair fall, dryness, roughness, dullness, and split ends. Repairs and strengthens hair.', 300, 375, 1, 52, 1, '[\"/lorealrepairshampoo.jpg\"]', '[\"180ml\", \"340ml\", \"640ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(36, 'PC-059', 'L\'Oreal Paris Extraordinary Clay Shampoo - 360ml', 'loreal-paris-extraordinary-clay-shampoo-360ml', 'L\'Oreal Paris Extraordinary Clay Shampoo for oily roots and dry ends. Purifies oily scalp and hydrates dry lengths. 3 refined clays rebalance hair for fresh, lightweight feel.', 425, 525, 1, 45, 1, '[\"/lorealshampoo.jpg\"]', '[\"180ml\", \"360ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(37, 'PC-060', 'L\'Oreal Paris Mat Magique All-in-One Pressed Powder - 6.5g', 'loreal-paris-mat-magique-pressed-powder-6.5g', 'L\'Oreal Paris Mat Magique All-in-One Pressed Powder with oil control. Provides matte finish that lasts all day. Blurs imperfections and controls shine. Lightweight, breathable formula.', 549, 675, 1, 40, 1, '[\"/lorealoilcontrol.jpg\"]', '[\"6.5g\"]', '[\"Natural\", \"Ivory\", \"Beige\", \"Sand\"]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(38, 'PC-061', 'Denver Deodorant Spray for Men - 150ml', 'denver-deodorant-spray-men-150ml', 'Denver Deodorant Spray for Men with long-lasting fragrance. Provides 24-hour protection against body odor. Masculine scent that keeps you fresh all day. Alcohol-free formula.', 199, 250, 1, 60, 1, '[\"/denverspray.jpg\"]', '[\"150ml\", \"225ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(39, 'PC-062', 'Bombay Shaving Company Perfume Body Spray - 120ml', 'bombay-shaving-company-perfume-spray-120ml', 'Bombay Shaving Company Perfume Body Spray with premium fragrance. Long-lasting scent with sophisticated notes. Gas-free, skin-friendly formula. Perfect for daily use.', 299, 399, 1, 48, 1, '[\"/bombaysavingspray.jpg\"]', '[\"120ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(40, 'PC-063', 'Watta Girl Perfume Body Spray for Women - 150ml', 'watta-girl-perfume-body-spray-150ml', 'Watta Girl Perfume Body Spray for Women with floral and fruity notes. Long-lasting fragrance that keeps you fresh. Skin-friendly, alcohol-free formula. Perfect for everyday wear.', 249, 325, 1, 45, 1, '[\"/wattagirlspray.jpg\"]', '[\"150ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(41, 'PC-064', 'Nykaa Cosmetics Makeup Kit - Complete Set', 'nykaa-cosmetics-makeup-kit-complete', 'Nykaa Cosmetics Complete Makeup Kit with lipsticks, eyeshadows, blush, and brushes. Perfect for beginners and professionals. High-quality products in one convenient kit. Great value for money.', 1499, 1999, 1, 25, 1, '[\"/nykaamakeup.jpg\"]', '[\"Standard\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(42, 'PC-065', 'Nykaa Beauty Book Makeup Kit', 'nykaa-beauty-book-makeup-kit', 'Nykaa Beauty Book Makeup Kit with eyeshadows, lipsticks, and face products. Compact design perfect for travel. Versatile shades for multiple looks. Premium quality at affordable price.', 1299, 1699, 1, 28, 1, '[\"/nykaakit.jpg\"]', '[\"Standard\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(43, 'PC-066', 'SUGAR Ultimate Makeup Trio Kit', 'sugar-ultimate-makeup-trio-kit', 'SUGAR Ultimate Makeup Trio Kit with kajal, blush, and liquid lipstick. Long-lasting formulas that stay put all day. Perfect for creating versatile looks. Essential makeup products in one kit.', 601, 847, 1, 35, 1, '[\"/sugarmakeupkit.jpg\"]', '[\"Standard\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(44, 'PC-067', 'Frozen Princess Makeup Kit for Kids', 'frozen-princess-makeup-kit-kids', 'Frozen Princess Makeup Kit for Kids with safe, non-toxic cosmetics. Includes lip gloss, eyeshadow, and nail polish. Perfect for pretend play and dress-up. Washable and kid-friendly formula.', 799, 999, 1, 30, 1, '[\"/frozenmakeupkit.jpg\"]', '[\"Standard\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(45, 'PC-068', 'Dabur Amla Hair Oil - 450ml', 'dabur-amla-hair-oil-450ml', 'Dabur Amla Hair Oil for stronger, longer, and thicker hair. Enriched with amla extracts that nourish the scalp and strengthen hair strands. Stimulates new hair growth and controls premature greying.', 186, 220, 1, 60, 1, '[\"/Pictures/amlahairoil.jpg\"]', '[\"275ml\", \"450ml\", \"550ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(46, 'PC-069', 'Bajaj Almond Drops Non-Sticky Hair Oil - 300ml', 'bajaj-almond-drops-hair-oil-300ml', 'Bajaj Almond Drops non-sticky hair oil enriched with 6X Vitamin E and sweet almond oil. Reduces hair fall by 79% and makes hair stronger. Light, non-greasy formula.', 155, 195, 1, 55, 1, '[\"/Pictures/bajajalmondoil.jpg\"]', '[\"100ml\", \"300ml\", \"500ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(47, 'PC-070', 'Biotique Bio Kelp Protein Shampoo - 340ml', 'biotique-bio-kelp-protein-shampoo-340ml', 'Biotique Bio Kelp Protein Shampoo for falling hair. Enriched with natural kelp, peppermint oil, and mint leaf extracts. Strengthens hair and reduces hair fall naturally.', 299, 375, 1, 38, 1, '[\"/Pictures/biotiqueproteinsampoo.jpg\"]', '[\"190ml\", \"340ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(48, 'PC-071', 'Patanjali Dant Kanti Natural Toothpaste - 200g', 'patanjali-dant-kanti-natural-toothpaste-200g', 'Patanjali Dant Kanti Natural Toothpaste with akarkara, neem, babool, pudina, and cloves. Protects gums, removes bacteria, and provides complete oral care. 100% Ayurvedic formula.', 80, 100, 1, 75, 1, '[\"/Pictures/dantkantitoothpaste.jpg\"]', '[\"100g\", \"200g\", \"500g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(49, 'PC-072', 'Fiama Di Wills Gel Bar Soap - 125g (Pack of 3)', 'fiama-di-wills-gel-bar-soap-125g-pack-3', 'Fiama Di Wills Gel Bar with skin conditioners for soft, moisturized skin. Unique gel format cleanses deeply while maintaining skin\'s natural moisture. Refreshing fragrance.', 165, 210, 1, 50, 1, '[\"/Pictures/flamasoap.jpg\"]', '[\"125g x 3\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(50, 'PC-073', 'Forest Essentials Luxury Sugar Soap - 125g', 'forest-essentials-luxury-sugar-soap-125g', 'Forest Essentials Luxury Sugar Soap with pure essential oils and natural ingredients. Handmade Ayurvedic soap that gently cleanses and nourishes skin. Premium quality.', 495, 625, 1, 25, 1, '[\"/Pictures/forestessentialsoap.jpg\"]', '[\"125g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(51, 'PC-074', 'Godrej No.1 Sandal & Turmeric Soap - 100g (Pack of 4)', 'godrej-no1-sandal-turmeric-soap-100g-pack-4', 'Godrej No.1 Sandal & Turmeric soap with natural sandalwood and turmeric. Provides nourishment and protection. Trusted family soap for soft, healthy skin.', 68, 85, 1, 70, 1, '[\"/Pictures/godrejno1soap.jpg\"]', '[\"100g x 4\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(52, 'PC-075', 'Kama Ayurveda Kumkumadi Brightening Ayurvedic Face Scrub - 50g', 'kama-ayurveda-kumkumadi-face-scrub-50g', 'Kama Ayurveda Kumkumadi Brightening Face Scrub with saffron and other precious herbs. Gently exfoliates and brightens skin. Pure Ayurvedic formulation for radiant complexion.', 850, 1050, 1, 30, 1, '[\"/Pictures/kamaayurvedabeautyfluid.jpg\"]', '[\"50g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(53, 'PC-076', 'Medimix Ayurvedic Classic 18 Herbs Soap - 125g (Pack of 3)', 'medimix-ayurvedic-classic-18-herbs-125g-pack-3', 'Medimix Ayurvedic Classic soap with 18 herbs including eladi oil. Treats skin problems, prevents pimples, and provides natural glow. Handmade with traditional Ayurvedic formula.', 105, 135, 1, 58, 1, '[\"/Pictures/medmixsoap.jpg\"]', '[\"75g x 3\", \"125g x 3\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(54, 'PC-077', 'Parachute Advansed Coconut Hair Oil - 400ml', 'parachute-advansed-coconut-hair-oil-400ml', 'Parachute Advansed Coconut Hair Oil with deep conditioning formula. Nourishes hair from root to tip. Reduces hair fall and promotes healthy, strong hair growth.', 249, 310, 1, 65, 1, '[\"/Pictures/parasutecoconutoil.jpg\"]', '[\"200ml\", \"400ml\", \"600ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(55, 'PC-078', 'Ponds Dreamflower Fragrant Talcum Powder - 400g', 'ponds-dreamflower-talcum-powder-400g', 'Ponds Dreamflower Fragrant Talcum Powder with floral fragrance. Keeps skin fresh, dry, and delicately scented all day. Absorbs excess moisture and prevents body odor.', 199, 250, 1, 55, 1, '[\"/Pictures/pondspowder.jpg\"]', '[\"200g\", \"400g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(56, 'PC-079', 'Santoor Sandal & Turmeric Soap - 125g (Pack of 4)', 'santoor-sandal-turmeric-soap-125g-pack-4', 'Santoor Sandal & Turmeric soap with natural sandalwood and turmeric extracts. Gives younger-looking skin. Trusted by millions for soft, smooth, and glowing skin.', 95, 120, 1, 70, 1, '[\"/Pictures/santoorsoap.jpg\"]', '[\"100g x 4\", \"125g x 4\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(57, 'PC-080', 'Set Wet Hair Styling Gel - 100ml', 'set-wet-hair-styling-gel-100ml', 'Set Wet Hair Styling Gel with strong hold formula. Creates any hairstyle with long-lasting hold. Non-sticky, easy to wash off. Perfect for modern styling.', 85, 110, 1, 60, 1, '[\"/Pictures/setwetgel.jpg\"]', '[\"100ml\", \"250ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(58, 'PC-081', 'Vicco Turmeric Ayurvedic Cream - 70g', 'vicco-turmeric-ayurvedic-cream-70g', 'Vicco Turmeric Ayurvedic Cream with pure turmeric and sandalwood oil. Prevents pimples, removes blemishes, and gives fair complexion. Time-tested Ayurvedic formula.', 95, 120, 1, 48, 1, '[\"/Pictures/viccocream.jpg\"]', '[\"30g\", \"70g\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(59, 'PC-082', 'VLCC Natural Sciences Cleansing Milk - 200ml', 'vlcc-natural-sciences-cleansing-milk-200ml', 'VLCC Natural Sciences Cleansing Milk with natural extracts. Gently removes makeup and impurities. Leaves skin clean, soft, and refreshed. Suitable for all skin types.', 225, 285, 1, 45, 1, '[\"/Pictures/vlcccleansingmilk.jpg\"]', '[\"100ml\", \"200ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(60, 'PC-083', 'Yardley London Gentleman Deodorant Spray - 150ml', 'yardley-london-gentleman-deodorant-spray-150ml', 'Yardley London Gentleman Deodorant Spray with classic masculine fragrance. Provides long-lasting freshness and protection. Premium quality British heritage brand.', 249, 325, 1, 50, 1, '[\"/Pictures/yardleyspray.jpg\"]', '[\"150ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56'),
(61, 'PC-084', 'L\'Oreal Paris Scalp Advanced Anti-Discomfort Dermo-Regulator Shampoo - 300ml', 'loreal-paris-scalp-advanced-anti-discomfort-300ml', 'L\'Oreal Paris Scalp Advanced Anti-Discomfort Dermo-Regulator Shampoo with Niacinamide. Soothes and calms sensitive, itchy scalp. Lightweight gel formula that purifies and balances scalp comfort.', 599, 750, 1, 42, 1, '[\"/lorealscalpadvanced.png\"]', '[\"300ml\", \"500ml\"]', '[]', 1, '2026-01-07 15:42:56', '2026-01-07 15:42:56');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `name`, `slug`, `description`, `display_order`, `is_active`, `created_at`) VALUES
(1, 'Personal Care', 'personal-care', 'Personal care and beauty products', 1, 1, '2026-01-07 15:42:56'),
(2, 'Household Cleaning', 'household-cleaning', 'Cleaning and household products', 2, 1, '2026-01-07 15:42:56'),
(3, 'Miscellaneous', 'miscellaneous', 'Other products', 3, 1, '2026-01-07 15:42:56'),
(5, 'Soham', 'soham', '', 3, 1, '2026-01-07 17:19:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` varchar(50) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`, `phone`, `date_of_birth`, `gender`) VALUES
(1, 'Admin', 'admin@truaxis.com', 'scrypt:32768:8:1$fRWkpZsJL78DeWhv$480ff6a82931471fdbb97e6042575225815f98da83987b2026f241df3732ee77e3d67a961a5f820b45aeee4f5964a40e528cb5ccfb54e045525932839d2bc599', 'admin', 1, '2026-01-07 15:42:55', '2026-01-07 17:51:57', NULL, NULL, NULL),
(2, 'Truaxis', 'truaxis@gmail.com', 'scrypt:32768:8:1$qkzSOvVzX7R3H25h$ac08462d2fc25bf3b04b169afa34e352811d8ab0390ea2802a520a65b7d9a03415cd1641018278122c00ef027803e5805b96b8ad58f4ffb3863658c78b559ee1', 'customer', 1, '2026-01-07 15:42:56', '2026-01-07 17:44:33', NULL, NULL, NULL),
(3, 'Soham Karmakar', 'sohamkarmakar123@gmail.com', 'scrypt:32768:8:1$ec2dpsyueHr0X0wT$c727097d5b0cb8c801e4c4ee052093111e405b8198d01e64df54c5c37494f1f7d41a7ac29eb0e86fe7352adc001f27d62eb1b00281504ab736f1004768f7c56f', 'customer', 1, '2026-01-07 15:50:38', '2026-01-07 16:36:07', '7679022140', '04.05.2000', 'Male'),
(4, 'Xyz', 'xyz@gmail.com', 'scrypt:32768:8:1$jheTyMxXVPdwRsof$edd5c4f756da88084cab3343bd1aea0ca938b28eca7fb90c77a92ff3cbd3866af04f9716c276934f12d7017c9ac869dd4b5095745bb88194648dcef9f1a20cc8', 'customer', 1, '2026-01-07 16:12:59', '2026-01-07 16:12:59', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist_items`
--

INSERT INTO `wishlist_items` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 3, 4, '2026-01-07 16:15:00'),
(3, 4, 6, '2026-01-07 16:16:30'),
(4, 4, 7, '2026-01-07 16:16:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_orders_order_number` (`order_number`),
  ADD UNIQUE KEY `receipt_number` (`receipt_number`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payment_details`
--
ALTER TABLE `payment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_products_slug` (`slug`),
  ADD UNIQUE KEY `ix_products_sku` (`sku`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `ix_sections_slug` (`slug`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_email` (`email`);

--
-- Indexes for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_details`
--
ALTER TABLE `payment_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payment_details`
--
ALTER TABLE `payment_details`
  ADD CONSTRAINT `payment_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`);

--
-- Constraints for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `wishlist_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `wishlist_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

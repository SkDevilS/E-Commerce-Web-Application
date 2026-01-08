# TruAxis E-Commerce Backend

Flask-based REST API with JWT authentication, MySQL database, and comprehensive admin features.

## Features

- **JWT Authentication**: Secure token-based authentication
- **User Management**: Customer and admin roles with full CRUD operations
- **Product Management**: Complete product catalog with sections/categories
- **Cart System**: Persistent shopping cart for logged-in users
- **Wishlist**: Save favorite products
- **Order Management**: Complete order processing with status tracking
- **Address Management**: Multiple shipping addresses per user
- **Admin Dashboard**: Full-featured admin panel for managing the store

## Tech Stack

- **Framework**: Flask 3.0
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: Flask-JWT-Extended
- **CORS**: Flask-CORS for frontend integration

## Installation

### Prerequisites

- Python 3.8+
- MySQL Server
- pip (Python package manager)

### Setup Steps

1. **Install MySQL** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Install and start MySQL service

2. **Create Database**
   ```bash
   mysql -u root -p
   CREATE DATABASE truaxis_db;
   EXIT;
   ```

3. **Install Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update database credentials if needed

5. **Initialize Database**
   ```bash
   python init_db.py
   ```
   This will:
   - Create all database tables
   - Create admin user
   - Create default customer
   - Import all products from frontend JSON
   - Create product sections

6. **Run the Server**
   ```bash
   python app.py
   ```
   Server will start at: http://localhost:5000

## Default Credentials

### Admin Account
- **Email**: admin@truaxis.com
- **Password**: Admin@123

### Customer Account
- **Email**: truaxis@gmail.com
- **Password**: Truaxis@123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/change-password` - Change password

### Products (Public)
- `GET /api/products` - Get all products (with optional category filter)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `GET /api/products/sections` - Get all sections

### Cart (Authenticated)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart/clear` - Clear cart

### Wishlist (Authenticated)
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove wishlist item

### Addresses (Authenticated)
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Orders (Authenticated)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `POST /api/orders/:id/cancel` - Cancel order

### Admin (Admin Only)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `POST /api/admin/users/:id/reset-password` - Reset user password
- `POST /api/admin/users/:id/toggle-status` - Activate/deactivate user
- `GET /api/admin/sections` - Get all sections
- `POST /api/admin/sections` - Create section
- `PUT /api/admin/sections/:id` - Update section
- `DELETE /api/admin/sections/:id` - Delete section
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Database Schema

### Users
- id, name, email, password_hash, role, is_active, created_at, updated_at

### Addresses
- id, user_id, full_name, phone, address_line1, address_line2, city, state, pincode, is_default

### Sections
- id, name, slug, description, display_order, is_active

### Products
- id, sku, title, slug, description, price, original_price, is_on_sale, stock, section_id, images, sizes, colors, is_active

### Cart Items
- id, user_id, product_id, quantity, size, color

### Wishlist Items
- id, user_id, product_id

### Orders
- id, order_number, user_id, address_id, total_amount, status, payment_method, payment_status

### Order Items
- id, order_id, product_id, quantity, price, size, color

## Development

### Running in Development Mode
```bash
python app.py
```

### Database Migrations
To reset and reinitialize the database:
```bash
python init_db.py
```

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database `truaxis_db` exists

### Import Error
- Ensure all dependencies are installed: `pip install -r requirements.txt`

### Port Already in Use
- Change port in `app.py`: `app.run(port=5001)`

## Security Notes

- Change default passwords in production
- Update SECRET_KEY and JWT_SECRET_KEY in `.env`
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization

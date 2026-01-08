# TruAxisVentures E-Commerce Platform

A modern, full-stack e-commerce platform built with React and Flask, featuring a comprehensive admin dashboard and customer-facing storefront.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse products by categories and sections
- **Search & Filter**: Advanced product search and filtering capabilities
- **Shopping Cart**: Add, update, and manage cart items
- **Wishlist**: Save favorite products for later
- **User Authentication**: Secure registration and login system
- **Order Management**: Place orders and track order history
- **Multiple Payment Methods**: Support for UPI, Card, and Cash on Delivery
- **Address Management**: Save and manage multiple delivery addresses
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Admin Features
- **Dashboard**: Overview of key metrics and statistics
- **Order Management**: View, update, and manage customer orders
- **User Management**: Manage customer accounts and permissions
- **Product Management**: Add, edit, and delete products with bulk upload support
- **Section Management**: Organize products into categories and sections
- **Receipt Generation**: Automatic PDF receipt generation for orders
- **Professional Admin Portal**: Modern, intuitive admin interface

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern UI library
- **React Router**: Client-side routing
- **Zustand**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: ORM for database operations
- **Flask-JWT-Extended**: JWT authentication
- **Flask-CORS**: Cross-origin resource sharing
- **ReportLab**: PDF generation for receipts
- **SQLite**: Database (easily replaceable with PostgreSQL/MySQL)

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm or yarn

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd truaxis
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///truaxis.db
FLASK_ENV=development
```

#### Initialize Database
```bash
python init_db.py
```

#### Create Admin User
```bash
python -c "from models import db, User; from werkzeug.security import generate_password_hash; admin = User(name='Admin', email='your-admin-email@example.com', password=generate_password_hash('your-secure-password'), role='admin', is_active=True); db.session.add(admin); db.session.commit(); print('Admin user created')"
```

#### Start Backend Server
```bash
python app.py
```
The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd ..
npm install
```

#### Configure Environment
Create a `.env` file in the root directory if needed for custom configurations.

#### Start Development Server
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## 🏗️ Project Structure

```
truaxis/
├── backend/
│   ├── routes/          # API route handlers
│   ├── models.py        # Database models
│   ├── config.py        # Configuration settings
│   ├── app.py          # Flask application entry point
│   └── uploads/        # Product images storage
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── stores/        # Zustand state stores
│   ├── utils/         # Utility functions
│   └── config/        # Frontend configuration
├── public/            # Static assets
└── README.md
```

## 🎯 Usage

### Customer Portal
1. Visit `http://localhost:5173`
2. Browse products or register for an account
3. Add products to cart or wishlist
4. Proceed to checkout and place orders
5. View order history in the account section

### Admin Portal
1. Visit `http://admin.localhost:5173` (or configured admin domain)
2. Login with admin credentials
3. Access dashboard for overview
4. Manage orders, users, products, and sections
5. Download order receipts as needed

## 📦 Product Management

### Bulk Upload
The platform supports bulk product upload via Excel files:
1. Navigate to Admin > Products
2. Click "Bulk Upload"
3. Download the template
4. Fill in product details
5. Upload the completed file

See `BULK_UPLOAD_GUIDE.md` for detailed instructions.

## 🔐 Security Features

- JWT-based authentication
- Password hashing with Werkzeug
- Role-based access control (Admin/Customer)
- CORS protection
- Secure session management
- Input validation and sanitization

## 🎨 Customization

### Branding
- Update logo in `public/truaxis_logo.png`
- Modify favicon in `public/favicon.png`
- Adjust colors in `tailwind.config.js`

### Configuration
- Admin domain: `src/config/admin.config.js`
- API endpoints: `src/utils/api.js`
- Backend settings: `backend/config.py`

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest
```

### Frontend Tests
```bash
npm run test
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a production WSGI server (Gunicorn, uWSGI)
3. Configure database (PostgreSQL recommended)
4. Set up file storage (AWS S3, etc.)

### Frontend Deployment
```bash
npm run build
```
Deploy the `dist` folder to your hosting service (Netlify, Vercel, etc.)

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/sections` - Get all sections

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id/receipt` - Download receipt

### Admin Endpoints
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/orders` - All orders
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is proprietary software owned by TruAxisVentures.

## 📧 Support

For support and inquiries:
- Email: support@truaxis.com
- Website: www.truaxis.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Flask community for the robust backend framework
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

© 2024 TruAxisVentures. All rights reserved.

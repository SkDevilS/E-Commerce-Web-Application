import json
import os
from app import create_app
from models import db, User, Section, Product
from werkzeug.security import generate_password_hash

def init_database():
    """
    Initialize the database with tables and default data.
    This script will:
    1. Create all database tables
    2. Create admin user
    3. Create default sections
    4. Optionally load sample products
    """
    app = create_app()
    
    with app.app_context():
        print("=" * 60)
        print("TruAxisVentures Database Initialization")
        print("=" * 60)
        
        # Create all tables
        print("\n[1/4] Creating database tables...")
        db.create_all()
        print("✓ All tables created successfully")
        
        # Create admin user
        print("\n[2/4] Creating admin user...")
        admin_email = os.getenv('ADMIN_EMAIL', 'admin@truaxis.com')
        admin_password = os.getenv('ADMIN_PASSWORD', 'Admin@123')
        
        admin = User.query.filter_by(email=admin_email).first()
        if not admin:
            admin = User(
                name='Admin',
                email=admin_email,
                password=generate_password_hash(admin_password),
                role='admin',
                is_active=True
            )
            db.session.add(admin)
            db.session.commit()
            print(f"✓ Admin user created: {admin_email}")
        else:
            print(f"✓ Admin user already exists: {admin_email}")
        
        # Create default sections
        print("\n[3/4] Creating default sections...")
        sections_data = [
            {
                'name': 'Personal Care',
                'slug': 'personal-care',
                'description': 'Personal care and beauty products',
                'display_order': 1
            },
            {
                'name': 'Household Cleaning',
                'slug': 'household-cleaning',
                'description': 'Cleaning and household products',
                'display_order': 2
            },
            {
                'name': 'Miscellaneous',
                'slug': 'miscellaneous',
                'description': 'Other products',
                'display_order': 3
            }
        ]
        
        sections_created = 0
        for section_data in sections_data:
            section = Section.query.filter_by(slug=section_data['slug']).first()
            if not section:
                section = Section(**section_data)
                db.session.add(section)
                sections_created += 1
        
        db.session.commit()
        print(f"✓ {sections_created} sections created")
        
        # Load sample products (optional)
        print("\n[4/4] Loading sample products...")
        products_file = os.path.join(os.path.dirname(__file__), '../src/mocks/products.json')
        
        if os.path.exists(products_file):
            try:
                with open(products_file, 'r', encoding='utf-8') as f:
                    products_data = json.load(f)
                
                products_created = 0
                for product_data in products_data:
                    # Check if product already exists
                    existing = Product.query.filter_by(sku=product_data['sku']).first()
                    if existing:
                        continue
                    
                    # Get section by category
                    section = Section.query.filter_by(slug=product_data['category']).first()
                    if not section:
                        print(f"  Warning: Section not found for category {product_data['category']}")
                        continue
                    
                    product = Product(
                        sku=product_data['sku'],
                        title=product_data['title'],
                        slug=product_data['slug'],
                        description=product_data.get('description', ''),
                        price=product_data['price'],
                        original_price=product_data.get('original_price'),
                        is_on_sale=product_data.get('is_on_sale', False),
                        stock=product_data.get('stock', 0),
                        section_id=section.id,
                        images=json.dumps(product_data.get('images', [])),
                        sizes=json.dumps(product_data.get('sizes', [])),
                        colors=json.dumps(product_data.get('colors', [])),
                        is_active=True
                    )
                    db.session.add(product)
                    products_created += 1
                
                db.session.commit()
                print(f"✓ {products_created} sample products loaded")
            except Exception as e:
                print(f"  Warning: Could not load sample products: {e}")
        else:
            print("  No sample products file found (optional)")
        
        # Summary
        print("\n" + "=" * 60)
        print("Database Initialization Complete!")
        print("=" * 60)
        print(f"Total Users: {User.query.count()}")
        print(f"Total Sections: {Section.query.count()}")
        print(f"Total Products: {Product.query.count()}")
        print("\n" + "-" * 60)
        print("Admin Credentials:")
        print(f"  Email: {admin_email}")
        print(f"  Password: {admin_password}")
        print("-" * 60)
        print("\nIMPORTANT: Change the admin password after first login!")
        print("=" * 60)

if __name__ == '__main__':
    init_database()

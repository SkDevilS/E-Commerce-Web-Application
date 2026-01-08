import json
from app import create_app
from models import db, User, Section, Product
from config import Config

def init_database():
    app = create_app()
    
    with app.app_context():
        # Drop all tables and recreate
        print("Creating database tables...")
        db.create_all()
        
        # Create admin user
        admin = User.query.filter_by(email=Config.ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                name='Admin',
                email=Config.ADMIN_EMAIL,
                role='admin',
                is_active=True
            )
            admin.set_password(Config.ADMIN_PASSWORD)
            db.session.add(admin)
            print(f"Admin user created: {Config.ADMIN_EMAIL}")
        
        # Create default customer
        customer = User.query.filter_by(email='truaxis@gmail.com').first()
        if not customer:
            customer = User(
                name='Truaxis',
                email='truaxis@gmail.com',
                role='customer',
                is_active=True
            )
            customer.set_password('Truaxis@123')
            db.session.add(customer)
            print("Default customer created: truaxis@gmail.com")
        
        db.session.commit()
        
        # Create sections
        sections_data = [
            {'name': 'Personal Care', 'slug': 'personal-care', 'description': 'Personal care and beauty products', 'display_order': 1},
            {'name': 'Household Cleaning', 'slug': 'household-cleaning', 'description': 'Cleaning and household products', 'display_order': 2},
            {'name': 'Miscellaneous', 'slug': 'miscellaneous', 'description': 'Other products', 'display_order': 3}
        ]
        
        for section_data in sections_data:
            section = Section.query.filter_by(slug=section_data['slug']).first()
            if not section:
                section = Section(**section_data)
                db.session.add(section)
                print(f"Section created: {section_data['name']}")
        
        db.session.commit()
        
        # Load products from JSON
        print("Loading products from JSON...")
        with open('../src/mocks/products.json', 'r', encoding='utf-8') as f:
            products_data = json.load(f)
        
        for product_data in products_data:
            # Check if product already exists
            existing = Product.query.filter_by(sku=product_data['sku']).first()
            if existing:
                continue
            
            # Get section by category
            section = Section.query.filter_by(slug=product_data['category']).first()
            if not section:
                print(f"Warning: Section not found for category {product_data['category']}")
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
        
        db.session.commit()
        print(f"Database initialized successfully!")
        print(f"Total products: {Product.query.count()}")
        print(f"Total sections: {Section.query.count()}")
        print(f"\nAdmin Login:")
        print(f"Email: {Config.ADMIN_EMAIL}")
        print(f"Password: {Config.ADMIN_PASSWORD}")
        print(f"\nCustomer Login:")
        print(f"Email: truaxis@gmail.com")
        print(f"Password: Truaxis@123")

if __name__ == '__main__':
    init_database()

#!/usr/bin/env python3
"""
Script to add sample products to the database
"""
import os
import sys
import json
from datetime import datetime

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, Section, Product

def create_sample_products():
    app = create_app()
    
    with app.app_context():
        # Sample products data
        sample_products = [
            {
                'sku': 'SHIRT-001',
                'title': 'Classic Cotton Shirt',
                'slug': 'classic-cotton-shirt',
                'description': 'Premium quality cotton shirt perfect for formal and casual occasions. Comfortable fit with breathable fabric.',
                'price': 1299.00,
                'original_price': 1599.00,
                'is_on_sale': True,
                'stock': 50,
                'section': 'shirts',
                'images': ['/api/admin/uploads/products/sample-shirt-1.jpg'],
                'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
                'colors': ['White', 'Blue', 'Black', 'Gray']
            },
            {
                'sku': 'PANT-001',
                'title': 'Formal Trousers',
                'slug': 'formal-trousers',
                'description': 'Elegant formal trousers made from premium fabric. Perfect for office wear and formal events.',
                'price': 1899.00,
                'original_price': None,
                'is_on_sale': False,
                'stock': 30,
                'section': 'pants',
                'images': ['/api/admin/uploads/products/sample-pant-1.jpg'],
                'sizes': ['28', '30', '32', '34', '36', '38'],
                'colors': ['Black', 'Navy', 'Gray', 'Brown']
            },
            {
                'sku': 'DRESS-001',
                'title': 'Summer Floral Dress',
                'slug': 'summer-floral-dress',
                'description': 'Beautiful floral print dress perfect for summer occasions. Light and comfortable fabric.',
                'price': 2299.00,
                'original_price': 2799.00,
                'is_on_sale': True,
                'stock': 25,
                'section': 'dresses',
                'images': ['/api/admin/uploads/products/sample-dress-1.jpg'],
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'colors': ['Floral Pink', 'Floral Blue', 'Floral Yellow']
            },
            {
                'sku': 'SHOE-001',
                'title': 'Leather Formal Shoes',
                'slug': 'leather-formal-shoes',
                'description': 'Genuine leather formal shoes with comfortable sole. Perfect for office and formal events.',
                'price': 3499.00,
                'original_price': None,
                'is_on_sale': False,
                'stock': 20,
                'section': 'shoes',
                'images': ['/api/admin/uploads/products/sample-shoe-1.jpg'],
                'sizes': ['6', '7', '8', '9', '10', '11'],
                'colors': ['Black', 'Brown', 'Tan']
            },
            {
                'sku': 'ACC-001',
                'title': 'Leather Wallet',
                'slug': 'leather-wallet',
                'description': 'Premium leather wallet with multiple card slots and cash compartments.',
                'price': 899.00,
                'original_price': 1199.00,
                'is_on_sale': True,
                'stock': 40,
                'section': 'accessories',
                'images': ['/api/admin/uploads/products/sample-wallet-1.jpg'],
                'sizes': ['One Size'],
                'colors': ['Black', 'Brown', 'Tan']
            },
            {
                'sku': 'SHIRT-002',
                'title': 'Casual Polo Shirt',
                'slug': 'casual-polo-shirt',
                'description': 'Comfortable polo shirt for casual wear. Made from soft cotton blend.',
                'price': 999.00,
                'original_price': None,
                'is_on_sale': False,
                'stock': 60,
                'section': 'shirts',
                'images': ['/api/admin/uploads/products/sample-polo-1.jpg'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'colors': ['Red', 'Blue', 'Green', 'White']
            },
            {
                'sku': 'JEAN-001',
                'title': 'Slim Fit Jeans',
                'slug': 'slim-fit-jeans',
                'description': 'Modern slim fit jeans with stretch fabric for comfort and style.',
                'price': 1799.00,
                'original_price': 2199.00,
                'is_on_sale': True,
                'stock': 35,
                'section': 'pants',
                'images': ['/api/admin/uploads/products/sample-jeans-1.jpg'],
                'sizes': ['28', '30', '32', '34', '36'],
                'colors': ['Dark Blue', 'Light Blue', 'Black']
            },
            {
                'sku': 'DRESS-002',
                'title': 'Evening Gown',
                'slug': 'evening-gown',
                'description': 'Elegant evening gown perfect for special occasions and parties.',
                'price': 4999.00,
                'original_price': None,
                'is_on_sale': False,
                'stock': 15,
                'section': 'dresses',
                'images': ['/api/admin/uploads/products/sample-gown-1.jpg'],
                'sizes': ['XS', 'S', 'M', 'L'],
                'colors': ['Black', 'Navy', 'Burgundy', 'Emerald']
            }
        ]
        
        # Add products to database
        for product_data in sample_products:
            # Find section
            section = Section.query.filter_by(slug=product_data['section']).first()
            if not section:
                print(f"Section '{product_data['section']}' not found, skipping product {product_data['sku']}")
                continue
            
            # Check if product already exists
            existing_product = Product.query.filter_by(sku=product_data['sku']).first()
            if existing_product:
                print(f"Product {product_data['sku']} already exists, skipping...")
                continue
            
            # Create product
            product = Product(
                sku=product_data['sku'],
                title=product_data['title'],
                slug=product_data['slug'],
                description=product_data['description'],
                price=product_data['price'],
                original_price=product_data['original_price'],
                is_on_sale=product_data['is_on_sale'],
                stock=product_data['stock'],
                section_id=section.id,
                images=json.dumps(product_data['images']),
                sizes=json.dumps(product_data['sizes']),
                colors=json.dumps(product_data['colors']),
                is_active=True
            )
            
            db.session.add(product)
            print(f"Added product: {product_data['title']}")
        
        db.session.commit()
        print("Sample products added successfully!")

if __name__ == '__main__':
    create_sample_products()
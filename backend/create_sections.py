#!/usr/bin/env python3
"""
Script to create sample sections for the e-commerce site
"""
import os
import sys

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, Section

def create_sample_sections():
    app = create_app()
    
    with app.app_context():
        # Sample sections data
        sample_sections = [
            {
                'name': 'Shirts',
                'slug': 'shirts',
                'description': 'Formal and casual shirts for all occasions',
                'display_order': 1
            },
            {
                'name': 'Pants',
                'slug': 'pants',
                'description': 'Trousers, jeans, and formal pants',
                'display_order': 2
            },
            {
                'name': 'Dresses',
                'slug': 'dresses',
                'description': 'Elegant dresses for women',
                'display_order': 3
            },
            {
                'name': 'Shoes',
                'slug': 'shoes',
                'description': 'Footwear for all occasions',
                'display_order': 4
            },
            {
                'name': 'Accessories',
                'slug': 'accessories',
                'description': 'Bags, wallets, and other accessories',
                'display_order': 5
            },
            {
                'name': 'Jackets',
                'slug': 'jackets',
                'description': 'Coats, blazers, and jackets',
                'display_order': 6
            }
        ]
        
        # Add sections to database
        for section_data in sample_sections:
            # Check if section already exists
            existing_section = Section.query.filter_by(slug=section_data['slug']).first()
            if existing_section:
                print(f"Section '{section_data['name']}' already exists, skipping...")
                continue
            
            # Create section
            section = Section(
                name=section_data['name'],
                slug=section_data['slug'],
                description=section_data['description'],
                display_order=section_data['display_order'],
                is_active=True
            )
            
            db.session.add(section)
            print(f"Added section: {section_data['name']}")
        
        db.session.commit()
        print("Sample sections created successfully!")

if __name__ == '__main__':
    create_sample_sections()
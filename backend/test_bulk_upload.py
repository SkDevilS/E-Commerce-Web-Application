#!/usr/bin/env python3
"""
Test script to debug bulk upload functionality
"""
import os
import sys
import pandas as pd
from PIL import Image
import json

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import Config
from models import db, Section, Product
from app import create_app

def test_bulk_upload():
    """Test the bulk upload functionality"""
    print("=== BULK UPLOAD DEBUG TEST ===")
    
    # Test 1: Check upload folders
    print("\n1. Checking upload folders...")
    upload_folder = Config.UPLOAD_FOLDER
    print(f"Upload folder: {upload_folder}")
    print(f"Upload folder exists: {os.path.exists(upload_folder)}")
    
    bulk_images_folder = os.path.join(upload_folder, 'bulk_images')
    print(f"Bulk images folder: {bulk_images_folder}")
    print(f"Bulk images folder exists: {os.path.exists(bulk_images_folder)}")
    
    if os.path.exists(bulk_images_folder):
        images = os.listdir(bulk_images_folder)
        print(f"Images in bulk_images: {images}")
        
        # Test image processing
        for image_name in images[:2]:  # Test first 2 images
            image_path = os.path.join(bulk_images_folder, image_name)
            print(f"\nTesting image: {image_name}")
            print(f"Image path: {image_path}")
            print(f"Image exists: {os.path.exists(image_path)}")
            
            if os.path.exists(image_path):
                try:
                    with Image.open(image_path) as img:
                        print(f"Image size: {img.size}")
                        print(f"Image mode: {img.mode}")
                        print(f"Image format: {img.format}")
                except Exception as e:
                    print(f"Error opening image: {e}")
    
    # Test 2: Check sections
    print("\n2. Checking sections...")
    app = create_app()
    with app.app_context():
        sections = Section.query.all()
        print(f"Available sections: {[(s.id, s.slug, s.name) for s in sections]}")
    
    # Test 3: Check Excel template
    print("\n3. Checking Excel template...")
    template_path = os.path.join(upload_folder, 'product_upload_template.xlsx')
    print(f"Template path: {template_path}")
    print(f"Template exists: {os.path.exists(template_path)}")
    
    if os.path.exists(template_path):
        try:
            # Try reading the template
            df = pd.read_excel(template_path, sheet_name='Upload Template')
            print(f"Template columns: {list(df.columns)}")
            print(f"Template shape: {df.shape}")
            print(f"First few rows:\n{df.head()}")
        except Exception as e:
            print(f"Error reading template: {e}")
            
            # Try reading first sheet
            try:
                df = pd.read_excel(template_path, sheet_name=0)
                print(f"First sheet columns: {list(df.columns)}")
                print(f"First sheet shape: {df.shape}")
            except Exception as e2:
                print(f"Error reading first sheet: {e2}")
    
    # Test 4: Create a test Excel file
    print("\n4. Creating test Excel file...")
    test_data = {
        'sku': ['TEST-001', 'TEST-002'],
        'title': ['Test Product 1', 'Test Product 2'],
        'slug': ['test-product-1', 'test-product-2'],
        'description': ['Test description 1', 'Test description 2'],
        'price': [100.0, 200.0],
        'original_price': [120.0, 250.0],
        'is_on_sale': [True, False],
        'stock': [10, 20],
        'section_slug': ['shirts', 'pants'],
        'image_filenames': ['p1.jpg', 'p3.jpg'],
        'sizes': ['S,M,L', 'M,L,XL'],
        'colors': ['Red,Blue', 'Black,White'],
        'is_active': [True, True]
    }
    
    test_df = pd.DataFrame(test_data)
    test_excel_path = os.path.join(upload_folder, 'test_bulk_upload.xlsx')
    
    try:
        with pd.ExcelWriter(test_excel_path, engine='openpyxl') as writer:
            test_df.to_excel(writer, sheet_name='Upload Template', index=False)
        print(f"Test Excel file created: {test_excel_path}")
        
        # Test reading it back
        test_read_df = pd.read_excel(test_excel_path, sheet_name='Upload Template')
        print(f"Test file read successfully: {test_read_df.shape}")
        
    except Exception as e:
        print(f"Error creating test Excel file: {e}")
    
    print("\n=== TEST COMPLETE ===")

if __name__ == '__main__':
    test_bulk_upload()
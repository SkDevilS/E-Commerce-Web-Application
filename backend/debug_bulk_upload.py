#!/usr/bin/env python3
"""
Debug script for bulk upload issues
"""
import os
import sys
import pandas as pd
from PIL import Image
import json

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import Config

def debug_bulk_upload():
    """Debug the bulk upload functionality"""
    print("=== BULK UPLOAD DEBUG ===")
    
    # Check upload folders
    upload_folder = Config.UPLOAD_FOLDER
    print(f"Upload folder: {upload_folder}")
    
    bulk_images_folder = os.path.join(upload_folder, 'bulk_images')
    print(f"Bulk images folder exists: {os.path.exists(bulk_images_folder)}")
    
    if os.path.exists(bulk_images_folder):
        images = os.listdir(bulk_images_folder)
        print(f"Images in bulk_images: {images}")
    
    # Check if test Excel file exists
    test_excel_path = os.path.join(upload_folder, 'test_bulk_upload.xlsx')
    print(f"Test Excel exists: {os.path.exists(test_excel_path)}")
    
    if os.path.exists(test_excel_path):
        try:
            df = pd.read_excel(test_excel_path, sheet_name='Upload Template')
            print(f"Excel columns: {list(df.columns)}")
            print(f"Excel shape: {df.shape}")
            print("Excel data:")
            print(df.to_string())
        except Exception as e:
            print(f"Error reading Excel: {e}")
    
    # Create a simple test Excel file
    print("\nCreating simple test Excel...")
    test_data = {
        'sku': ['TEST-001'],
        'title': ['Test Product'],
        'slug': ['test-product'],
        'description': ['Test description'],
        'price': [100.0],
        'section_slug': ['shirts'],
        'image_filenames': ['p1.jpg'],
        'is_active': [True]
    }
    
    test_df = pd.DataFrame(test_data)
    simple_test_path = os.path.join(upload_folder, 'simple_test.xlsx')
    
    try:
        with pd.ExcelWriter(simple_test_path, engine='openpyxl') as writer:
            test_df.to_excel(writer, sheet_name='Upload Template', index=False)
        print(f"Simple test Excel created: {simple_test_path}")
        
        # Read it back
        read_df = pd.read_excel(simple_test_path, sheet_name='Upload Template')
        print("Simple test data:")
        print(read_df.to_string())
        
    except Exception as e:
        print(f"Error creating simple test Excel: {e}")

if __name__ == '__main__':
    debug_bulk_upload()
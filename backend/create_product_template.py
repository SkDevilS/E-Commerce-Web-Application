#!/usr/bin/env python3
"""
Script to create a sample Excel template for bulk product upload
"""
import pandas as pd
import os

def create_product_template():
    # Sample data for the template
    sample_data = [
        {
            'sku': 'SHIRT-001',
            'title': 'Classic Cotton Shirt',
            'slug': 'classic-cotton-shirt',
            'description': 'Premium quality cotton shirt perfect for formal and casual occasions',
            'price': 1299.00,
            'original_price': 1599.00,
            'is_on_sale': True,
            'stock': 50,
            'section_slug': 'shirts',
            'image_filenames': 'shirt-001-1.jpg,shirt-001-2.jpg',
            'sizes': 'S,M,L,XL,XXL',
            'colors': 'White,Blue,Black,Gray',
            'is_active': True
        },
        {
            'sku': 'PANT-001',
            'title': 'Formal Trousers',
            'slug': 'formal-trousers',
            'description': 'Elegant formal trousers made from premium fabric',
            'price': 1899.00,
            'original_price': '',
            'is_on_sale': False,
            'stock': 30,
            'section_slug': 'pants',
            'image_filenames': 'pant-001-1.jpg',
            'sizes': '28,30,32,34,36,38',
            'colors': 'Black,Navy,Gray,Brown',
            'is_active': True
        },
        {
            'sku': 'DRESS-001',
            'title': 'Summer Floral Dress',
            'slug': 'summer-floral-dress',
            'description': 'Beautiful floral print dress perfect for summer occasions',
            'price': 2299.00,
            'original_price': 2799.00,
            'is_on_sale': True,
            'stock': 25,
            'section_slug': 'dresses',
            'image_filenames': 'dress-001-1.jpg,dress-001-2.jpg,dress-001-3.jpg',
            'sizes': 'XS,S,M,L,XL',
            'colors': 'Floral Pink,Floral Blue,Floral Yellow',
            'is_active': True
        }
    ]
    
    # Create DataFrame
    df = pd.DataFrame(sample_data)
    
    # Create the Excel file
    template_path = 'product_upload_template.xlsx'
    
    with pd.ExcelWriter(template_path, engine='openpyxl') as writer:
        # Write sample data to 'Sample Data' sheet
        df.to_excel(writer, sheet_name='Sample Data', index=False)
        
        # Create an empty template sheet
        empty_df = pd.DataFrame(columns=df.columns)
        empty_df.to_excel(writer, sheet_name='Upload Template', index=False)
        
        # Create instructions sheet
        instructions = pd.DataFrame({
            'Field': [
                'sku', 'title', 'slug', 'description', 'price', 'original_price', 
                'is_on_sale', 'stock', 'section_slug', 'image_filenames', 
                'sizes', 'colors', 'is_active'
            ],
            'Description': [
                'Unique product identifier (required)',
                'Product name/title (required)',
                'URL-friendly version of title (required)',
                'Product description (optional)',
                'Current selling price (required)',
                'Original price before discount (optional)',
                'TRUE/FALSE - whether product is on sale',
                'Available quantity in stock',
                'Section slug (shirts, pants, dresses, shoes, accessories, jackets)',
                'Comma-separated list of image filenames (e.g., image1.jpg,image2.jpg)',
                'Comma-separated list of available sizes',
                'Comma-separated list of available colors',
                'TRUE/FALSE - whether product is active'
            ],
            'Example': [
                'SHIRT-001',
                'Classic Cotton Shirt',
                'classic-cotton-shirt',
                'Premium quality cotton shirt...',
                '1299.00',
                '1599.00',
                'TRUE',
                '50',
                'shirts',
                'shirt-001-1.jpg,shirt-001-2.jpg',
                'S,M,L,XL,XXL',
                'White,Blue,Black',
                'TRUE'
            ]
        })
        instructions.to_excel(writer, sheet_name='Instructions', index=False)
    
    print(f"Excel template created: {template_path}")
    return template_path

if __name__ == '__main__':
    create_product_template()
from flask import Blueprint, request, jsonify, current_app, send_from_directory, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Section, Product
from functools import wraps
from werkzeug.utils import secure_filename
import json
import os
import uuid
from PIL import Image
import pandas as pd

admin_bp = Blueprint('admin', __name__)

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    return wrapper

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def save_image(file, folder='products'):
    """Save uploaded image and return the filename"""
    if file and allowed_file(file.filename):
        # Generate unique filename
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        
        # Create folder if it doesn't exist
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], folder)
        os.makedirs(upload_path, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_path, unique_filename)
        file.save(file_path)
        
        print(f"Image saved to: {file_path}")  # Debug log
        
        # Optimize image
        try:
            with Image.open(file_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                
                # Resize if too large (max 1200px width)
                if img.width > 1200:
                    ratio = 1200 / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((1200, new_height), Image.Resampling.LANCZOS)
                
                # Save optimized image
                img.save(file_path, 'JPEG', quality=85, optimize=True)
        except Exception as e:
            print(f"Image optimization failed: {e}")
        
        # Return URL that matches our route - use full backend URL
        image_url = f"http://localhost:5000/uploads/{folder}/{unique_filename}"
        print(f"Returning image URL: {image_url}")  # Debug log
        return image_url
    return None

# File upload endpoint
@admin_bp.route('/upload-image', methods=['POST'])
@admin_required
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    image_url = save_image(file)
    if image_url:
        return jsonify({'image_url': image_url}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400



# User Management
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    return jsonify({'users': [user.to_dict() for user in users]}), 200

@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@admin_required
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()}), 200

@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email'].lower()).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        name=data['name'],
        email=data['email'].lower(),
        role=data.get('role', 'customer'),
        is_active=data.get('is_active', True)
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully', 'user': user.to_dict()}), 201

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        existing = User.query.filter_by(email=data['email'].lower()).first()
        if existing and existing.id != user_id:
            return jsonify({'error': 'Email already exists'}), 400
        user.email = data['email'].lower()
    if 'phone' in data:
        user.phone = data['phone']
    if 'date_of_birth' in data:
        user.date_of_birth = data['date_of_birth']
    if 'gender' in data:
        user.gender = data['gender']
    if 'role' in data:
        user.role = data['role']
    if 'is_active' in data:
        user.is_active = data['is_active']
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully', 'user': user.to_dict()}), 200

@admin_bp.route('/users/<int:user_id>/reset-password', methods=['POST'])
@admin_required
def reset_user_password(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    if not data or not data.get('new_password'):
        return jsonify({'error': 'New password required'}), 400
    
    user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'Password reset successfully'}), 200

@admin_bp.route('/users/<int:user_id>/toggle-status', methods=['POST'])
@admin_required
def toggle_user_status(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user.is_active = not user.is_active
    db.session.commit()
    
    return jsonify({
        'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
        'user': user.to_dict()
    }), 200

# Section Management
@admin_bp.route('/sections', methods=['GET'])
@admin_required
def get_sections():
    sections = Section.query.order_by(Section.display_order).all()
    return jsonify({'sections': [section.to_dict() for section in sections]}), 200

@admin_bp.route('/sections', methods=['POST'])
@admin_required
def create_section():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('slug'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if Section.query.filter_by(slug=data['slug']).first():
        return jsonify({'error': 'Section slug already exists'}), 400
    
    section = Section(
        name=data['name'],
        slug=data['slug'],
        description=data.get('description'),
        display_order=data.get('display_order', 0),
        is_active=data.get('is_active', True)
    )
    
    db.session.add(section)
    db.session.commit()
    
    return jsonify({'message': 'Section created successfully', 'section': section.to_dict()}), 201

@admin_bp.route('/sections/<int:section_id>', methods=['PUT'])
@admin_required
def update_section(section_id):
    section = Section.query.get(section_id)
    if not section:
        return jsonify({'error': 'Section not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        section.name = data['name']
    if 'slug' in data:
        existing = Section.query.filter_by(slug=data['slug']).first()
        if existing and existing.id != section_id:
            return jsonify({'error': 'Slug already exists'}), 400
        section.slug = data['slug']
    if 'description' in data:
        section.description = data['description']
    if 'display_order' in data:
        section.display_order = data['display_order']
    if 'is_active' in data:
        section.is_active = data['is_active']
    
    db.session.commit()
    return jsonify({'message': 'Section updated successfully', 'section': section.to_dict()}), 200

@admin_bp.route('/sections/<int:section_id>', methods=['DELETE'])
@admin_required
def delete_section(section_id):
    from flask import request
    
    section = Section.query.get(section_id)
    if not section:
        return jsonify({'error': 'Section not found'}), 404
    
    force = request.args.get('force', 'false').lower() == 'true'
    
    if section.products and not force:
        return jsonify({'error': 'Cannot delete section with products'}), 400
    
    if section.products and force:
        # Find or create a "Miscellaneous" section to move products to
        misc_section = Section.query.filter_by(slug='miscellaneous').first()
        if not misc_section:
            # Create miscellaneous section if it doesn't exist
            misc_section = Section(
                name='Miscellaneous',
                slug='miscellaneous',
                description='Other products',
                display_order=999,
                is_active=True
            )
            db.session.add(misc_section)
            db.session.flush()  # Get the ID
        
        # Move all products to miscellaneous section
        for product in section.products:
            product.section_id = misc_section.id
    
    db.session.delete(section)
    db.session.commit()
    
    return jsonify({'message': 'Section deleted successfully'}), 200

@admin_bp.route('/sections/<int:section_id>/toggle-status', methods=['POST'])
@admin_required
def toggle_section_status(section_id):
    section = Section.query.get(section_id)
    if not section:
        return jsonify({'error': 'Section not found'}), 404
    
    section.is_active = not section.is_active
    db.session.commit()
    
    return jsonify({'message': 'Section status updated successfully', 'section': section.to_dict()}), 200

# Product Management
@admin_bp.route('/products', methods=['GET'])
@admin_required
def get_all_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    section_id = request.args.get('section_id', type=int)
    search = request.args.get('search', '')
    
    query = Product.query
    
    if section_id:
        query = query.filter_by(section_id=section_id)
    
    if search:
        query = query.filter(
            db.or_(
                Product.title.contains(search),
                Product.sku.contains(search),
                Product.description.contains(search)
            )
        )
    
    products = query.order_by(Product.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'products': [product.to_dict() for product in products.items],
        'total': products.total,
        'pages': products.pages,
        'current_page': page
    }), 200

@admin_bp.route('/products/<int:product_id>', methods=['GET'])
@admin_required
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify({'product': product.to_dict()}), 200

@admin_bp.route('/products', methods=['POST'])
@admin_required
def create_product():
    data = request.get_json()
    
    required_fields = ['sku', 'title', 'slug', 'price', 'section_id']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if Product.query.filter_by(sku=data['sku']).first():
        return jsonify({'error': 'SKU already exists'}), 400
    
    if Product.query.filter_by(slug=data['slug']).first():
        return jsonify({'error': 'Slug already exists'}), 400
    
    section = Section.query.get(data['section_id'])
    if not section:
        return jsonify({'error': 'Section not found'}), 404
    
    product = Product(
        sku=data['sku'],
        title=data['title'],
        slug=data['slug'],
        description=data.get('description'),
        price=data['price'],
        original_price=data.get('original_price'),
        is_on_sale=data.get('is_on_sale', False),
        stock=data.get('stock', 0),
        section_id=data['section_id'],
        images=json.dumps(data.get('images', [])),
        sizes=json.dumps(data.get('sizes', [])),
        colors=json.dumps(data.get('colors', [])),
        is_active=data.get('is_active', True)
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({'message': 'Product created successfully', 'product': product.to_dict()}), 201

@admin_bp.route('/products/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    if 'sku' in data:
        existing = Product.query.filter_by(sku=data['sku']).first()
        if existing and existing.id != product_id:
            return jsonify({'error': 'SKU already exists'}), 400
        product.sku = data['sku']
    
    if 'slug' in data:
        existing = Product.query.filter_by(slug=data['slug']).first()
        if existing and existing.id != product_id:
            return jsonify({'error': 'Slug already exists'}), 400
        product.slug = data['slug']
    
    if 'title' in data:
        product.title = data['title']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'original_price' in data:
        product.original_price = data['original_price']
    if 'is_on_sale' in data:
        product.is_on_sale = data['is_on_sale']
    if 'stock' in data:
        product.stock = data['stock']
    if 'section_id' in data:
        section = Section.query.get(data['section_id'])
        if not section:
            return jsonify({'error': 'Section not found'}), 404
        product.section_id = data['section_id']
    if 'images' in data:
        product.images = json.dumps(data['images'])
    if 'sizes' in data:
        product.sizes = json.dumps(data['sizes'])
    if 'colors' in data:
        product.colors = json.dumps(data['colors'])
    if 'is_active' in data:
        product.is_active = data['is_active']
    
    db.session.commit()
    return jsonify({'message': 'Product updated successfully', 'product': product.to_dict()}), 200

@admin_bp.route('/products/<int:product_id>/toggle-status', methods=['POST'])
@admin_required
def toggle_product_status(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    product.is_active = not product.is_active
    db.session.commit()
    
    return jsonify({
        'message': f'Product {"activated" if product.is_active else "deactivated"} successfully',
        'product': product.to_dict()
    }), 200

# Dashboard Stats
@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    from models import Order
    
    total_users = User.query.filter_by(role='customer').count()
    total_products = Product.query.count()
    total_sections = Section.query.count()
    total_orders = Order.query.count()
    
    return jsonify({
        'total_users': total_users,
        'total_products': total_products,
        'total_sections': total_sections,
        'total_orders': total_orders
    }), 200
@admin_bp.route('/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Delete associated image files
    try:
        if product.images:
            images = json.loads(product.images)
            for image_url in images:
                if image_url.startswith('/api/admin/uploads/'):
                    # Extract filename from URL
                    filename = image_url.replace('/api/admin/uploads/', '')
                    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                    if os.path.exists(file_path):
                        os.remove(file_path)
    except Exception as e:
        print(f"Error deleting image files: {e}")
    
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': 'Product deleted successfully'}), 200

# Bulk product upload endpoints
@admin_bp.route('/bulk-upload-products', methods=['POST'])
@admin_required
def bulk_upload_products():
    print("=== BULK PRODUCT UPLOAD DEBUG ===")
    print(f"Request files: {request.files}")
    
    if 'excel_file' not in request.files:
        print("ERROR: No 'excel_file' key in request.files")
        return jsonify({'error': 'No Excel file provided'}), 400
    
    file = request.files['excel_file']
    print(f"Excel file: {file.filename}")
    
    if file.filename == '':
        print("ERROR: No file selected")
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.lower().endswith(('.xlsx', '.xls')):
        print(f"ERROR: Invalid file type: {file.filename}")
        return jsonify({'error': 'File must be an Excel file (.xlsx or .xls)'}), 400
    
    try:
        # Read Excel file - try both sheet names
        df = None
        try:
            df = pd.read_excel(file, sheet_name='Upload Template')
            print("Successfully read 'Upload Template' sheet")
        except:
            try:
                df = pd.read_excel(file, sheet_name=0)  # First sheet
                print("Successfully read first sheet (index 0)")
            except Exception as e:
                print(f"ERROR reading Excel file: {str(e)}")
                return jsonify({'error': f'Failed to read Excel file: {str(e)}'}), 400
        
        print(f"DataFrame shape: {df.shape}")
        print(f"DataFrame columns: {list(df.columns)}")
        print(f"First few rows:\n{df.head()}")
        
        # Validate required columns
        required_columns = ['sku', 'title', 'slug', 'price', 'section_slug']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            error_msg = f'Missing required columns: {", ".join(missing_columns)}'
            print(f"ERROR: {error_msg}")
            return jsonify({'error': error_msg}), 400
        
        # Process each row
        results = {
            'success': 0,
            'errors': [],
            'created_products': []
        }
        
        print(f"Processing {len(df)} rows...")
        
        for index, row in df.iterrows():
            print(f"\n--- Processing row {index + 1} ---")
            print(f"Row data: {dict(row)}")
            
            try:
                # Skip empty rows
                if pd.isna(row['sku']) or pd.isna(row['title']):
                    print(f"Skipping row {index + 1}: Empty SKU or title")
                    continue
                
                # Check if product already exists
                existing_product = Product.query.filter_by(sku=row['sku']).first()
                if existing_product:
                    error_msg = f"Row {index + 2}: Product with SKU '{row['sku']}' already exists"
                    print(f"ERROR: {error_msg}")
                    results['errors'].append(error_msg)
                    continue
                
                # Find section
                section_slug = str(row['section_slug']).strip().lower()
                print(f"Looking for section with slug: '{section_slug}'")
                section = Section.query.filter_by(slug=section_slug).first()
                if not section:
                    # List available sections for debugging
                    available_sections = [s.slug for s in Section.query.all()]
                    error_msg = f"Row {index + 2}: Section '{section_slug}' not found. Available: {available_sections}"
                    print(f"ERROR: {error_msg}")
                    results['errors'].append(error_msg)
                    continue
                
                print(f"Found section: {section.name} (ID: {section.id})")
                
                # Process image filenames
                image_urls = []
                if not pd.isna(row.get('image_filenames', '')):
                    image_filenames = [name.strip() for name in str(row['image_filenames']).split(',')]
                    print(f"Processing images: {image_filenames}")
                    
                    for filename in image_filenames:
                        if filename:
                            # Check if image exists in bulk_images folder
                            bulk_image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'bulk_images', filename)
                            print(f"Looking for image: {bulk_image_path}")
                            
                            if os.path.exists(bulk_image_path):
                                print(f"Found image: {filename}")
                                # Move image to products folder
                                products_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'products')
                                os.makedirs(products_folder, exist_ok=True)
                                
                                # Generate unique filename
                                name, ext = os.path.splitext(filename)
                                unique_filename = f"{uuid.uuid4().hex}{ext}"
                                new_path = os.path.join(products_folder, unique_filename)
                                
                                # Copy and optimize image
                                try:
                                    with Image.open(bulk_image_path) as img:
                                        if img.mode in ('RGBA', 'P'):
                                            img = img.convert('RGB')
                                        if img.width > 1200:
                                            ratio = 1200 / img.width
                                            new_height = int(img.height * ratio)
                                            img = img.resize((1200, new_height), Image.Resampling.LANCZOS)
                                        img.save(new_path, 'JPEG', quality=85, optimize=True)
                                    
                                    image_url = f"http://localhost:5000/uploads/products/{unique_filename}"
                                    image_urls.append(image_url)
                                    print(f"Processed image: {filename} -> {unique_filename}")
                                    
                                except Exception as e:
                                    error_msg = f"Row {index + 2}: Failed to process image '{filename}': {str(e)}"
                                    print(f"ERROR: {error_msg}")
                                    results['errors'].append(error_msg)
                            else:
                                error_msg = f"Row {index + 2}: Image '{filename}' not found in bulk_images folder"
                                print(f"ERROR: {error_msg}")
                                results['errors'].append(error_msg)
                
                # Create product
                print(f"Creating product with SKU: {row['sku']}")
                product = Product(
                    sku=str(row['sku']).strip(),
                    title=str(row['title']).strip(),
                    slug=str(row['slug']).strip(),
                    description=str(row.get('description', '')).strip(),
                    price=float(row['price']),
                    original_price=float(row['original_price']) if not pd.isna(row.get('original_price')) and row.get('original_price') != '' else None,
                    is_on_sale=bool(row.get('is_on_sale', False)) if not pd.isna(row.get('is_on_sale')) else False,
                    stock=int(row.get('stock', 0)) if not pd.isna(row.get('stock')) else 0,
                    section_id=section.id,
                    images=json.dumps(image_urls),
                    sizes=json.dumps([s.strip() for s in str(row.get('sizes', '')).split(',') if s.strip()]) if not pd.isna(row.get('sizes')) else json.dumps([]),
                    colors=json.dumps([c.strip() for c in str(row.get('colors', '')).split(',') if c.strip()]) if not pd.isna(row.get('colors')) else json.dumps([]),
                    is_active=bool(row.get('is_active', True)) if not pd.isna(row.get('is_active')) else True
                )
                
                db.session.add(product)
                results['success'] += 1
                results['created_products'].append({
                    'sku': product.sku,
                    'title': product.title
                })
                print(f"Product created successfully: {product.sku}")
                
            except Exception as e:
                error_msg = f"Row {index + 2}: {str(e)}"
                print(f"ERROR: {error_msg}")
                results['errors'].append(error_msg)
        
        # Commit all changes
        if results['success'] > 0:
            db.session.commit()
            print(f"Committed {results['success']} products to database")
        else:
            print("No products to commit")
        
        print(f"=== FINAL RESULTS ===")
        print(f"Success: {results['success']}")
        print(f"Errors: {len(results['errors'])}")
        
        return jsonify({
            'message': f'Bulk upload completed. {results["success"]} products created.',
            'results': results
        }), 200
        
    except Exception as e:
        db.session.rollback()
        error_msg = f'Failed to process Excel file: {str(e)}'
        print(f"CRITICAL ERROR: {error_msg}")
        return jsonify({'error': error_msg}), 500

@admin_bp.route('/download-product-template', methods=['GET'])
@admin_required
def download_product_template():
    """Download Excel template for bulk product upload"""
    try:
        # Create template if it doesn't exist
        template_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'product_upload_template.xlsx')
        
        if not os.path.exists(template_path):
            # Create the template
            import sys
            sys.path.append(os.path.dirname(os.path.abspath(__file__)))
            from create_product_template import create_product_template
            create_product_template()
            
            # Move to uploads folder
            import shutil
            shutil.move('product_upload_template.xlsx', template_path)
        
        return send_from_directory(
            current_app.config['UPLOAD_FOLDER'],
            'product_upload_template.xlsx',
            as_attachment=True,
            download_name='product_upload_template.xlsx'
        )
    except Exception as e:
        return jsonify({'error': f'Failed to generate template: {str(e)}'}), 500

@admin_bp.route('/bulk-upload-images', methods=['POST'])
@admin_required
def bulk_upload_images():
    """Upload multiple images for bulk product creation"""
    print("=== BULK IMAGE UPLOAD DEBUG ===")
    print(f"Request files: {request.files}")
    print(f"Request form: {request.form}")
    
    if 'images' not in request.files:
        print("ERROR: No 'images' key in request.files")
        return jsonify({'error': 'No images provided'}), 400
    
    files = request.files.getlist('images')
    print(f"Number of files received: {len(files)}")
    
    if not files or (len(files) == 1 and files[0].filename == ''):
        print("ERROR: No files selected or empty filename")
        return jsonify({'error': 'No files selected'}), 400
    
    # Create bulk_images folder
    bulk_images_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'bulk_images')
    os.makedirs(bulk_images_folder, exist_ok=True)
    print(f"Bulk images folder: {bulk_images_folder}")
    print(f"Bulk images folder exists: {os.path.exists(bulk_images_folder)}")
    
    results = {
        'success': 0,
        'errors': [],
        'uploaded_files': []
    }
    
    for i, file in enumerate(files):
        print(f"Processing file {i+1}: {file.filename}")
        
        if file.filename == '':
            print(f"Skipping empty filename for file {i+1}")
            continue
            
        if file and allowed_file(file.filename):
            try:
                # Use original filename for bulk upload
                filename = secure_filename(file.filename)
                file_path = os.path.join(bulk_images_folder, filename)
                print(f"Saving to: {file_path}")
                
                # Check if file already exists
                if os.path.exists(file_path):
                    error_msg = f"File '{filename}' already exists"
                    print(f"ERROR: {error_msg}")
                    results['errors'].append(error_msg)
                    continueint(f"ERROR: {error_msg}")
                    results['errors'].append(error_msg)
                    continue
                
                # Save file
                file.save(file_path)
                print(f"File saved successfully: {filename}")
                
                # Verify file was saved
                if os.path.exists(file_path):
                    file_size = os.path.getsize(file_path)
                    print(f"File verified - size: {file_size} bytes")
                    results['success'] += 1
                    results['uploaded_files'].append(filename)
                else:
                    error_msg = f"Failed to save '{filename}' - file not found after save"
                    print(f"ERROR: {error_msg}")
                    results['errors'].append(error_msg)
                
            except Exception as e:
                error_msg = f"Failed to upload '{file.filename}': {str(e)}"
                print(f"ERROR: {error_msg}")
                results['errors'].append(error_msg)
        else:
            error_msg = f"Invalid file type: '{file.filename}'"
            print(f"ERROR: {error_msg}")
            results['errors'].append(error_msg)
    
    print(f"=== UPLOAD RESULTS ===")
    print(f"Success: {results['success']}")
    print(f"Errors: {len(results['errors'])}")
    print(f"Uploaded files: {results['uploaded_files']}")
    
    return jsonify({
        'message': f'Bulk image upload completed. {results["success"]} images uploaded.',
        'results': results
    }), 200

# Order Management
@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_all_orders():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status')
    search = request.args.get('search', '')
    
    from models import Order, User
    
    query = Order.query
    
    if status:
        query = query.filter_by(status=status)
    
    if search:
        query = query.join(User).filter(
            db.or_(
                Order.order_number.contains(search),
                Order.receipt_number.contains(search),
                User.email.contains(search),
                User.name.contains(search)
            )
        )
    
    orders = query.order_by(Order.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'orders': [order.to_dict(include_user=True) for order in orders.items],
        'total': orders.total,
        'pages': orders.pages,
        'current_page': page
    }), 200

@admin_bp.route('/orders/<int:order_id>', methods=['GET'])
@admin_required
def get_admin_order(order_id):
    from models import Order
    
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    return jsonify({'order': order.to_dict(include_user=True)}), 200

@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    from models import Order
    
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
    
    valid_statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if data['status'] not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400
    
    order.status = data['status']
    db.session.commit()
    
    return jsonify({
        'message': 'Order status updated successfully',
        'order': order.to_dict(include_user=True)
    }), 200

@admin_bp.route('/orders/<int:order_id>/receipt', methods=['GET'])
@admin_required
def download_admin_receipt(order_id):
    from models import Order
    from routes.orders import generate_receipt_pdf
    
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    try:
        pdf_buffer = generate_receipt_pdf(order)
        
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f'receipt_{order.receipt_number}.pdf',
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({'error': 'Failed to generate receipt'}), 500

@admin_bp.route('/orders/<int:order_id>', methods=['DELETE'])
@admin_required
def delete_order(order_id):
    """
    Delete an order permanently from the database.
    This will remove the order from both admin dashboard and customer account.
    """
    from models import Order, OrderItem
    
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    try:
        order_number = order.order_number
        
        # Delete order items first (if CASCADE is not set up)
        OrderItem.query.filter_by(order_id=order_id).delete()
        
        # Delete the order
        db.session.delete(order)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order deleted successfully',
            'order_number': order_number
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting order: {str(e)}")
        return jsonify({
            'error': 'Failed to delete order',
            'details': str(e)
        }), 500

@admin_bp.route('/orders/stats', methods=['GET'])
@admin_required
def get_order_stats():
    from models import Order
    from sqlalchemy import func
    
    # Order counts by status
    status_counts = db.session.query(
        Order.status,
        func.count(Order.id).label('count')
    ).group_by(Order.status).all()
    
    # Total revenue
    total_revenue = db.session.query(
        func.sum(Order.total_amount)
    ).filter(Order.status.in_(['confirmed', 'shipped', 'delivered'])).scalar() or 0
    
    # Recent orders count (last 30 days)
    from datetime import datetime, timedelta
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_orders = Order.query.filter(Order.created_at >= thirty_days_ago).count()
    
    return jsonify({
        'status_counts': {status: count for status, count in status_counts},
        'total_revenue': total_revenue,
        'recent_orders': recent_orders
    }), 200
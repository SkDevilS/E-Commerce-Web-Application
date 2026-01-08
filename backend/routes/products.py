from flask import Blueprint, request, jsonify
from models import db, Product, Section

products_bp = Blueprint('products', __name__)

@products_bp.route('', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Product.query.filter_by(is_active=True)
    
    if category:
        section = Section.query.filter_by(slug=category, is_active=True).first()
        if section:
            query = query.filter_by(section_id=section.id)
    
    if search:
        query = query.filter(Product.title.ilike(f'%{search}%'))
    
    products = query.all()
    return jsonify([product.to_dict() for product in products]), 200

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.filter_by(id=product_id, is_active=True).first()
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify(product.to_dict()), 200

@products_bp.route('/slug/<slug>', methods=['GET'])
def get_product_by_slug(slug):
    product = Product.query.filter_by(slug=slug, is_active=True).first()
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify(product.to_dict()), 200

@products_bp.route('/sections', methods=['GET'])
def get_sections():
    sections = Section.query.filter_by(is_active=True).order_by(Section.display_order).all()
    return jsonify([section.to_dict() for section in sections]), 200

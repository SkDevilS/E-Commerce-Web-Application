from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, WishlistItem, Product

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('', methods=['GET'])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    wishlist_items = WishlistItem.query.filter_by(user_id=user_id).all()
    return jsonify({'items': [item.to_dict() for item in wishlist_items]}), 200

@wishlist_bp.route('', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('product_id'):
        return jsonify({'error': 'Product ID required'}), 400
    
    product = Product.query.get(data['product_id'])
    if not product or not product.is_active:
        return jsonify({'error': 'Product not found'}), 404
    
    # Check if already in wishlist
    existing = WishlistItem.query.filter_by(
        user_id=user_id,
        product_id=data['product_id']
    ).first()
    
    if existing:
        return jsonify({'message': 'Item already in wishlist'}), 200
    
    wishlist_item = WishlistItem(
        user_id=user_id,
        product_id=data['product_id']
    )
    
    db.session.add(wishlist_item)
    db.session.commit()
    
    return jsonify({'message': 'Item added to wishlist', 'item': wishlist_item.to_dict()}), 201

@wishlist_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(item_id):
    user_id = get_jwt_identity()
    wishlist_item = WishlistItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not wishlist_item:
        return jsonify({'error': 'Wishlist item not found'}), 404
    
    db.session.delete(wishlist_item)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from wishlist'}), 200

@wishlist_bp.route('/product/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_product_from_wishlist(product_id):
    user_id = get_jwt_identity()
    wishlist_item = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    
    if not wishlist_item:
        return jsonify({'error': 'Wishlist item not found'}), 404
    
    db.session.delete(wishlist_item)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from wishlist'}), 200

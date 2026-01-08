import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.products import products_bp
from routes.cart import cart_bp
from routes.wishlist import wishlist_bp
from routes.orders import orders_bp
from routes.addresses import addresses_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app, resources={
        r"/api/*": {"origins": "*"},
        r"/uploads/*": {"origins": "*"}
    })
    db.init_app(app)
    JWTManager(app)
    
    # Create upload folder
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(wishlist_bp, url_prefix='/api/wishlist')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(addresses_bp, url_prefix='/api/addresses')
    
    # Serve uploaded files
    @app.route('/api/admin/uploads/<path:filename>')
    def uploaded_file_api(filename):
        try:
            response = send_from_directory(app.config['UPLOAD_FOLDER'], filename)
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Cache-Control'] = 'public, max-age=3600'
            return response
        except Exception as e:
            print(f"Error serving file {filename}: {e}")
            return jsonify({'error': 'File not found'}), 404
    
    # Alternative route for direct access
    @app.route('/uploads/<path:filename>')
    def uploaded_file_direct(filename):
        try:
            response = send_from_directory(app.config['UPLOAD_FOLDER'], filename)
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Cache-Control'] = 'public, max-age=3600'
            return response
        except Exception as e:
            print(f"Error serving file {filename}: {e}")
            return jsonify({'error': 'File not found'}), 404
    
    # Health check
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok', 'message': 'TruAxis API is running'})
    
    # Debug endpoint for upload configuration
    @app.route('/api/debug/upload-config')
    def debug_upload_config():
        upload_folder = app.config['UPLOAD_FOLDER']
        products_folder = os.path.join(upload_folder, 'products')
        
        files_in_products = []
        if os.path.exists(products_folder):
            files_in_products = os.listdir(products_folder)
        
        return jsonify({
            'upload_folder': upload_folder,
            'upload_folder_exists': os.path.exists(upload_folder),
            'products_folder_exists': os.path.exists(products_folder),
            'files_in_products': files_in_products,
            'max_content_length': app.config['MAX_CONTENT_LENGTH'],
            'allowed_extensions': list(app.config['ALLOWED_EXTENSIONS']),
            'sample_urls': [
                f"http://localhost:5000/uploads/products/{f}" for f in files_in_products[:3]
            ]
        })
    
    # Public sections endpoint
    @app.route('/api/sections')
    def get_sections():
        from models import Section
        sections = Section.query.filter_by(is_active=True).order_by(Section.display_order).all()
        return jsonify([section.to_dict() for section in sections])
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
    app.run(debug=True, host='0.0.0.0', port=5000)

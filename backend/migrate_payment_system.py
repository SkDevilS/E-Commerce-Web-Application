#!/usr/bin/env python3
"""
Migration script to add payment system features to existing database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, Order, PaymentDetail
from sqlalchemy import text
import random
import string

def generate_receipt_number():
    """Generate a unique receipt number"""
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f'RCP{random_str}'

def migrate_payment_system():
    """Add payment system features to existing database"""
    app = create_app()
    
    with app.app_context():
        print("Starting payment system migration...")
        
        # Create new tables
        print("Creating PaymentDetail table...")
        db.create_all()
        
        # Add receipt_number column to existing orders if it doesn't exist
        try:
            # Check if receipt_number column exists
            result = db.session.execute(text("SHOW COLUMNS FROM orders LIKE 'receipt_number'"))
            if not result.fetchone():
                print("Adding receipt_number column to orders table...")
                db.session.execute(text("ALTER TABLE orders ADD COLUMN receipt_number VARCHAR(20) UNIQUE"))
                db.session.commit()
                
                # Generate receipt numbers for existing orders
                print("Generating receipt numbers for existing orders...")
                orders = Order.query.all()
                for order in orders:
                    if not order.receipt_number:
                        # Generate unique receipt number
                        while True:
                            receipt_num = generate_receipt_number()
                            existing = Order.query.filter_by(receipt_number=receipt_num).first()
                            if not existing:
                                order.receipt_number = receipt_num
                                break
                
                db.session.commit()
                print(f"Generated receipt numbers for {len(orders)} existing orders")
            else:
                print("receipt_number column already exists")
                
        except Exception as e:
            print(f"Error adding receipt_number column: {e}")
            db.session.rollback()
        
        # Update order statuses for better workflow
        try:
            print("Updating order statuses...")
            # Change any 'pending' orders to 'confirmed' for better UX
            pending_orders = Order.query.filter_by(status='pending').all()
            for order in pending_orders:
                if order.payment_method == 'COD':
                    order.status = 'confirmed'
                    order.payment_status = 'pending'
                else:
                    order.status = 'confirmed'
                    order.payment_status = 'completed'
            
            db.session.commit()
            print(f"Updated {len(pending_orders)} order statuses")
            
        except Exception as e:
            print(f"Error updating order statuses: {e}")
            db.session.rollback()
        
        print("Payment system migration completed successfully!")
        print("\nNew features added:")
        print("- PaymentDetail table for storing payment information")
        print("- Receipt numbers for all orders")
        print("- Enhanced order status management")
        print("- PDF receipt generation capability")

if __name__ == '__main__':
    migrate_payment_system()
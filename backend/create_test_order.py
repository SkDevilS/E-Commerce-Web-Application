#!/usr/bin/env python3
"""
Script to create a test order for testing the admin panel
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User, Order, OrderItem, Product, Address, PaymentDetail
import random
import string
from datetime import datetime

def generate_order_number():
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f'ORD-{timestamp}-{random_str}'

def generate_receipt_number():
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f'RCP{random_str}'

def create_test_order():
    """Create a test order for admin panel testing"""
    app = create_app()
    
    with app.app_context():
        print("Creating test order...")
        
        # Get or create a test customer
        customer = User.query.filter_by(email='truaxis@gmail.com').first()
        if not customer:
            customer = User(
                name='Test Customer',
                email='truaxis@gmail.com',
                role='customer',
                phone='1234567890',
                is_active=True
            )
            customer.set_password('Truaxis@123')
            db.session.add(customer)
            db.session.flush()
            print("Created test customer")
        
        # Create a test address if none exists
        address = Address.query.filter_by(user_id=customer.id).first()
        if not address:
            address = Address(
                user_id=customer.id,
                full_name='Test Customer',
                phone='1234567890',
                address_line1='123 Test Street',
                address_line2='Apt 4B',
                city='Test City',
                state='Test State',
                pincode='123456',
                is_default=True
            )
            db.session.add(address)
            db.session.flush()
            print("Created test address")
        
        # Get a test product
        product = Product.query.first()
        if not product:
            print("No products found. Please run init_db.py first.")
            return
        
        # Create test order
        order = Order(
            order_number=generate_order_number(),
            receipt_number=generate_receipt_number(),
            user_id=customer.id,
            address_id=address.id,
            total_amount=299.99,
            payment_method='card',
            payment_status='completed',
            status='confirmed'
        )
        db.session.add(order)
        db.session.flush()
        
        # Create order item
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=2,
            price=product.price,
            size='Medium',
            color='Blue'
        )
        db.session.add(order_item)
        
        # Create payment details
        payment_detail = PaymentDetail(
            order_id=order.id,
            payment_method='card',
            card_number_last4='1234',
            card_holder_name='Test Customer',
            card_expiry_month='12',
            card_expiry_year='2025'
        )
        db.session.add(payment_detail)
        
        db.session.commit()
        
        print(f"Test order created successfully!")
        print(f"Order Number: {order.order_number}")
        print(f"Receipt Number: {order.receipt_number}")
        print(f"Customer: {customer.name} ({customer.email})")
        print(f"Total: ₹{order.total_amount}")
        print(f"Status: {order.status}")
        print(f"Payment: {order.payment_method}")

if __name__ == '__main__':
    create_test_order()
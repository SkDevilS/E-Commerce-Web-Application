from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderItem, CartItem, Address, Product, PaymentDetail
from datetime import datetime
import random
import string
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
import io
import os

orders_bp = Blueprint('orders', __name__)

def generate_order_number():
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f'ORD-{timestamp}-{random_str}'

def generate_receipt_number():
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f'RCP{random_str}'

@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [order.to_dict() for order in orders]}), 200

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    return jsonify({'order': order.to_dict()}), 200

@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('address_id'):
        return jsonify({'error': 'Address ID required'}), 400
    
    # Verify address belongs to user
    address = Address.query.filter_by(id=data['address_id'], user_id=user_id).first()
    if not address:
        return jsonify({'error': 'Address not found'}), 404
    
    # Get cart items
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
    
    # Calculate total
    total_amount = 0
    order_items_data = []
    
    for cart_item in cart_items:
        product = cart_item.product
        if not product or not product.is_active:
            continue
        
        if product.stock < cart_item.quantity:
            return jsonify({'error': f'Insufficient stock for {product.title}'}), 400
        
        item_total = product.price * cart_item.quantity
        total_amount += item_total
        
        order_items_data.append({
            'product': product,
            'quantity': cart_item.quantity,
            'price': product.price,
            'size': cart_item.size,
            'color': cart_item.color
        })
    
    # Create order
    order = Order(
        order_number=generate_order_number(),
        receipt_number=generate_receipt_number(),
        user_id=user_id,
        address_id=data['address_id'],
        total_amount=total_amount,
        payment_method=data.get('payment_method', 'COD'),
        payment_status='pending' if data.get('payment_method') == 'COD' else 'completed',
        status='confirmed'
    )
    
    db.session.add(order)
    db.session.flush()
    
    # Create payment details if not COD
    if data.get('payment_method') in ['card', 'upi']:
        payment_data = data.get('payment_details', {})
        
        payment_detail = PaymentDetail(
            order_id=order.id,
            payment_method=data.get('payment_method')
        )
        
        if data.get('payment_method') == 'card':
            card_number = payment_data.get('card_number', '')
            payment_detail.card_number_last4 = card_number[-4:] if len(card_number) >= 4 else ''
            payment_detail.card_holder_name = payment_data.get('card_holder_name')
            payment_detail.card_expiry_month = payment_data.get('expiry_month')
            payment_detail.card_expiry_year = payment_data.get('expiry_year')
        elif data.get('payment_method') == 'upi':
            payment_detail.upi_id = payment_data.get('upi_id')
            payment_detail.upi_name = payment_data.get('upi_name')
        
        db.session.add(payment_detail)
    
    # Create order items and update stock
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data['product'].id,
            quantity=item_data['quantity'],
            price=item_data['price'],
            size=item_data['size'],
            color=item_data['color']
        )
        db.session.add(order_item)
        
        # Update product stock
        item_data['product'].stock -= item_data['quantity']
    
    # Clear cart
    CartItem.query.filter_by(user_id=user_id).delete()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Order placed successfully',
        'order': order.to_dict()
    }), 201

@orders_bp.route('/<int:order_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    if order.status not in ['pending', 'confirmed']:
        return jsonify({'error': 'Order cannot be cancelled'}), 400
    
    # Restore stock
    for item in order.order_items:
        if item.product:
            item.product.stock += item.quantity
    
    order.status = 'cancelled'
    db.session.commit()
    
    return jsonify({'message': 'Order cancelled successfully', 'order': order.to_dict()}), 200

def generate_receipt_pdf(order):
    """Generate PDF receipt for an order"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=letter,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )
    styles = getSampleStyleSheet()
    story = []
    
    # Custom styles - more compact
    company_style = ParagraphStyle(
        'CompanyStyle',
        parent=styles['Heading1'],
        fontSize=22,
        spaceAfter=3,
        alignment=1,  # Center alignment
        textColor=colors.HexColor('#1f2937'),
        fontName='Helvetica-Bold'
    )
    
    tagline_style = ParagraphStyle(
        'TaglineStyle',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=12,
        alignment=1,  # Center alignment
        textColor=colors.HexColor('#6b7280'),
        fontName='Helvetica-Oblique'
    )
    
    receipt_title_style = ParagraphStyle(
        'ReceiptTitle',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=15,
        alignment=1,  # Center alignment
        textColor=colors.HexColor('#2563eb'),
        fontName='Helvetica-Bold'
    )
    
    section_header_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading3'],
        fontSize=12,
        spaceAfter=6,
        spaceBefore=8,
        textColor=colors.HexColor('#1f2937'),
        fontName='Helvetica-Bold',
        backColor=colors.HexColor('#f9fafb')
    )
    
    # Header with logo and company info
    try:
        # Try to add logo - smaller size
        logo_path = os.path.join('public', 'truaxis_logo.png')
        if os.path.exists(logo_path):
            logo = Image(logo_path, width=1.5*inch, height=0.6*inch)
            logo.hAlign = 'CENTER'
            story.append(logo)
            story.append(Spacer(1, 5))
    except:
        # If logo fails, just use text
        pass
    
    # Company name and tagline
    story.append(Paragraph("TruAxis Ventures", company_style))
    story.append(Paragraph("Your Trusted E-commerce Partner", tagline_style))
    
    # Add a horizontal line
    line = Table([['', '']], colWidths=[5*inch, 0])
    line.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 2, colors.HexColor('#2563eb')),
    ]))
    story.append(line)
    story.append(Spacer(1, 10))
    
    # Receipt title
    story.append(Paragraph("PAYMENT RECEIPT", receipt_title_style))
    
    # Create a two-column layout for receipt details and customer info
    left_data = [
        ['Receipt No:', order.receipt_number],
        ['Order No:', order.order_number],
        ['Date:', order.created_at.strftime('%d %b %Y, %I:%M %p')],
        ['Payment:', order.payment_method.upper()],
        ['Status:', order.payment_status.title()],
    ]
    
    right_data = [
        ['Customer:', order.user.name],
        ['Email:', order.user.email],
        ['Phone:', order.user.phone or 'N/A'],
        ['', ''],
        ['', ''],
    ]
    
    # Combine left and right data
    combined_data = []
    for i in range(len(left_data)):
        combined_data.append([
            left_data[i][0], left_data[i][1],
            right_data[i][0], right_data[i][1]
        ])
    
    info_table = Table(combined_data, colWidths=[1.2*inch, 1.8*inch, 1*inch, 2*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 12))
    
    # Shipping address - more compact
    story.append(Paragraph("SHIPPING ADDRESS", section_header_style))
    address = order.address
    address_lines = [
        address.full_name,
        address.address_line1,
    ]
    if address.address_line2:
        address_lines.append(address.address_line2)
    address_lines.extend([
        f"{address.city}, {address.state} - {address.pincode}",
        f"Phone: {address.phone}"
    ])
    
    address_text = "<br/>".join(address_lines)
    address_para = Paragraph(address_text, styles['Normal'])
    
    # Create a compact box around the address
    address_table = Table([[address_para]], colWidths=[6*inch])
    address_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(address_table)
    story.append(Spacer(1, 12))
    
    # Payment details section (if available) - more compact
    if order.payment_details:
        story.append(Paragraph("PAYMENT DETAILS", section_header_style))
        payment = order.payment_details
        if payment.payment_method == 'card':
            payment_info = f"Card: **** **** **** {payment.card_number_last4} | {payment.card_holder_name}"
        elif payment.payment_method == 'upi':
            payment_info = f"UPI: {payment.upi_id} | {payment.upi_name}"
        else:
            payment_info = "Cash on Delivery"
        
        payment_para = Paragraph(payment_info, styles['Normal'])
        payment_table = Table([[payment_para]], colWidths=[6*inch])
        payment_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(payment_table)
        story.append(Spacer(1, 12))
    
    # Order items section - more compact
    story.append(Paragraph("ORDER SUMMARY", section_header_style))
    
    # Items table header with better styling
    items_data = [['ITEM DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL']]
    
    # Items data
    subtotal = 0
    for item in order.order_items:
        item_name = item.product.title
        item_details = []
        if item.size:
            item_details.append(f"Size: {item.size}")
        if item.color:
            item_details.append(f"Color: {item.color}")
        
        if item_details:
            item_name += f" ({', '.join(item_details)})"
        
        item_total = item.price * item.quantity
        subtotal += item_total
        
        items_data.append([
            item_name,
            str(item.quantity),
            f"Rs.{item.price:.2f}",
            f"Rs.{item_total:.2f}"
        ])
    
    # Add subtotal and total rows
    items_data.append(['', '', 'Subtotal:', f"Rs.{subtotal:.2f}"])
    items_data.append(['', '', 'Tax & Fees:', 'Rs.0.00'])
    items_data.append(['', '', 'TOTAL AMOUNT:', f"Rs.{order.total_amount:.2f}"])
    
    items_table = Table(items_data, colWidths=[3.5*inch, 0.6*inch, 1*inch, 0.9*inch])
    items_table.setStyle(TableStyle([
        # Header row styling
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        
        # Data rows styling
        ('ALIGN', (0, 1), (0, -4), 'LEFT'),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 1), (-1, -4), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -4), 8),
        ('TOPPADDING', (0, 0), (-1, -4), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -4), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        
        # Subtotal and total rows
        ('FONTNAME', (2, -3), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (2, -3), (-1, -1), 9),
        ('BACKGROUND', (2, -1), (-1, -1), colors.HexColor('#f3f4f6')),
        
        # Grid lines
        ('GRID', (0, 0), (-1, -4), 1, colors.HexColor('#e5e7eb')),
        ('LINEABOVE', (2, -3), (-1, -3), 1, colors.HexColor('#d1d5db')),
        ('LINEABOVE', (2, -1), (-1, -1), 2, colors.HexColor('#2563eb')),
        
        # Alternating row colors for better readability
        ('ROWBACKGROUNDS', (0, 1), (-1, -4), [colors.white, colors.HexColor('#f9fafb')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    story.append(items_table)
    story.append(Spacer(1, 15))
    
    # Compact footer
    footer_style = ParagraphStyle(
        'FooterStyle',
        parent=styles['Normal'],
        fontSize=9,
        alignment=1,  # Center alignment
        textColor=colors.HexColor('#6b7280'),
        spaceAfter=5
    )
    
    # Thank you message
    story.append(Paragraph("Thank you for choosing TruAxis Ventures!", footer_style))
    
    # Contact information - more compact
    contact_info = """
    <b>Contact:</b> support@truaxisventures.com | +91-XXXXXXXXXX | www.truaxisventures.com<br/>
    <i>This is a computer-generated receipt and does not require a signature.</i>
    """
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontSize=8,
        alignment=1,  # Center alignment
        textColor=colors.HexColor('#6b7280'),
        leading=10
    )
    
    story.append(Paragraph(contact_info, contact_style))
    
    # Build the PDF
    doc.build(story)
    buffer.seek(0)
    return buffer

@orders_bp.route('/<int:order_id>/receipt', methods=['GET'])
@jwt_required()
def download_receipt(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
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
#!/usr/bin/env python3
"""
Test script to verify upload functionality
"""
import os
import sys
import requests

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_upload():
    # Test if the server is running
    try:
        response = requests.get('http://localhost:5000/api/health')
        print(f"Server health check: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Server not running: {e}")
        return
    
    # Check upload folder
    upload_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    print(f"Upload folder: {upload_folder}")
    print(f"Upload folder exists: {os.path.exists(upload_folder)}")
    
    if os.path.exists(upload_folder):
        print(f"Upload folder contents: {os.listdir(upload_folder)}")
        
        products_folder = os.path.join(upload_folder, 'products')
        if os.path.exists(products_folder):
            print(f"Products folder contents: {os.listdir(products_folder)}")

if __name__ == '__main__':
    test_upload()
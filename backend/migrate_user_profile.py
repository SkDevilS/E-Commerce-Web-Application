"""
Migration script to add phone, date_of_birth, and gender columns to users table
Run this script to update existing database
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db

def migrate_user_profile():
    app = create_app()
    
    with app.app_context():
        try:
            # Add new columns to users table
            with db.engine.connect() as conn:
                # Check if columns exist before adding
                result = conn.execute(db.text("""
                    SELECT COLUMN_NAME 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = 'truaxis_db' 
                    AND TABLE_NAME = 'users' 
                    AND COLUMN_NAME IN ('phone', 'date_of_birth', 'gender')
                """))
                
                existing_columns = [row[0] for row in result]
                
                # Add phone column if it doesn't exist
                if 'phone' not in existing_columns:
                    conn.execute(db.text("""
                        ALTER TABLE users 
                        ADD COLUMN phone VARCHAR(20) NULL
                    """))
                    conn.commit()
                    print("✅ Added 'phone' column to users table")
                else:
                    print("ℹ️  'phone' column already exists")
                
                # Add date_of_birth column if it doesn't exist
                if 'date_of_birth' not in existing_columns:
                    conn.execute(db.text("""
                        ALTER TABLE users 
                        ADD COLUMN date_of_birth VARCHAR(50) NULL
                    """))
                    conn.commit()
                    print("✅ Added 'date_of_birth' column to users table")
                else:
                    print("ℹ️  'date_of_birth' column already exists")
                
                # Add gender column if it doesn't exist
                if 'gender' not in existing_columns:
                    conn.execute(db.text("""
                        ALTER TABLE users 
                        ADD COLUMN gender VARCHAR(20) NULL
                    """))
                    conn.commit()
                    print("✅ Added 'gender' column to users table")
                else:
                    print("ℹ️  'gender' column already exists")
            
            print("\n✅ Migration completed successfully!")
            print("Users table now has phone, date_of_birth, and gender columns")
            
        except Exception as e:
            print(f"\n❌ Migration failed: {str(e)}")
            raise

if __name__ == '__main__':
    print("Starting user profile migration...")
    print("=" * 50)
    migrate_user_profile()
    print("=" * 50)


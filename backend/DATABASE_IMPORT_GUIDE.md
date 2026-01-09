# Database Import Guide

Quick guide for manually importing your database to the VPS.

## Method 1: Using init_db.py (Recommended for Fresh Setup)

This creates a new database with tables and sample data:

```bash
# On VPS
cd /var/www/truaxis/backend
source venv/bin/activate
python init_db.py
```

This will:
- Create all database tables
- Create admin user
- Create default sections
- Load sample products (if available)

## Method 2: Import Your Own SQL Dump

If you have an existing database dump:

### Step 1: Export from Local Machine

```bash
# On your local machine
mysqldump -u root -p truaxis_db > truaxis_db_dump.sql

# Compress for faster transfer
gzip truaxis_db_dump.sql
```

### Step 2: Transfer to VPS

```bash
# From your local machine
scp truaxis_db_dump.sql.gz truaxis@YOUR_VPS_IP:~/
```

### Step 3: Import on VPS

```bash
# SSH to VPS
ssh truaxis@YOUR_VPS_IP

# Decompress (if compressed)
gunzip truaxis_db_dump.sql.gz

# Import to database
mysql -u truaxis_user -p truaxis_db < truaxis_db_dump.sql

# Verify import
mysql -u truaxis_user -p truaxis_db -e "SHOW TABLES;"
mysql -u truaxis_user -p truaxis_db -e "SELECT COUNT(*) FROM products;"
```

## Method 3: Direct MySQL Connection

If you prefer to use MySQL Workbench or similar tools:

1. **Enable Remote MySQL Access** (if needed):
   ```bash
   # Edit MySQL config
   sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
   
   # Comment out or change bind-address
   # bind-address = 127.0.0.1
   bind-address = 0.0.0.0
   
   # Restart MySQL
   sudo systemctl restart mysql
   
   # Grant remote access
   mysql -u root -p
   ```
   
   ```sql
   GRANT ALL PRIVILEGES ON truaxis_db.* TO 'truaxis_user'@'%' IDENTIFIED BY 'password';
   FLUSH PRIVILEGES;
   EXIT;
   ```
   
   ```bash
   # Allow MySQL through firewall
   sudo ufw allow 3306/tcp
   ```

2. **Connect from MySQL Workbench**:
   - Host: YOUR_VPS_IP
   - Port: 3306
   - Username: truaxis_user
   - Password: your_password
   - Database: truaxis_db

3. **Import your SQL file** through the GUI

4. **Secure MySQL again** after import:
   ```bash
   # Revert bind-address to localhost
   sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
   # bind-address = 127.0.0.1
   
   sudo systemctl restart mysql
   sudo ufw delete allow 3306/tcp
   ```

## Verify Database

After importing, verify everything is working:

```bash
# Check tables
mysql -u truaxis_user -p truaxis_db -e "SHOW TABLES;"

# Check record counts
mysql -u truaxis_user -p truaxis_db << 'EOF'
SELECT 'users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'sections', COUNT(*) FROM sections;
EOF

# Test backend connection
cd /var/www/truaxis/backend
source venv/bin/activate
python -c "from app import app, db; app.app_context().push(); print('Database connection successful')"
```

## Troubleshooting

### "Access denied" error
```bash
# Check user exists and has permissions
mysql -u root -p -e "SELECT user, host FROM mysql.user WHERE user='truaxis_user';"
mysql -u root -p -e "SHOW GRANTS FOR 'truaxis_user'@'localhost';"
```

### "Unknown database" error
```bash
# Create database if it doesn't exist
mysql -u root -p -e "CREATE DATABASE truaxis_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Import fails with foreign key errors
```bash
# Disable foreign key checks during import
mysql -u truaxis_user -p truaxis_db << 'EOF'
SET FOREIGN_KEY_CHECKS=0;
SOURCE truaxis_db_dump.sql;
SET FOREIGN_KEY_CHECKS=1;
EOF
```

## Backup Your Database

Always backup before making changes:

```bash
# Create backup
mysqldump -u truaxis_user -p truaxis_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip backup_*.sql

# Download to local machine (from your computer)
scp truaxis@YOUR_VPS_IP:~/backup_*.sql.gz ./
```

## Quick Commands

```bash
# Export database
mysqldump -u truaxis_user -p truaxis_db > dump.sql

# Import database
mysql -u truaxis_user -p truaxis_db < dump.sql

# Show all tables
mysql -u truaxis_user -p truaxis_db -e "SHOW TABLES;"

# Count records
mysql -u truaxis_user -p truaxis_db -e "SELECT COUNT(*) FROM products;"

# Backup database
mysqldump -u truaxis_user -p truaxis_db | gzip > backup.sql.gz

# Restore from backup
gunzip < backup.sql.gz | mysql -u truaxis_user -p truaxis_db
```

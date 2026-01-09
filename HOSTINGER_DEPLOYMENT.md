# TruAxisVentures - Hostinger VPS Deployment Guide

Complete A-Z guide to deploy TruAxisVentures on Hostinger VPS with Ubuntu 24.04 LTS.

## Quick Overview

This guide will help you deploy:
- **Main Website**: https://truaxis.com
- **Admin Portal**: https://admin.truaxis.com  
- **Backend API**: Running on same VPS, proxied through Nginx

**Platform**: Ubuntu 24.04 LTS (Noble Numbat)
**Estimated Time**: 2-3 hours

---

## Prerequisites

✅ Hostinger VPS with Ubuntu 24.04 LTS
✅ Domain `truaxis.com` purchased from Hostinger
✅ Root/SSH access to VPS
✅ Your application code ready

---

## Part 1: VPS Initial Setup (30 minutes)

### Step 1: Connect to VPS

```bash
# Get VPS IP from Hostinger panel
# Connect via SSH
ssh root@YOUR_VPS_IP
```

### Step 2: Update System

```bash
# Update package lists and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Install essential build tools and utilities
sudo apt install -y curl wget git vim ufw software-properties-common \
    build-essential libssl-dev libffi-dev pkg-config

# Ubuntu 24.04 specific: Install additional dependencies
sudo apt install -y python3-setuptools python3-wheel
```

### Step 3: Create Application User

```bash
adduser truaxis
usermod -aG sudo truaxis
su - truaxis
```

### Step 4: Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Part 2: Install Software (30 minutes)

### Step 5: Install Python 3.12

Ubuntu 24.04 LTS comes with Python 3.12 by default:

```bash
# Python 3.12 is pre-installed on Ubuntu 24.04
python3 --version  # Should show Python 3.12.x

# Install pip and venv
sudo apt install -y python3-pip python3-venv python3-dev

# Verify installation
pip3 --version
```

### Step 6: Install Node.js 20 LTS

```bash
# Install Node.js 20 LTS (recommended for Ubuntu 24.04)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Step 7: Install Nginx

```bash
# Install Nginx (Ubuntu 24.04 comes with Nginx 1.24+)
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx

# Verify Nginx version
nginx -v  # Should show nginx/1.24.x or higher
```

### Step 8: Install MySQL Server

```bash
# Install MySQL Server 8.0
sudo apt install -y mysql-server

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Check MySQL status
sudo systemctl status mysql

# Verify MySQL version
mysql --version  # Should show MySQL 8.0.x
```

### Ubuntu 24.04 LTS Advantages

✅ **Python 3.12**: Latest stable Python with performance improvements
✅ **MySQL 8.0**: Latest stable MySQL with better performance
✅ **Nginx 1.24+**: Enhanced HTTP/2 and security features
✅ **5-Year Support**: LTS support until April 2029
✅ **Better Security**: AppArmor 4.0, improved kernel security
✅ **Modern Packages**: Latest stable versions of all software

---

## Part 3: Setup MySQL Database (20 minutes)

### Step 9: Secure MySQL Installation

```bash
# Run MySQL secure installation
sudo mysql_secure_installation
```

**Answer the prompts:**
- Set root password: **YES** (choose a strong password)
- Remove anonymous users: **YES**
- Disallow root login remotely: **YES**
- Remove test database: **YES**
- Reload privilege tables: **YES**

### Step 10: Create Database and User

```bash
# Login to MySQL as root
sudo mysql -u root -p

# Enter the root password you just set
```

**In MySQL prompt, run these commands:**

```sql
-- Create database
CREATE DATABASE truaxis_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with password
CREATE USER 'truaxis_user'@'localhost' IDENTIFIED BY 'YOUR_SECURE_PASSWORD';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON truaxis_db.* TO 'truaxis_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Verify database creation
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

**Important**: Replace `YOUR_SECURE_PASSWORD` with a strong password!

### Step 11: Test Database Connection

```bash
# Test connection with new user
mysql -u truaxis_user -p truaxis_db

# If successful, you'll see MySQL prompt
# Type EXIT; to exit
```

### Step 12: Configure MySQL for Production

```bash
# Edit MySQL configuration
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

**Add/update these settings:**

```ini
[mysqld]
# Performance settings
max_connections = 200
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Logging (optional, for debugging)
# general_log = 1
# general_log_file = /var/log/mysql/general.log
# slow_query_log = 1
# slow_query_log_file = /var/log/mysql/slow.log
# long_query_time = 2
```

**Restart MySQL:**
```bash
sudo systemctl restart mysql
```

---

## Part 4: Deploy Application (30 minutes)

### Step 13: Create Directory & Upload Code

```bash
sudo mkdir -p /var/www/truaxis
sudo chown -R truaxis:truaxis /var/www/truaxis
cd /var/www/truaxis

# Option A: Clone from Git
git clone YOUR_REPO_URL .

# Option B: Upload via SCP from local machine
# scp -r /path/to/local/truaxis/* truaxis@YOUR_VPS_IP:/var/www/truaxis/
```

### Step 14: Setup Backend

```bash
cd /var/www/truaxis/backend

# Create virtual environment with Python 3.12
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip to latest version
pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt

# Install additional production dependencies
pip install gunicorn pymysql cryptography

# Verify installations
gunicorn --version
python -c "import pymysql; print('PyMySQL installed successfully')"
```

### Step 15: Configure Environment

```bash
cp .env.example .env
nano .env
```

Update these values:
```env
FLASK_ENV=production
FLASK_DEBUG=False

# Generate new keys
SECRET_KEY=YOUR_NEW_SECRET_KEY
JWT_SECRET_KEY=YOUR_NEW_JWT_KEY

# Database - Local MySQL on VPS
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=truaxis_db
DB_USER=truaxis_user
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_CHARSET=utf8mb4

# Domains
MAIN_URL=https://truaxis.com
ADMIN_URL=https://admin.truaxis.com
API_URL=https://api.truaxis.com
CORS_ORIGINS=https://truaxis.com,https://admin.truaxis.com
```

Generate keys:
```bash
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
```

### Step 16: Initialize Database

```bash
# Make sure you're in the backend directory with venv activated
cd /var/www/truaxis/backend
source venv/bin/activate

# Initialize database tables and create admin user
python init_db.py

# The script will:
# - Create all database tables
# - Create admin user (from .env or default)
# - Create default sections
# - Load sample products (if available)
```

**Output should show:**
```
============================================================
TruAxisVentures Database Initialization
============================================================

[1/4] Creating database tables...
✓ All tables created successfully

[2/4] Creating admin user...
✓ Admin user created: admin@truaxis.com

[3/4] Creating default sections...
✓ 3 sections created

[4/4] Loading sample products...
✓ 50 sample products loaded

============================================================
Database Initialization Complete!
============================================================
Total Users: 1
Total Sections: 3
Total Products: 50

------------------------------------------------------------
Admin Credentials:
  Email: admin@truaxis.com
  Password: Admin@123
------------------------------------------------------------

IMPORTANT: Change the admin password after first login!
============================================================
```

**Note**: If you have your own database with data, you can manually import it using:
```bash
# Import your SQL dump
mysql -u truaxis_user -p truaxis_db < your_database_dump.sql

# Verify tables
mysql -u truaxis_user -p truaxis_db -e "SHOW TABLES;"
```

**For detailed database import instructions, see**: `backend/DATABASE_IMPORT_GUIDE.md`

### Step 17: Build Frontend

```bash
cd /var/www/truaxis

# Update API URL in configuration
nano src/utils/api.js
# Change API_BASE_URL to: const API_BASE_URL = 'https://api.truaxis.com';

nano src/config/admin.config.js
# Update admin domain check if needed

# Install Node.js dependencies
npm install

# Build production bundle
npm run build

# Create frontend directory and copy build files
sudo mkdir -p /var/www/truaxis/frontend
sudo cp -r dist/* /var/www/truaxis/frontend/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/truaxis/frontend
sudo chmod -R 755 /var/www/truaxis/frontend

# Verify build
ls -la /var/www/truaxis/frontend
```

---

## Part 5: Configure Nginx (20 minutes)

### Step 18: Create Nginx Configs

**Main Website:**
```bash
sudo nano /etc/nginx/sites-available/truaxis.com
```

```nginx
server {
    listen 80;
    server_name truaxis.com www.truaxis.com;
    root /var/www/truaxis/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Admin Portal:**
```bash
sudo nano /etc/nginx/sites-available/admin.truaxis.com
```

```nginx
server {
    listen 80;
    server_name admin.truaxis.com;
    root /var/www/truaxis/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**API:**
```bash
sudo nano /etc/nginx/sites-available/api.truaxis.com
```

```nginx
server {
    listen 80;
    server_name api.truaxis.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    client_max_body_size 20M;
}
```

### Step 19: Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/truaxis.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.truaxis.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.truaxis.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Part 6: Setup Process Manager (15 minutes)

### Step 20: Create Systemd Service

```bash
sudo nano /etc/systemd/system/truaxis-backend.service
```

```ini
[Unit]
Description=TruAxis Backend API Service
After=network.target

[Service]
Type=notify
User=truaxis
Group=www-data
WorkingDirectory=/var/www/truaxis/backend
Environment="PATH=/var/www/truaxis/backend/venv/bin"
Environment="PYTHONUNBUFFERED=1"

# Gunicorn configuration for production
ExecStart=/var/www/truaxis/backend/venv/bin/gunicorn \
    --workers 4 \
    --worker-class sync \
    --bind 127.0.0.1:5000 \
    --timeout 120 \
    --access-logfile /var/log/truaxis/access.log \
    --error-logfile /var/log/truaxis/error.log \
    --log-level info \
    app:app

# Restart policy
Restart=always
RestartSec=10
KillMode=mixed
TimeoutStopSec=30

# Security settings
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

**Create log directory:**
```bash
sudo mkdir -p /var/log/truaxis
sudo chown truaxis:www-data /var/log/truaxis
sudo chmod 755 /var/log/truaxis
```

### Step 21: Start Service

```bash
# Reload systemd to recognize new service
sudo systemctl daemon-reload

# Start the backend service
sudo systemctl start truaxis-backend

# Enable service to start on boot
sudo systemctl enable truaxis-backend

# Check service status
sudo systemctl status truaxis-backend

# If there are any errors, check logs
sudo journalctl -u truaxis-backend -n 50 --no-pager

# Test if backend is responding
curl http://localhost:5000/api/products
```

---

## Part 7: SSL & Domain Setup (20 minutes)

### Step 22: Install SSL Certificate

```bash
# Install Certbot for Ubuntu 24.04
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificates for all domains
sudo certbot --nginx \
    -d truaxis.com \
    -d www.truaxis.com \
    -d admin.truaxis.com \
    -d api.truaxis.com \
    --non-interactive \
    --agree-tos \
    --email your-email@example.com \
    --redirect

# Verify SSL certificate auto-renewal
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates
```

**Note**: Replace `your-email@example.com` with your actual email address.

Certbot will:
- Automatically configure SSL for all domains
- Set up HTTP to HTTPS redirect
- Configure auto-renewal (certificates renew every 90 days)

### Step 23: Configure DNS in Hostinger

1. Login to Hostinger
2. Go to Domains → truaxis.com → DNS/Name Servers
3. Add these A records:

| Type | Name | Points to | TTL |
|------|------|-----------|-----|
| A | @ | YOUR_VPS_IP | 14400 |
| A | www | YOUR_VPS_IP | 14400 |
| A | admin | YOUR_VPS_IP | 14400 |
| A | api | YOUR_VPS_IP | 14400 |

4. Wait 1-4 hours for DNS propagation

### Step 24: Verify DNS

```bash
nslookup truaxis.com
nslookup admin.truaxis.com
nslookup api.truaxis.com
```

---

## Part 8: Final Testing (10 minutes)

### Step 25: Test Everything

```bash
# Test backend
curl https://api.truaxis.com/api/products

# Test main site
curl -I https://truaxis.com

# Test admin
curl -I https://admin.truaxis.com
```

### Step 26: Browser Testing

Open in browser:
1. https://truaxis.com - Should show main website
2. https://admin.truaxis.com - Should show admin login
3. Try logging in with admin credentials
4. Test creating a product
5. Test placing an order

---

## Maintenance Commands

### View Logs
```bash
# Backend application logs
sudo journalctl -u truaxis-backend -f

# Backend access logs
sudo tail -f /var/log/truaxis/access.log

# Backend error logs
sudo tail -f /var/log/truaxis/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View last 100 lines of backend logs
sudo journalctl -u truaxis-backend -n 100 --no-pager
```

### Restart Services
```bash
# Restart backend
sudo systemctl restart truaxis-backend

# Reload Nginx (without dropping connections)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check service status
sudo systemctl status truaxis-backend
sudo systemctl status nginx
```

### Update Application
```bash
# Navigate to application directory
cd /var/www/truaxis

# Pull latest code from Git
git pull

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Update frontend
npm install
npm run build
sudo cp -r dist/* /var/www/truaxis/frontend/

# Restart backend service
sudo systemctl restart truaxis-backend

# Reload Nginx
sudo systemctl reload nginx
```

### Database Backup
```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
mysqldump -u truaxis_user -p truaxis_db > ~/backups/truaxis_db_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip ~/backups/truaxis_db_*.sql

# Download backup to local machine (run from your computer)
# scp truaxis@YOUR_VPS_IP:~/backups/truaxis_db_*.sql.gz ./

# Restore from backup
gunzip < ~/backups/truaxis_db_YYYYMMDD_HHMMSS.sql.gz | mysql -u truaxis_user -p truaxis_db
```

### Monitor System Resources
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check running processes
ps aux | grep truaxis

# Check open ports
sudo netstat -tulpn | grep LISTEN
```

---

## Troubleshooting

### Ubuntu 24.04 Specific Issues

**Python version conflicts:**
```bash
# Verify Python version
python3 --version  # Should be 3.12.x

# If you have multiple Python versions
sudo update-alternatives --config python3
```

**Pip externally-managed-environment error:**
```bash
# Ubuntu 24.04 uses PEP 668, always use venv
# Never use: sudo pip install
# Always use virtual environment as shown in Step 11
```

**Systemd service Type=notify:**
```bash
# If service fails to start with Type=notify
# Edit service file and change to Type=simple
sudo nano /etc/systemd/system/truaxis-backend.service
# Change: Type=notify to Type=simple
sudo systemctl daemon-reload
sudo systemctl restart truaxis-backend
```

### General Issues

**Backend not starting:**
```bash
# Check detailed logs
sudo journalctl -u truaxis-backend -n 100 --no-pager

# Test backend manually
cd /var/www/truaxis/backend
source venv/bin/activate
python app.py  # Should show any errors

# Check if port 5000 is in use
sudo netstat -tulpn | grep 5000
```

**Database errors:**
```bash
# Test MySQL connection
mysql -u truaxis_user -p truaxis_db

# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log

# Restart MySQL
sudo systemctl restart mysql

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check user permissions
mysql -u root -p -e "SHOW GRANTS FOR 'truaxis_user'@'localhost';"
```

**Nginx errors:**
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check if Nginx is running
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx
```

**SSL certificate issues:**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Check Nginx SSL configuration
sudo nano /etc/nginx/sites-available/truaxis.com
```

**Permission errors:**
```bash
# Fix frontend permissions
sudo chown -R www-data:www-data /var/www/truaxis/frontend
sudo chmod -R 755 /var/www/truaxis/frontend

# Fix backend permissions
sudo chown -R truaxis:www-data /var/www/truaxis/backend
sudo chmod -R 755 /var/www/truaxis/backend

# Fix upload directory permissions
sudo mkdir -p /var/www/truaxis/backend/uploads
sudo chown -R truaxis:www-data /var/www/truaxis/backend/uploads
sudo chmod -R 775 /var/www/truaxis/backend/uploads
```

**DNS not resolving:**
```bash
# Check DNS propagation
nslookup truaxis.com
nslookup admin.truaxis.com
nslookup api.truaxis.com

# Use online tools
# https://dnschecker.org

# Clear local DNS cache (on your computer)
# Windows: ipconfig /flushdns
# Mac: sudo dscacheutil -flushcache
# Linux: sudo systemd-resolve --flush-caches
```

**502 Bad Gateway:**
```bash
# Backend is not running or not accessible
sudo systemctl status truaxis-backend
sudo systemctl restart truaxis-backend

# Check if backend is listening on port 5000
curl http://localhost:5000/api/products

# Check Nginx proxy configuration
sudo nano /etc/nginx/sites-available/api.truaxis.com
```

---

## Success Checklist

- [ ] VPS setup complete with Ubuntu 24.04 LTS
- [ ] Python 3.12 installed and verified
- [ ] Node.js 20 LTS installed and verified
- [ ] Nginx installed and running
- [ ] Hostinger managed database created and accessible
- [ ] Database connection tested from VPS
- [ ] Application code uploaded to VPS
- [ ] Backend virtual environment created
- [ ] Python dependencies installed
- [ ] Environment variables configured (.env)
- [ ] Database initialized with tables
- [ ] Admin user created
- [ ] Frontend built successfully
- [ ] Frontend files copied to /var/www/truaxis/frontend
- [ ] Nginx configurations created for all domains
- [ ] Nginx configurations enabled
- [ ] Systemd service created and running
- [ ] Backend accessible on localhost:5000
- [ ] SSL certificates installed for all domains
- [ ] DNS A records configured in Hostinger
- [ ] DNS propagation complete (check with nslookup)
- [ ] All URLs working (truaxis.com, admin.truaxis.com, api.truaxis.com)
- [ ] HTTPS redirect working
- [ ] Admin login working
- [ ] Can create products in admin panel
- [ ] Can place orders on main website
- [ ] File uploads working
- [ ] Receipt PDF generation working

---

## 🎉 Congratulations!

Your TruAxisVentures platform is now live on Ubuntu 24.04 LTS!

- **Website**: https://truaxis.com
- **Admin**: https://admin.truaxis.com
- **API**: https://api.truaxis.com

---

## Ubuntu 24.04 Quick Reference

### System Information
```bash
# Check Ubuntu version
lsb_release -a

# Check kernel version
uname -r

# Check system uptime
uptime

# Check system resources
htop  # Install with: sudo apt install htop
```

### Package Management
```bash
# Update package lists
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Install package
sudo apt install package-name

# Remove package
sudo apt remove package-name

# Clean up unused packages
sudo apt autoremove -y
```

### Firewall (UFW)
```bash
# Check firewall status
sudo ufw status

# Allow port
sudo ufw allow 80/tcp

# Deny port
sudo ufw deny 8080/tcp

# Delete rule
sudo ufw delete allow 80/tcp

# Reset firewall
sudo ufw reset
```

### Service Management
```bash
# Start service
sudo systemctl start service-name

# Stop service
sudo systemctl stop service-name

# Restart service
sudo systemctl restart service-name

# Enable service (start on boot)
sudo systemctl enable service-name

# Disable service
sudo systemctl disable service-name

# Check service status
sudo systemctl status service-name

# View service logs
sudo journalctl -u service-name -f
```

### File Permissions
```bash
# Change owner
sudo chown user:group file

# Change permissions
sudo chmod 755 file

# Recursive change
sudo chown -R user:group directory
sudo chmod -R 755 directory
```

### Network Commands
```bash
# Check open ports
sudo netstat -tulpn

# Check network interfaces
ip addr show

# Test connection
ping google.com

# DNS lookup
nslookup domain.com

# Check routing
ip route show
```

---

**Support**: For issues, check logs and troubleshooting section above.

**Documentation**: 
- Ubuntu 24.04: https://ubuntu.com/server/docs
- Nginx: https://nginx.org/en/docs/
- Python 3.12: https://docs.python.org/3.12/
- Node.js 20: https://nodejs.org/docs/latest-v20.x/api/

---

## Security Best Practices

### 1. Keep System Updated
```bash
# Set up automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Manual updates
sudo apt update && sudo apt upgrade -y
```

### 2. Configure SSH Security
```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended settings:
# PermitRootLogin no
# PasswordAuthentication no  # Use SSH keys only
# Port 2222  # Change default port (optional)

# Restart SSH
sudo systemctl restart sshd
```

### 3. Setup Fail2Ban
```bash
# Install Fail2Ban
sudo apt install fail2ban

# Create local config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
```

### 4. Regular Backups
```bash
# Create backup script
nano ~/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u truaxis_user -p'YOUR_PASSWORD' truaxis_db > $BACKUP_DIR/db_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/truaxis

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x ~/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/truaxis/backup.sh >> /home/truaxis/backup.log 2>&1
```

### 5. Monitor Logs
```bash
# Install logwatch
sudo apt install logwatch

# Configure daily email reports
sudo nano /etc/cron.daily/00logwatch
```

### 6. Secure Environment Variables
```bash
# Ensure .env is not readable by others
chmod 600 /var/www/truaxis/backend/.env

# Verify
ls -la /var/www/truaxis/backend/.env
# Should show: -rw------- (600)
```

### 7. Enable AppArmor (Ubuntu 24.04)
```bash
# Check AppArmor status
sudo aa-status

# AppArmor is enabled by default on Ubuntu 24.04
# Provides additional security layer
```

---

## Performance Optimization

### 1. Nginx Optimization
```bash
sudo nano /etc/nginx/nginx.conf
```

Add/update these settings:
```nginx
worker_processes auto;
worker_connections 2048;

# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

# Enable caching
open_file_cache max=1000 inactive=20s;
open_file_cache_valid 30s;
open_file_cache_min_uses 2;
```

### 2. Gunicorn Workers
```bash
# Calculate optimal workers: (2 x CPU cores) + 1
# Check CPU cores
nproc

# Update systemd service
sudo nano /etc/systemd/system/truaxis-backend.service
# Adjust --workers based on your CPU cores
```

### 3. Database Connection Pooling
Already configured in `backend/.env`:
```env
DB_POOL_SIZE=10
DB_POOL_RECYCLE=3600
DB_POOL_TIMEOUT=30
DB_MAX_OVERFLOW=20
```

### 4. Enable HTTP/2
```bash
# HTTP/2 is automatically enabled with SSL in Nginx 1.24+
# Verify in Nginx config (should be added by certbot)
sudo nano /etc/nginx/sites-available/truaxis.com
# Look for: listen 443 ssl http2;
```

---

## Monitoring Setup

### 1. Install Monitoring Tools
```bash
# Install htop for process monitoring
sudo apt install htop

# Install iotop for disk I/O monitoring
sudo apt install iotop

# Install nethogs for network monitoring
sudo apt install nethogs
```

### 2. Setup Log Rotation
```bash
# Create logrotate config for application
sudo nano /etc/logrotate.d/truaxis
```

```
/var/log/truaxis/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 truaxis www-data
    sharedscripts
    postrotate
        systemctl reload truaxis-backend > /dev/null 2>&1 || true
    endscript
}
```

### 3. Monitor Disk Space
```bash
# Check disk usage
df -h

# Find large files
sudo du -h /var/www/truaxis | sort -rh | head -20

# Clean up old logs
sudo journalctl --vacuum-time=7d
```

### 4. Monitor Service Health
```bash
# Create health check script
nano ~/health-check.sh
```

```bash
#!/bin/bash
# Check if backend is responding
if ! curl -f http://localhost:5000/api/products > /dev/null 2>&1; then
    echo "Backend is down! Restarting..."
    sudo systemctl restart truaxis-backend
    echo "Backend restarted at $(date)" >> ~/health-check.log
fi

# Check if Nginx is running
if ! systemctl is-active --quiet nginx; then
    echo "Nginx is down! Starting..."
    sudo systemctl start nginx
    echo "Nginx started at $(date)" >> ~/health-check.log
fi
```

```bash
# Make executable
chmod +x ~/health-check.sh

# Add to crontab (every 5 minutes)
crontab -e
# Add: */5 * * * * /home/truaxis/health-check.sh
```


---


---

**End of Deployment Guide**

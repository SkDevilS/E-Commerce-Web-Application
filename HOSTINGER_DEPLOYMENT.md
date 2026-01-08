# TruAxisVentures - Hostinger VPS Deployment Guide

Complete A-Z guide to deploy TruAxisVentures on Hostinger VPS with domain configuration.

## Quick Overview

This guide will help you deploy:
- **Main Website**: https://truaxis.com
- **Admin Portal**: https://admin.truaxis.com  
- **Backend API**: Running on same VPS, proxied through Nginx

**Estimated Time**: 2-3 hours

---

## Prerequisites

✅ Hostinger VPS with Ubuntu 20.04/22.04
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
apt update && apt upgrade -y
apt install -y curl wget git vim ufw software-properties-common
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

### Step 5: Install Python 3.10

```bash
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.10 python3.10-venv python3.10-dev python3-pip
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1
python3 --version
```

### Step 6: Install Node.js 18

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

### Step 7: Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**Note:** We're NOT installing MySQL on VPS as we'll use Hostinger's managed database service.

---

## Part 3: Setup Hostinger MySQL Database (15 minutes)

### Step 8: Create Database in Hostinger Panel

**From Hostinger Dashboard:**

1. **Login to Hostinger**
   - Go to https://hpanel.hostinger.com
   - Login with your credentials

2. **Navigate to Databases**
   - Click on "Databases" in the left sidebar
   - Or go to VPS → Databases

3. **Create New MySQL Database**
   - Click "Create Database"
   - Choose MySQL version (8.0 recommended)
   - Select your VPS or choose external database

4. **Database Configuration**
   - **Database Name**: `truaxis_db`
   - **Username**: `truaxis_user` (or auto-generated)
   - **Password**: Generate strong password or set your own
   - **Character Set**: `utf8mb4`
   - **Collation**: `utf8mb4_unicode_ci`

5. **Note Down Connection Details**
   After creation, you'll get:
   - **Hostname**: `mysql-xxxxx.hostinger.com` (or similar)
   - **Port**: `3306` (default)
   - **Database Name**: `truaxis_db`
   - **Username**: `truaxis_user`
   - **Password**: Your chosen password

6. **Enable Remote Access**
   - In database settings, enable "Remote MySQL"
   - Add your VPS IP address to allowed hosts
   - Or use `%` for any host (less secure, but works)

### Step 9: Test Database Connection from VPS

```bash
# Install MySQL client only (not server)
sudo apt install -y mysql-client

# Test connection (replace with your actual details)
mysql -h mysql-xxxxx.hostinger.com -P 3306 -u truaxis_user -p truaxis_db

# If connection successful, you'll see MySQL prompt
# Type EXIT; to exit
```

**If connection fails:**
- Check if Remote MySQL is enabled in Hostinger panel
- Verify your VPS IP is in allowed hosts
- Check firewall rules
- Verify credentials are correct

### Step 10: Create Database Tables

You don't need to create tables manually. Our application will create them automatically when you run `init_db.py` later.

**Important Notes:**
- ✅ Hostinger manages backups automatically
- ✅ Database is optimized and maintained by Hostinger
- ✅ You get monitoring and alerts
- ✅ No need to worry about MySQL configuration
- ✅ Better performance and reliability

---

## Part 4: Deploy Application (30 minutes)

### Step 10: Create Directory & Upload Code

```bash
sudo mkdir -p /var/www/truaxis
sudo chown -R truaxis:truaxis /var/www/truaxis
cd /var/www/truaxis

# Option A: Clone from Git
git clone YOUR_REPO_URL .

# Option B: Upload via SCP from local machine
# scp -r /path/to/local/truaxis/* truaxis@YOUR_VPS_IP:/var/www/truaxis/
```

### Step 11: Setup Backend

```bash
cd /var/www/truaxis/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn pymysql cryptography
```

### Step 12: Configure Environment

```bash
cp .env.example .env
nano .env
```

Update these values (use the connection details from Step 8):
```env
FLASK_ENV=production
FLASK_DEBUG=False

# Generate new keys
SECRET_KEY=YOUR_NEW_SECRET_KEY
JWT_SECRET_KEY=YOUR_NEW_JWT_KEY

# Database - Use Hostinger Database Connection Details from Step 8
DB_TYPE=mysql
DB_HOST=mysql-xxxxx.hostinger.com
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

### Step 13: Initialize Database

```bash
source venv/bin/activate
python init_db.py

# Create admin user
python -c "
from models import db, User
from werkzeug.security import generate_password_hash
admin = User(name='Admin', email='admin@truaxis.com', password=generate_password_hash('YOUR_ADMIN_PASSWORD'), role='admin', is_active=True)
db.session.add(admin)
db.session.commit()
print('Admin created')
"
```

### Step 14: Build Frontend

```bash
cd /var/www/truaxis

# Update API URL in code
nano src/utils/api.js
# Change to: const API_BASE_URL = 'https://api.truaxis.com';

nano src/config/admin.config.js
# Update admin domain check

# Install and build
npm install
npm run build

# Copy to web directory
sudo mkdir -p /var/www/truaxis/frontend
sudo cp -r dist/* /var/www/truaxis/frontend/
sudo chown -R www-data:www-data /var/www/truaxis/frontend
```

---

## Part 5: Configure Nginx (20 minutes)

### Step 15: Create Nginx Configs

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

### Step 16: Enable Sites

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

### Step 17: Create Systemd Service

```bash
sudo nano /etc/systemd/system/truaxis-backend.service
```

```ini
[Unit]
Description=TruAxis Backend
After=network.target mysql.service

[Service]
User=truaxis
Group=www-data
WorkingDirectory=/var/www/truaxis/backend
Environment="PATH=/var/www/truaxis/backend/venv/bin"
ExecStart=/var/www/truaxis/backend/venv/bin/gunicorn --workers 4 --bind 127.0.0.1:5000 --timeout 120 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### Step 18: Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl start truaxis-backend
sudo systemctl enable truaxis-backend
sudo systemctl status truaxis-backend
```

---

## Part 7: SSL & Domain Setup (20 minutes)

### Step 19: Install SSL Certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d truaxis.com -d www.truaxis.com -d admin.truaxis.com -d api.truaxis.com
```

Follow prompts and choose redirect HTTP to HTTPS.

### Step 20: Configure DNS in Hostinger

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

### Step 21: Verify DNS

```bash
nslookup truaxis.com
nslookup admin.truaxis.com
nslookup api.truaxis.com
```

---

## Part 8: Final Testing (10 minutes)

### Step 22: Test Everything

```bash
# Test backend
curl https://api.truaxis.com/api/products

# Test main site
curl -I https://truaxis.com

# Test admin
curl -I https://admin.truaxis.com
```

### Step 23: Browser Testing

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
# Backend logs
sudo journalctl -u truaxis-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
# Restart backend
sudo systemctl restart truaxis-backend

# Reload Nginx
sudo systemctl reload nginx
```

### Update Application
```bash
cd /var/www/truaxis
git pull
cd backend && source venv/bin/activate && pip install -r requirements.txt
cd .. && npm install && npm run build
sudo cp -r dist/* /var/www/truaxis/frontend/
sudo systemctl restart truaxis-backend
```

---

## Troubleshooting

**Backend not starting:**
```bash
sudo journalctl -u truaxis-backend -n 50
cd /var/www/truaxis/backend
source venv/bin/activate
python app.py  # Test manually
```

**Database errors:**
```bash
mysql -u truaxis_user -p truaxis_db
# Check connection
```

**Nginx errors:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

---

## Success Checklist

- [ ] VPS setup complete
- [ ] All software installed
- [ ] Database created and initialized
- [ ] Backend running on port 5000
- [ ] Frontend built and deployed
- [ ] Nginx configured for all domains
- [ ] SSL certificates installed
- [ ] DNS records configured
- [ ] All URLs working (truaxis.com, admin.truaxis.com, api.truaxis.com)
- [ ] Admin login working
- [ ] Can create products
- [ ] Can place orders

---

## 🎉 Congratulations!

Your TruAxisVentures platform is now live!

- **Website**: https://truaxis.com
- **Admin**: https://admin.truaxis.com
- **API**: https://api.truaxis.com

---

**Support**: For issues, check logs and troubleshooting section above.

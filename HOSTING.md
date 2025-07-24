# 🚀 IndusNetwork Hosting Guide

This guide will help you deploy your IndusNetwork Minecraft server management system to various hosting platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Node.js 18+ installed
- ✅ MongoDB database (local or cloud)
- ✅ Redis instance (for caching)
- ✅ Environment variables configured

## 🌐 Hosting Options

### 1. **Vercel (Recommended for Frontend)**

Perfect for the frontend part of your application.

**Steps:**
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all variables from your `.env` file

**Vercel Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "server/index.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. **Netlify**

Great for static hosting with serverless functions.

**Steps:**
1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Build your project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

**Netlify Configuration (`netlify.toml`):**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. **Railway (Full-Stack)**

Perfect for full-stack applications with database.

**Steps:**
1. Create account at [railway.app](https://railway.app)

2. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

3. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

4. Add environment variables:
   ```bash
   railway variables:set NODE_ENV=production
   railway variables:set DATABASE_URL=your_mongodb_url
   ```

### 4. **Heroku**

Traditional PaaS platform.

**Steps:**
1. Install Heroku CLI and login:
   ```bash
   heroku login
   ```

2. Create Heroku app:
   ```bash
   heroku create indusnetwork-app
   ```

3. Set buildpacks:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set DATABASE_URL=your_mongodb_url
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

**Procfile:**
```
web: npm start
```

### 5. **DigitalOcean Droplet (VPS)**

For full control over your server.

**Steps:**
1. Create a DigitalOcean droplet (Ubuntu 22.04)

2. SSH into your server:
   ```bash
   ssh root@your_server_ip
   ```

3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. Install PM2 (Process Manager):
   ```bash
   npm install -g pm2
   ```

5. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/indusnetwork.git
   cd indusnetwork
   ```

6. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

7. Create PM2 ecosystem file (`ecosystem.config.js`):
   ```javascript
   module.exports = {
     apps: [{
       name: 'indusnetwork',
       script: 'dist/server/node-build.mjs',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

8. Start with PM2:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

9. Set up Nginx reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Cloud)
1. Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `DATABASE_URL` in your environment variables

### Redis Cloud
1. Sign up at [redis.com](https://redis.com)
2. Create a database
3. Get connection URL
4. Update `REDIS_URL` in your environment variables

## 🔐 Environment Variables for Production

Create a production `.env` file with these variables:

```bash
# Production Environment
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/indusnetwork
REDIS_URL=redis://username:password@redis-host:port

# Security (Generate strong secrets!)
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_here

# Minecraft Server
MINECRAFT_SERVER_HOST=your-minecraft-server.com
MINECRAFT_SERVER_PORT=25565
MINECRAFT_RCON_HOST=your-minecraft-server.com
MINECRAFT_RCON_PORT=25575
MINECRAFT_RCON_PASSWORD=your_rcon_password

# Payment (Razorpay Production Keys)
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=rzp_live_your_key_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Features
ENABLE_PAYMENTS=true
ENABLE_RCON=true
```

## 🔧 Build Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "vite build --config vite.config.server.ts",
    "start": "node dist/server/node-build.mjs",
    "preview": "vite preview"
  }
}
```

## 📈 Monitoring & Maintenance

### 1. **Health Checks**
Add a health check endpoint:
```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
});
```

### 2. **Logging**
Use structured logging:
```bash
npm install winston
```

### 3. **Error Monitoring**
Consider integrating:
- Sentry for error tracking
- LogRocket for user session replay
- New Relic for performance monitoring

## 🔒 Security Checklist

- ✅ Use HTTPS in production
- ✅ Set secure environment variables
- ✅ Enable CORS properly
- ✅ Use rate limiting
- ✅ Validate all inputs
- ✅ Keep dependencies updated
- ✅ Use secrets management
- ✅ Enable database security

## 🚀 Quick Deploy Commands

**For Vercel:**
```bash
vercel --prod
```

**For Railway:**
```bash
railway up
```

**For Netlify:**
```bash
netlify deploy --prod --dir=dist
```

## 🔗 Custom Domain Setup

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Set DNS records:**
   - A record: `@` → `your_server_ip`
   - CNAME: `www` → `yourdomain.com`
3. **SSL Certificate:**
   - Most hosting providers offer free SSL
   - Or use Let's Encrypt for VPS

## 📞 Support

If you need help with deployment:
- Check the hosting provider's documentation
- Join their Discord/community
- Contact their support team

Your IndusNetwork application is now ready for production! 🎮

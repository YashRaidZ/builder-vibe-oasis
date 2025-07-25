# Termux Setup Guide for IndusNetwork

This guide helps you set up and run the IndusNetwork project on Termux (Android).

## 🔧 **Issue Fixed: SWC Native Binding Error**

### **Problem:**
```
Error: Failed to load native binding
    at Object.<anonymous> (.../node_modules/@swc/core/binding.js:333:11)
```

### **Solution:**
✅ **Switched from SWC to Babel** for better ARM/Android compatibility

## 📱 **Termux Setup Instructions**

### **1. Install Required Packages**
```bash
# Update packages
pkg update && pkg upgrade

# Install Node.js and development tools
pkg install nodejs npm git python

# Optional: Install additional tools
pkg install openssh curl wget
```

### **2. Set Up Project**
```bash
# Clone your project (if needed)
git clone https://github.com/YashRaidZ/builder-vibe-oasis.git
cd builder-vibe-oasis

# Install dependencies
npm install

# Start development server
npm run dev
```

### **3. Environment Configuration**
```bash
# Set environment variables if needed
export NODE_ENV=development
export PORT=8080

# Optional: Set npm registry for faster downloads
npm config set registry https://registry.npmmirror.com/
```

## 🚀 **Running the Application**

### **Development Server**
```bash
npm run dev
```
- Runs on: http://localhost:8080
- Hot reload enabled
- API routes available at /api/*

### **Building for Production**
```bash
npm run build
```

### **Starting Production Server**
```bash
npm start
```

## 🔧 **Termux-Specific Optimizations**

### **1. Memory Management**
```bash
# If you encounter memory issues
export NODE_OPTIONS="--max-old-space-size=2048"
```

### **2. Network Configuration**
```bash
# Allow external connections (optional)
termux-wake-lock
```

### **3. File Permissions**
```bash
# Fix file permissions if needed
chmod -R 755 .
```

## 🐛 **Common Issues & Solutions**

### **Issue: Port Already in Use**
```bash
# Kill process on port 8080
pkill -f "node.*8080"
# or
lsof -ti:8080 | xargs kill -9
```

### **Issue: Node.js Version Compatibility**
```bash
# Check Node.js version
node --version

# If version < 16, update
pkg install nodejs-lts
```

### **Issue: NPM Install Fails**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **Issue: Build Fails on Termux**
```bash
# Use legacy OpenSSL
export NODE_OPTIONS="--openssl-legacy-provider"
npm run build
```

## 📱 **Accessing Your App**

### **From Same Device**
- Open browser and go to: http://localhost:8080

### **From Other Devices (Same Network)**
1. Find your Termux IP address:
   ```bash
   ifconfig wlan0 | grep inet
   ```
2. Access from other devices: http://YOUR_IP:8080

### **Public Access (Advanced)**
Use tools like ngrok or localtunnel:
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 8080
```

## 🔒 **Security Considerations**

### **Network Security**
- Only expose ports you need
- Use strong passwords for any authentication
- Consider using HTTPS in production

### **Termux Security**
```bash
# Set up SSH key authentication
ssh-keygen -t rsa -b 4096

# Secure Termux storage
termux-setup-storage
```

## 📊 **Performance Tips**

### **1. Optimize Vite Build**
- Uses Babel instead of SWC for better compatibility
- Hot Module Replacement (HMR) works efficiently
- Development server optimized for mobile

### **2. Database Considerations**
- SQLite works well on Android
- Consider connection pooling for MySQL
- Redis can be challenging on Termux

### **3. Memory Usage**
```bash
# Monitor memory usage
htop

# Set memory limits for Node.js
export NODE_OPTIONS="--max-old-space-size=1024"
```

## 🔄 **Development Workflow**

### **Recommended Workflow:**
1. **Edit code** in your preferred editor
2. **Auto-reload** happens via Vite HMR
3. **Test locally** on http://localhost:8080
4. **Push changes** to your repository
5. **Deploy** to production when ready

### **Useful Commands:**
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run typecheck    # Check TypeScript

# Minecraft Plugin
cd minecraft-plugin
mvn clean package    # Build plugin JAR
```

## 🆘 **Getting Help**

### **Check Logs**
```bash
# View dev server logs
npm run dev 2>&1 | tee dev.log

# Check Termux logs
logcat | grep -i termux
```

### **Debug Mode**
```bash
# Run with debug output
DEBUG=* npm run dev
```

### **Reset Environment**
```bash
# Complete reset
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🎯 **Success Indicators**

✅ **Everything Working When:**
- Dev server starts without errors
- Browser shows the IndusNetwork homepage
- API endpoints respond correctly
- Hot reload works when editing files
- No SWC or native binding errors

Your IndusNetwork project should now run smoothly on Termux! 🚀

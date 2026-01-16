# 🚀 Complete Production Deployment Guide - Step by Step

## 📋 Table of Contents

1. [Real Google OAuth Setup](#real-google-oauth)
2. [Production Deployment](#production-deployment)
3. [pgAdmin Connection](#pgadmin-connection)
4. [Complete Checklist](#checklist)

---

## 🔐 Real Google OAuth Setup

### **Step 1: Google Cloud Console**

1. **Go to:** https://console.cloud.google.com/
2. **Create Project:** "bounce-game-auth"
3. **Enable Google+ API**
4. **Create OAuth 2.0 Credentials:**
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     http://localhost:8080/api/auth/google/callback
     https://your-domain.com/api/auth/google/callback
     ```
5. **Copy Client ID and Secret**

### **Step 2: Backend Updates**

**Add to `pom.xml`:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

**Update `application.properties`:**
```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

**See:** `REAL_GOOGLE_OAUTH.md` for complete code

### **Step 3: Frontend Updates**

**Install:**
```bash
npm install @react-oauth/google
```

**Update App.tsx:**
```typescript
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  {/* Your app */}
</GoogleOAuthProvider>
```

**See:** `REAL_GOOGLE_OAUTH.md` for complete code

---

## 🚀 Production Deployment

### **Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED**

#### **Frontend on Vercel:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd bounce-game/frontend
   vercel
   ```

4. **Add Environment Variables:**
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id
   VITE_API_URL=https://your-backend.railway.app/api
   ```

5. **Your app:** `https://bounce-game.vercel.app`

#### **Backend on Railway:**

1. **Go to:** https://railway.app/
2. **Sign up** with GitHub
3. **New Project** → Deploy from GitHub
4. **Select:** `bounce-game/backend`
5. **Add PostgreSQL Database:**
   - New → Database → PostgreSQL
6. **Add Environment Variables:**
   ```
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=${{Postgres.DATABASE_URL}}
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```
7. **Deploy!**

**See:** `PRODUCTION_DEPLOYMENT.md` for complete guide

---

## 🗄️ pgAdmin Connection

### **Local Database (Docker):**

1. **Open pgAdmin 4**
2. **Right-click "Servers"** → Register → Server
3. **Connection Tab:**
   ```
   Host: localhost
   Port: 5432
   Database: curioussys
   Username: postgres
   Password: postgres
   ```
4. **Save**
5. **View Tables:**
   - Expand: Servers → Databases → curioussys → Schemas → public → Tables
   - Right-click `level_comments` → View/Edit Data

**See:** `PGADMIN_CONNECTION.md` for complete guide

---

## ✅ Complete Checklist

### **Pre-Deployment:**

- [ ] Google OAuth credentials created
- [ ] Backend OAuth code updated
- [ ] Frontend OAuth code updated
- [ ] Environment variables documented
- [ ] Database migration scripts ready
- [ ] CORS configured for production domain

### **Deployment:**

- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Backend deployed (Railway/Render)
- [ ] Database created and connected
- [ ] Environment variables set
- [ ] Google OAuth redirect URIs updated
- [ ] HTTPS enabled (automatic)

### **Post-Deployment:**

- [ ] Test Google login
- [ ] Test comment posting
- [ ] Test database connection
- [ ] Check logs for errors
- [ ] Monitor performance

### **Production Ready:**

- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Database backups enabled
- [ ] Monitoring set up (optional)
- [ ] Error tracking (optional)

---

## 🎯 Quick Start Commands

### **Local Development:**

```bash
# Start everything
cd bounce-game
docker-compose up --build

# Or separately:
# Backend
cd backend
mvn spring-boot:run

# Frontend
cd frontend
npm run dev
```

### **Production Deployment:**

```bash
# Frontend
cd frontend
vercel

# Backend (via Railway dashboard)
# Just push to GitHub, Railway auto-deploys
```

---

## 📚 Documentation Files

1. **REAL_GOOGLE_OAUTH.md** - Complete OAuth setup
2. **PRODUCTION_DEPLOYMENT.md** - Deployment options
3. **PGADMIN_CONNECTION.md** - Database connection guide
4. **COMPLETE_EXPLANATION.md** - Architecture explanation

---

## 🆘 Need Help?

### **Common Issues:**

1. **OAuth not working:**
   - Check redirect URIs match exactly
   - Verify Client ID and Secret
   - Check CORS settings

2. **Database connection failed:**
   - Verify connection string
   - Check firewall rules
   - Ensure database is running

3. **Deployment failed:**
   - Check build logs
   - Verify environment variables
   - Check Dockerfile syntax

---

## 🌐 Your Live URLs

After deployment:

- **Frontend:** `https://bounce-game.vercel.app`
- **Backend:** `https://your-backend.railway.app`
- **Database:** Managed by Railway/Render

---

**सब कुछ ready है! Production में deploy करें!** 🎉

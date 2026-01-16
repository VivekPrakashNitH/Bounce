# 🚀 Production Deployment Guide - Free Hosting Options

## 🎯 Best Free Hosting Options

### **Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED**

#### **Frontend on Vercel (FREE):**

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

4. **Configure:**
   - Project name: `bounce-game`
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

5. **Add Environment Variables in Vercel Dashboard:**
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id
   VITE_API_URL=https://your-backend.railway.app/api
   ```

6. **Your app will be live at:**
   ```
   https://bounce-game.vercel.app
   ```

#### **Backend on Railway (FREE with $5 credit):**

1. **Go to:** https://railway.app/
2. **Sign up** with GitHub
3. **Click:** "New Project" → "Deploy from GitHub repo"
4. **Select:** Your repository
5. **Configure:**
   - Root directory: `bounce-game/backend`
   - Build command: `mvn clean package -DskipTests`
   - Start command: `java -jar target/discussion-backend-1.0.0.jar`
6. **Add Environment Variables:**
   ```
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-url
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=your-password
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```
7. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically provides connection string

8. **Your API will be at:**
   ```
   https://your-backend.railway.app
   ```

---

### **Option 2: Render (Frontend + Backend) - FREE**

#### **Frontend on Render:**

1. **Go to:** https://render.com/
2. **Sign up** with GitHub
3. **Click:** "New" → "Static Site"
4. **Connect:** Your GitHub repository
5. **Configure:**
   - Name: `bounce-game-frontend`
   - Branch: `main`
   - Root directory: `bounce-game/frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
6. **Add Environment Variables:**
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
7. **Deploy!**

#### **Backend on Render:**

1. **Click:** "New" → "Web Service"
2. **Connect:** Your GitHub repository
3. **Configure:**
   - Name: `bounce-game-backend`
   - Environment: `Docker`
   - Root directory: `bounce-game/backend`
   - Build command: `mvn clean package -DskipTests`
   - Start command: `java -jar target/discussion-backend-1.0.0.jar`
4. **Add PostgreSQL Database:**
   - Click "New" → "PostgreSQL"
   - Copy connection string
5. **Add Environment Variables:**
   ```
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=your-postgres-url
   SPRING_DATASOURCE_USERNAME=your-username
   SPRING_DATASOURCE_PASSWORD=your-password
   ```
6. **Deploy!**

---

### **Option 3: Netlify (Frontend) + Fly.io (Backend) - FREE**

#### **Frontend on Netlify:**

1. **Go to:** https://netlify.com/
2. **Sign up** with GitHub
3. **Click:** "Add new site" → "Import an existing project"
4. **Select:** Your repository
5. **Configure:**
   - Base directory: `bounce-game/frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Add Environment Variables:**
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id
   VITE_API_URL=https://your-backend.fly.dev/api
   ```
7. **Deploy!**

#### **Backend on Fly.io:**

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Initialize:**
   ```bash
   cd bounce-game/backend
   fly launch
   ```

4. **Configure `fly.toml`:**
   ```toml
   app = "bounce-game-backend"
   primary_region = "iad"

   [build]

   [env]
     SPRING_PROFILES_ACTIVE = "prod"

   [[services]]
     internal_port = 8080
     protocol = "tcp"
   ```

5. **Add PostgreSQL:**
   ```bash
   fly postgres create
   fly postgres attach --app bounce-game-backend
   ```

6. **Deploy:**
   ```bash
   fly deploy
   ```

---

## 🐳 Option 4: Docker Compose on VPS (Free Tier)

### **Use Oracle Cloud Free Tier:**

1. **Sign up:** https://www.oracle.com/cloud/free/
2. **Create VM:** Always Free tier (2 cores, 1GB RAM)
3. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

4. **Clone your repo:**
   ```bash
   git clone your-repo-url
   cd bounce-game
   ```

5. **Update docker-compose.yml for production:**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: curioussys
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: ${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
     
     backend:
       build: ./backend
       environment:
         SPRING_PROFILES_ACTIVE: prod
         SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/curioussys
         SPRING_DATASOURCE_USERNAME: postgres
         SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
       depends_on:
         - postgres
       ports:
         - "8080:8080"
     
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
   ```

6. **Deploy:**
   ```bash
   docker-compose up -d
   ```

---

## 📝 Step-by-Step: Deploy to Railway (Easiest)

### **1. Prepare Backend:**

**File:** `bounce-game/backend/Dockerfile`

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/discussion-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### **2. Create railway.json:**

**File:** `bounce-game/backend/railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "java -jar app.jar",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **3. Deploy:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Go to Railway:**
   - https://railway.app/
   - New Project → Deploy from GitHub
   - Select repository
   - Select `bounce-game/backend` as root

3. **Add PostgreSQL:**
   - New → Database → PostgreSQL
   - Copy connection string

4. **Add Environment Variables:**
   ```
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=${{Postgres.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{Postgres.USERNAME}}
   SPRING_DATASOURCE_PASSWORD=${{Postgres.PASSWORD}}
   ```

5. **Deploy!**

---

## 🔧 Production Checklist

- [ ] Update Google OAuth redirect URIs
- [ ] Set production environment variables
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Update CORS settings
- [ ] Set up database backups
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring (optional)

---

## 🌐 Custom Domain Setup

### **Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as shown

### **Railway:**
1. Go to Settings → Networking
2. Add custom domain
3. Update DNS records

---

**Your app will be live and accessible worldwide!** 🎉

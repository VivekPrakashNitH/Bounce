# 🗄️ pgAdmin Connection Guide - Step by Step

## 🎯 How to Connect pgAdmin to Your Database

### **Method 1: Connect to Docker Database (Local)**

#### **Step 1: Find Database Connection Details**

```powershell
# Check if database container is running
docker ps | findstr postgres

# Get database IP address
docker inspect curious-sys-db | findstr IPAddress
```

#### **Step 2: Open pgAdmin**

1. **Open pgAdmin 4** (if installed)
2. If not installed, download from: https://www.pgadmin.org/download/

#### **Step 3: Add New Server**

1. **Right-click** on "Servers" in left panel
2. **Click:** "Register" → "Server"

#### **Step 4: General Tab**

- **Name:** `Bounce Game Local` (any name you want)

#### **Step 5: Connection Tab**

Fill in these details:

```
Host name/address: localhost
Port: 5432
Maintenance database: postgres
Username: postgres
Password: postgres
```

**Important:** 
- If using Docker, use `localhost` or `127.0.0.1`
- If database is in Docker network, you might need container IP

#### **Step 6: Advanced Tab (Optional)**

- **DB restriction:** `curioussys` (to show only your database)

#### **Step 7: Save Password**

- ✅ Check "Save password" (optional but convenient)

#### **Step 8: Click "Save"**

You should now see your database connected!

---

## 🔍 Step-by-Step: View Your Comments

### **1. Expand Server:**
- Click on "Bounce Game Local" (or your server name)
- Expand "Databases"
- Expand "curioussys"

### **2. View Tables:**
- Expand "Schemas"
- Expand "public"
- Expand "Tables"
- You'll see: `level_comments`, `users`, etc.

### **3. View Comments:**
- **Right-click** on `level_comments` table
- **Click:** "View/Edit Data" → "All Rows"
- You'll see all your comments!

### **4. Run SQL Query:**

1. **Right-click** on `curioussys` database
2. **Click:** "Query Tool"
3. **Type:**
   ```sql
   SELECT * FROM level_comments WHERE level_id = 'LEVEL_HLD_LLD';
   ```
4. **Click:** Execute (F5)
5. **See results!**

---

## 🐳 Method 2: Connect to Docker Database (Direct)

### **If localhost doesn't work:**

1. **Find container IP:**
   ```powershell
   docker inspect curious-sys-db --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
   ```

2. **Use that IP in pgAdmin:**
   ```
   Host: <container-ip>
   Port: 5432
   ```

---

## 🌐 Method 3: Connect to Production Database (Railway/Render)

### **For Railway:**

1. **Go to Railway Dashboard**
2. **Click on your PostgreSQL database**
3. **Go to "Connect" tab**
4. **Copy connection string:**
   ```
   postgresql://postgres:password@hostname:5432/railway
   ```

5. **Parse the connection string:**
   ```
   Host: hostname (from connection string)
   Port: 5432
   Database: railway (or from connection string)
   Username: postgres
   Password: password (from connection string)
   ```

6. **In pgAdmin:**
   - Use these details in Connection tab
   - **Important:** Enable SSL if required

### **For Render:**

1. **Go to Render Dashboard**
2. **Click on your PostgreSQL database**
3. **Copy "Internal Database URL"**
4. **Parse and use in pgAdmin**

---

## 🔧 Troubleshooting

### **Error: "Connection refused"**

**Solution:**
- Check if database container is running:
  ```powershell
  docker ps | findstr postgres
  ```
- If not running:
  ```powershell
  docker-compose up -d postgres
  ```

### **Error: "Password authentication failed"**

**Solution:**
- Check password in `docker-compose.yml`
- Default is usually `postgres`
- Or reset:
  ```powershell
  docker exec -it curious-sys-db psql -U postgres -c "ALTER USER postgres PASSWORD 'newpassword';"
  ```

### **Error: "Database does not exist"**

**Solution:**
- Connect to `postgres` database first
- Then create `curioussys`:
  ```sql
  CREATE DATABASE curioussys;
  ```

### **Can't see tables**

**Solution:**
- Make sure you're in the right database (`curioussys`)
- Check schema: `public`
- Refresh: Right-click → Refresh

---

## 📊 Common Queries to Run

### **1. See All Comments:**
```sql
SELECT * FROM level_comments ORDER BY created_at DESC;
```

### **2. See Comments for Specific Level:**
```sql
SELECT * FROM level_comments WHERE level_id = 'LEVEL_HLD_LLD';
```

### **3. Count Comments:**
```sql
SELECT level_id, COUNT(*) as comment_count 
FROM level_comments 
GROUP BY level_id;
```

### **4. See Users:**
```sql
SELECT * FROM users;
```

### **5. See Comments with User Info:**
```sql
SELECT 
    lc.id,
    lc.content,
    lc.level_id,
    lc.author,
    lc.created_at,
    u.email
FROM level_comments lc
LEFT JOIN users u ON lc.user_id = u.id
ORDER BY lc.created_at DESC;
```

---

## 🎯 Quick Reference

### **Connection Details (Local Docker):**
```
Host: localhost
Port: 5432
Database: curioussys
Username: postgres
Password: postgres
```

### **Connection Details (Production):**
- Get from your hosting provider dashboard
- Usually in "Connection" or "Database" section

---

## ✅ Checklist

- [ ] pgAdmin installed
- [ ] Database container running
- [ ] Server added in pgAdmin
- [ ] Connected successfully
- [ ] Can see `curioussys` database
- [ ] Can see `level_comments` table
- [ ] Can view your comments!

---

**अब आप pgAdmin में database देख सकते हैं!** 🎉

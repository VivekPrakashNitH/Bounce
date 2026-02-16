# Docker Run Guide for Bounce

This guide explains exactly how to run your project and get the OTP for login.

## 1. Quick Start (Run this first!)
Open your terminal in the project folder and run:

```powershell
docker-compose up -d --build
```
This is the **safest** command to use.

### What does this command do?
- `up`: Starts the containers.
- `-d` (Detached): Runs in the background so your terminal doesn't get stuck.
- `--build`: Forces a rebuild of the images. **Important:** If you changed any code, you MUST use this flag to see the changes.

## 2. Default Command (If code hasn't changed)
If you just stopped the app and didn't change any code, you can simply run:
```powershell
docker-compose up -d
```

## 3. How to See the OTP (Login Code)
Since we are in development mode, the OTP is printed to the **backend logs** instead of being emailed.

### Option A: Use the Helper Script (Easiest)
I created a script for you. In your terminal, run:
```powershell
.\get_otp.ps1
```
This will instantly show you the latest OTP codes.

### Option B: Manual Command
If the script doesn't work, you can run this manually:
```powershell
docker logs curious-sys-backend 2>&1 | Select-String "OTP"
```

## 4. Stopping the App
To stop everything cleanly:
```powershell
docker-compose down
```

## 5. Where to find Features

### Community Reviews
- **URL:** [http://localhost:5173/reviews](http://localhost:5173/reviews)
- **What it is:** A page where users can leave general feedback and see what others are saying.
- **How to get there:** Click the "Review" button in the top navigation bar inside the game.

### Level Comments
- **URL:** Any specific level, e.g., `http://localhost:5173/course/system-design/level-1`
- **What it is:** Specific discussions about the current topic (e.g., Load Balancers).
- **How to get there:** Scroll to the **bottom** of any learning level.

### Database (Raw Data)
If you want to see the raw data (users, comments, reviews) in the database:
- **Host:** `localhost`
- **Port:** `5432`
- **User:** `postgres`
- **Password:** `postgres`
- **Database:** `curioussys`
*(Use a tool like DBeaver or pgAdmin to connect)*

### How to Connect (pgAdmin Step-by-Step)
Since you have pgAdmin open:
1. Click **Add New Server**.
2. **General** Tab: Name it `Bounce DB`.
3. **Connection** Tab:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Maintenance Database:** `curioussys`
   - **Username:** `postgres`
   - **Password:** `postgres`
4. Click **Save**.
5. Navigate to **Schemas > public > Tables** to see data.

### Quick Database Dump
To see the users and comments without installing anything, run this script:
```powershell
.\view_db_data.ps1
```
This will print the latest `users` and `level_comments` directly in your terminal.

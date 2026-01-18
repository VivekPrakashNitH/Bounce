# 📧 Email/OTP Authentication Setup Guide

## ✅ What Has Been Implemented

### **Backend:**
1. ✅ **User Entity** - Added `passwordHash` and `emailVerified` fields
2. ✅ **OTP Entity** - Stores OTP codes with expiration (10 minutes)
3. ✅ **Email Service** - Sends OTP via email (logs to console in dev mode)
4. ✅ **OTP Service** - Generates, sends, and verifies OTPs
5. ✅ **Auth Endpoints:**
   - `POST /api/auth/send-otp` - Send OTP to email
   - `POST /api/auth/verify-otp` - Verify OTP and register/login
   - `POST /api/auth/login` - Login with email/password

### **Frontend:**
1. ✅ **Email/OTP Flow** - Complete authentication UI
2. ✅ **Registration Flow** - Name and password setup for new users
3. ✅ **Login Flow** - Password login for existing users
4. ✅ **Comment Integration** - Comments save with user info and timestamp

---

## 🚀 How It Works

### **Flow for New Users:**
1. Enter email → Send OTP
2. Enter 6-digit OTP → Verify
3. Enter name and password → Create account
4. ✅ Authenticated!

### **Flow for Existing Users:**
1. Enter email → Send OTP
2. Enter 6-digit OTP → Verify
3. If password set → Login with password
4. If no password → Directly authenticated
5. ✅ Authenticated!

---

## 🔧 Configuration

### **Development Mode (Current):**
- OTPs are **logged to console** (no email setup needed)
- Check backend console for OTP codes
- Example: `=== OTP EMAIL (Development Mode) ===`

### **Production Mode (Email Setup):**

**1. Add to `application.properties` or environment variables:**

```properties
# Gmail SMTP (example)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**2. For Gmail:**
- Enable 2-factor authentication
- Generate App Password: https://myaccount.google.com/apppasswords
- Use App Password (not regular password)

**3. For Other Email Providers:**
- Update `spring.mail.host` and `spring.mail.port`
- Configure SMTP settings accordingly

---

## 📝 API Endpoints

### **Send OTP**
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent to email"
}
```

### **Verify OTP**
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "name": "John Doe",  // Required for new users
  "password": "password123"  // Required for new users
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": null,
  "createdAt": "2024-01-15T10:30:00"
}
```

### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 🔐 Security Features

1. ✅ **Password Hashing** - BCrypt (industry standard)
2. ✅ **OTP Expiration** - 10 minutes
3. ✅ **OTP One-Time Use** - Cannot reuse OTPs
4. ✅ **Email Validation** - Basic email format check
5. ✅ **Password Requirements** - Minimum 6 characters

---

## 🧪 Testing

### **Local Development:**
1. Start backend: `mvn spring-boot:run`
2. Check console for OTP codes
3. Use OTP in frontend to authenticate

### **Example OTP in Console:**
```
=== OTP EMAIL (Development Mode) ===
To: user@example.com
OTP Code: 123456
================================
```

---

## 🚀 Production Deployment

1. **Configure SMTP** in environment variables
2. **Set email credentials** securely
3. **Test email delivery** before going live
4. **Monitor OTP delivery** rates

---

## 📋 Database Schema

### **Users Table:**
- `id` - Primary key
- `email` - Unique email
- `name` - User name
- `passwordHash` - BCrypt hashed password
- `emailVerified` - Boolean
- `avatar` - Optional avatar URL
- `googleId` - Optional OAuth ID

### **OTPs Table:**
- `id` - Primary key
- `email` - User email
- `otpCode` - 6-digit OTP
- `expiresAt` - Expiration timestamp
- `used` - Boolean (one-time use)
- `createdAt` - Creation timestamp

---

**Email/OTP Authentication is ready!** 🎉

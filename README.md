# 🎮 Bounce - System Design Learning Platform

An interactive, gamified platform to learn system design concepts through hands-on demos and visualizations.

## ✨ Features

- 📚 **20+ Interactive Lessons** - Learn system design through visual demos
- 🎯 **Level-Based Learning** - Progress through concepts step by step
- 💬 **Community Discussions** - Comment and discuss on each level
- 🔐 **Email OTP Authentication** - Secure login with email verification
- 🤖 **AI Chat Assistant** - Get help by clicking the Bounce avatar
- 📱 **Mobile Responsive** - Works on all devices

---

## 🚀 Local Development Setup

### Prerequisites

- **Java 17+** (JDK)
- **Node.js 18+**
- **Maven 3.8+**

### 1. Clone the Repository

```bash
git clone https://github.com/VivekPrakashNitH/Bounce.git
cd Bounce
```

### 2. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start at **http://localhost:8080**

> **Note:** For email OTP to work locally, set environment variables:
> ```bash
> set MAIL_USERNAME=your-email@gmail.com
> set MAIL_PASSWORD=your-gmail-app-password
> ```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at **http://localhost:3000**

---

## 🗄️ Local Database

The app uses **H2 in-memory database** for local development.

**To view the database:**
1. Start the backend
2. Open: http://localhost:8080/h2-console
3. Use these settings:
   - **JDBC URL:** `jdbc:h2:mem:discussiondb`
   - **Username:** `sa`
   - **Password:** *(leave empty)*

---

## 📁 Project Structure

```
Bounce/
├── backend/          # Spring Boot REST API
│   └── src/main/
│       ├── java/     # Controllers, Services, Entities
│       └── resources/# Configuration files
│
├── frontend/         # React + TypeScript + Vite
│   ├── components/   # React Components
│   ├── services/     # API Services
│   └── data/         # Course Content
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Spring Boot 3.2, Java 17, Spring Data JPA |
| Database | H2 (dev), PostgreSQL (prod) |
| Auth | Email OTP with BCrypt |

---

## 👨‍💻 Author

**Vivek Prakash** - [@VivekPrakashNitH](https://github.com/VivekPrakashNitH)

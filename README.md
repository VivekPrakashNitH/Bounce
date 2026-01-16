# 🎮 Bounce Game - System Design Learning Platform

An interactive system design learning platform with a game-based approach to teaching software architecture concepts.

## 🚀 Features

- **Interactive System Design Lessons**: Learn through hands-on demos and visualizations
- **Level-Based Learning**: Progress through different system design concepts
- **Community Discussions**: Comment and discuss on each level
- **OAuth Authentication**: Sign in with Google or GitHub
- **Real-time Comments**: Save and view comments with timestamps
- **Modern Tech Stack**: React, TypeScript, Spring Boot, PostgreSQL

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Spring Boot 3.2** (Java 17)
- **Spring Data JPA** for database operations
- **PostgreSQL** for production
- **H2 Database** for development
- **Spring Security** with OAuth2

### Deployment
- **Docker** & **Docker Compose** for containerization
- **Nginx** for frontend serving
- Ready for deployment on Vercel, Railway, Render, etc.

## 📦 Quick Start

### Prerequisites
- Docker and Docker Compose
- OR Java 17+ and Node.js 18+ for local development

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd bounce-game

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080
# Database: localhost:5432
```

### Local Development

#### Backend
```bash
cd backend
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Authentication Setup

### Google OAuth
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URIs:
   - `http://localhost:8080/api/auth/google/callback` (development)
   - `https://your-domain.com/api/auth/google/callback` (production)

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add authorization callback URL:
   - `http://localhost:8080/api/auth/github/callback` (development)
   - `https://your-domain.com/api/auth/github/callback` (production)

See `REAL_GOOGLE_OAUTH.md` for detailed setup instructions.

## 🗄️ Database

The application uses PostgreSQL in production and H2 in development.

### Database Schema
- **users**: User accounts with OAuth information
- **level_comments**: Comments associated with game levels

### Connect with pgAdmin
See `PGADMIN_CONNECTION.md` for connection details.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set root directory to `backend`
3. Add environment variables (see `PRODUCTION_DEPLOYMENT.md`)

See `PRODUCTION_DEPLOYMENT.md` for complete deployment guide.

## 📁 Project Structure

```
bounce-game/
├── frontend/          # React frontend application
│   ├── components/    # React components
│   ├── services/     # API services
│   └── ...
├── backend/          # Spring Boot backend
│   ├── src/main/java/com/c4gt/
│   │   ├── controller/  # REST controllers
│   │   ├── service/     # Business logic
│   │   ├── repository/  # Data access
│   │   └── entity/      # JPA entities
│   └── ...
└── docker-compose.yml # Docker configuration
```

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Backend (application.properties)
```
spring.datasource.url=jdbc:postgresql://localhost:5432/curioussys
spring.security.oauth2.client.registration.google.client-id=your-client-id
spring.security.oauth2.client.registration.google.client-secret=your-client-secret
```

## 📚 Documentation

- `REAL_GOOGLE_OAUTH.md` - OAuth setup guide
- `PRODUCTION_DEPLOYMENT.md` - Deployment instructions
- `PGADMIN_CONNECTION.md` - Database connection guide
- `COMPLETE_PRODUCTION_GUIDE.md` - Complete production guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built for learning system design concepts through interactive gameplay.

---

**Happy Learning! 🎉**

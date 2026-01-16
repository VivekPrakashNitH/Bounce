# Discussion Backend API

Spring Boot REST API for managing discussions and comments.

## Features

- ✅ RESTful API for discussions and comments
- ✅ PostgreSQL database support (H2 for development)
- ✅ JPA/Hibernate for data persistence
- ✅ Input validation
- ✅ CORS configuration for frontend integration
- ✅ Proper error handling
- ✅ Clean architecture (Controller → Service → Repository)

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL** (production) / **H2** (development)
- **Maven**

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL (for production) or use H2 (included for development)

### Running Locally

1. **Clone/Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   Or run the main class: `com.c4gt.DiscussionBackendApplication`

4. **Access the API**
   - API Base URL: `http://localhost:8080/api`
   - H2 Console (dev only): `http://localhost:8080/h2-console`
     - JDBC URL: `jdbc:h2:mem:discussiondb`
     - Username: `sa`
     - Password: (empty)

## API Endpoints

### Discussions

- `GET /api/discussions` - Get all discussions
- `GET /api/discussions/{id}` - Get discussion by ID
- `POST /api/discussions` - Create a new discussion
- `DELETE /api/discussions/{id}` - Delete a discussion

### Comments

- `GET /api/discussions/{id}/comments` - Get all comments for a discussion
- `POST /api/discussions/comments` - Add a comment to a discussion
- `DELETE /api/discussions/comments/{id}` - Delete a comment

## Example Requests

### Create Discussion
```bash
POST http://localhost:8080/api/discussions
Content-Type: application/json

{
  "title": "How to deploy Spring Boot apps?",
  "content": "I'm looking for best practices on deploying Spring Boot applications to production.",
  "author": "John Doe"
}
```

### Add Comment
```bash
POST http://localhost:8080/api/discussions/comments
Content-Type: application/json

{
  "content": "You can use Docker containers or cloud platforms like AWS, GCP, or Azure.",
  "author": "Jane Smith",
  "discussionId": 1
}
```

## Production Deployment

### Using PostgreSQL

1. Update `application-prod.properties` with your database credentials
2. Set environment variables:
   ```bash
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=discussiondb
   DB_USER=your-username
   DB_PASSWORD=your-password
   FRONTEND_URL=https://your-frontend-url.com
   ```

3. Run with production profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=prod
   ```

### Building JAR for Deployment

```bash
mvn clean package
```

This creates `target/discussion-backend-1.0.0.jar`

Run the JAR:
```bash
java -jar target/discussion-backend-1.0.0.jar --spring.profiles.active=prod
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/c4gt/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/       # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── exception/       # Exception handlers
│   │   │   ├── repository/      # Data repositories
│   │   │   ├── service/         # Business logic
│   │   │   └── DiscussionBackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                    # Test files
└── pom.xml
```

## Next Steps

- Add authentication/authorization (JWT)
- Add pagination for discussions/comments
- Add search functionality
- Add user profiles
- Add upvoting/downvoting
- Add file uploads
- Add real-time updates (WebSocket)

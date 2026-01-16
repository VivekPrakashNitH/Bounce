# 🔐 Real Google OAuth Setup - Complete Guide

## 🎯 Step 1: Google Cloud Console Setup

### **1.1 Create Google Cloud Project**

1. **Go to:** https://console.cloud.google.com/
2. **Click:** "Select a project" → "New Project"
3. **Enter:**
   - Project name: `bounce-game-auth`
   - Organization: (leave default)
4. **Click:** "Create"
5. **Wait** for project creation (30 seconds)

### **1.2 Enable Google+ API**

1. **Go to:** APIs & Services → Library
2. **Search:** "Google+ API"
3. **Click:** "Google+ API"
4. **Click:** "Enable"

### **1.3 Create OAuth 2.0 Credentials**

1. **Go to:** APIs & Services → Credentials
2. **Click:** "Create Credentials" → "OAuth client ID"
3. **If prompted:** Configure OAuth consent screen first

#### **Configure OAuth Consent Screen:**
- **User Type:** External (for public use)
- **App name:** "Bounce Game"
- **User support email:** Your email
- **Developer contact:** Your email
- **Click:** "Save and Continue"
- **Scopes:** Add `email`, `profile`, `openid`
- **Click:** "Save and Continue"
- **Test users:** Add your email (optional for testing)
- **Click:** "Back to Dashboard"

#### **Create OAuth Client:**
1. **Application type:** Web application
2. **Name:** "Bounce Game Web Client"
3. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   http://localhost:3000
   https://your-domain.com
   ```
4. **Authorized redirect URIs:**
   ```
   http://localhost:5173/auth/google/callback
   http://localhost:8080/api/auth/google/callback
   https://your-domain.com/auth/google/callback
   ```
5. **Click:** "Create"
6. **Copy:**
   - Client ID: `YOUR_CLIENT_ID`
   - Client Secret: `YOUR_CLIENT_SECRET`

---

## 🔧 Step 2: Backend Setup (Spring Boot)

### **2.1 Add Dependencies**

**File:** `bounce-game/backend/pom.xml`

Add these dependencies:

```xml
<!-- Google OAuth2 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>

<!-- JWT for tokens -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

### **2.2 Update application.properties**

**File:** `bounce-game/backend/src/main/resources/application.properties`

Add:

```properties
# Google OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=email,profile,openid
spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8080/api/auth/google/callback

# JWT Configuration
jwt.secret=your-secret-key-min-256-bits-long-for-production-use-a-strong-random-key
jwt.expiration=86400000
```

### **2.3 Create OAuth2 Configuration**

**File:** `bounce-game/backend/src/main/java/com/c4gt/config/OAuth2Config.java`

```java
package com.c4gt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class OAuth2Config {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/level-comments/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("http://localhost:5173/auth/success", true)
                .failureUrl("http://localhost:5173/auth/error")
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://your-domain.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        return new UrlBasedCorsConfigurationSource() {{
            registerCorsConfiguration("/**", configuration);
        }};
    }
}
```

### **2.4 Update AuthController**

**File:** `bounce-game/backend/src/main/java/com/c4gt/controller/AuthController.java`

```java
package com.c4gt.controller;

import com.c4gt.dto.UserDTO;
import com.c4gt.entity.User;
import com.c4gt.repository.UserRepository;
import com.c4gt.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/google/callback")
    public ResponseEntity<Map<String, Object>> googleCallback(
            @AuthenticationPrincipal OAuth2User oauth2User) {
        
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");
        String googleId = oauth2User.getAttribute("sub");

        // Find or create user
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update user info
            user.setName(name);
            user.setAvatar(picture);
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setAvatar(picture);
            user.setGoogleId(googleId);
            user = userRepository.save(user);
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", convertToDTO(user)
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(convertToDTO(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setAvatar(user.getAvatar());
        return dto;
    }
}
```

### **2.5 Create JWT Service**

**File:** `bounce-game/backend/src/main/java/com/c4gt/service/JwtService.java`

```java
package com.c4gt.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    public String generateToken(com.c4gt.entity.User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("name", user.getName())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

---

## 🎨 Step 3: Frontend Setup (React)

### **3.1 Install Dependencies**

```bash
cd bounce-game/frontend
npm install @react-oauth/google
```

### **3.2 Update App.tsx**

**File:** `bounce-game/frontend/App.tsx`

Add Google OAuth Provider:

```typescript
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Your existing app code */}
    </GoogleOAuthProvider>
  );
}
```

### **3.3 Update CommentSection.tsx**

**File:** `bounce-game/frontend/components/CommentSection.tsx`

Replace mock login with real OAuth:

```typescript
import { useGoogleLogin } from '@react-oauth/google';

// Replace handleGoogleLogin function:
const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      // Send token to backend
      const response = await fetch('http://localhost:8080/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenResponse.access_token }),
      });

      const data = await response.json();
      
      // Store token and user
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('curious_google_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Failed to login. Please try again.');
    }
  },
  onError: () => {
    setError('Login failed. Please try again.');
  },
});
```

### **3.4 Create .env file**

**File:** `bounce-game/frontend/.env`

```
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
VITE_API_URL=http://localhost:8080/api
```

---

## ✅ Step 4: Testing

1. **Start Backend:**
   ```bash
   cd bounce-game/backend
   mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd bounce-game/frontend
   npm run dev
   ```

3. **Test:**
   - Click "Sign in with Google"
   - Real Google login page opens!
   - After login, you're authenticated

---

## 🚀 Production Setup

### **Update Redirect URIs in Google Console:**
```
https://your-domain.com/auth/google/callback
```

### **Update application.properties:**
```properties
spring.security.oauth2.client.registration.google.redirect-uri=https://your-domain.com/api/auth/google/callback
```

### **Update Frontend .env:**
```
VITE_GOOGLE_CLIENT_ID=YOUR_PRODUCTION_CLIENT_ID
VITE_API_URL=https://api.your-domain.com/api
```

---

**Real Google OAuth setup complete!** 🎉

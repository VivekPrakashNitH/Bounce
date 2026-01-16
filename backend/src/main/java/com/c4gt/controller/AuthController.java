package com.c4gt.controller;

import com.c4gt.dto.UserDTO;
import com.c4gt.entity.User;
import com.c4gt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Register or login a user with Google OAuth
     */
    @PostMapping("/google")
    public ResponseEntity<UserDTO> googleAuth(@RequestBody GoogleAuthRequest request) {
        // Check if user exists by email
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update user info if needed
            if (request.getName() != null) user.setName(request.getName());
            if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
            if (request.getGoogleId() != null) user.setGoogleId(request.getGoogleId());
            user = userRepository.save(user);
        } else {
            // Create new user
            user = new User();
            user.setEmail(request.getEmail());
            user.setName(request.getName());
            user.setAvatar(request.getAvatar());
            user.setGoogleId(request.getGoogleId());
            user = userRepository.save(user);
        }
        
        UserDTO dto = convertToDTO(user);
        return ResponseEntity.ok(dto);
    }
    
    /**
     * Register or login a user with GitHub OAuth
     */
    @PostMapping("/github")
    public ResponseEntity<UserDTO> githubAuth(@RequestBody GitHubAuthRequest request) {
        // Check if user exists by email
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update user info if needed
            if (request.getName() != null) user.setName(request.getName());
            if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
            if (request.getGithubId() != null) user.setGoogleId(request.getGithubId()); // Reusing googleId field for GitHub ID
            user = userRepository.save(user);
        } else {
            // Create new user
            user = new User();
            user.setEmail(request.getEmail());
            user.setName(request.getName());
            user.setAvatar(request.getAvatar());
            user.setGoogleId(request.getGithubId()); // Reusing googleId field for GitHub ID
            user = userRepository.save(user);
        }
        
        UserDTO dto = convertToDTO(user);
        return ResponseEntity.ok(dto);
    }
    
    @GetMapping("/user/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(convertToDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setAvatar(user.getAvatar());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
    
    // Inner class for Google OAuth request
    public static class GoogleAuthRequest {
        private String email;
        private String name;
        private String avatar;
        private String googleId;
        
        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
        public String getGoogleId() { return googleId; }
        public void setGoogleId(String googleId) { this.googleId = googleId; }
    }
    
    // Inner class for GitHub OAuth request
    public static class GitHubAuthRequest {
        private String email;
        private String name;
        private String avatar;
        private String githubId;
        
        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
        public String getGithubId() { return githubId; }
        public void setGithubId(String githubId) { this.githubId = githubId; }
    }
}

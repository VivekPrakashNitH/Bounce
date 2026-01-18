package com.c4gt.controller;

import com.c4gt.dto.UserDTO;
import com.c4gt.entity.User;
import com.c4gt.repository.UserRepository;
import com.c4gt.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private OtpService otpService;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
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
    
    /**
     * Send OTP to email for registration/login
     */
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody SendOtpRequest request) {
        try {
            otpService.generateAndSendOtp(request.getEmail());
            return ResponseEntity.ok(Map.of("message", "OTP sent to email"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send OTP: " + e.getMessage()));
        }
    }
    
    /**
     * Verify OTP and register/login user
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        // Verify OTP
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid or expired OTP"));
        }
        
        // Check if user exists
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        User user;
        
        if (existingUser.isPresent()) {
            // Existing user - if they have password, require password login
            user = existingUser.get();
            if (user.getPasswordHash() != null && !user.getPasswordHash().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Please login with password", "requiresPassword", "true"));
            }
        } else {
            // New user - register
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Name is required for registration"));
            }
            if (request.getPassword() == null || request.getPassword().length() < 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Password must be at least 6 characters"));
            }
            
            user = new User();
            user.setEmail(request.getEmail());
            user.setName(request.getName());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setEmailVerified(true);
            user = userRepository.save(user);
        }
        
        UserDTO dto = convertToDTO(user);
        return ResponseEntity.ok(dto);
    }
    
    /**
     * Login with email and password
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }
        
        User user = userOpt.get();
        
        if (user.getPasswordHash() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Please use OTP verification to set up your account"));
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
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
    
    // Inner class for Send OTP request
    public static class SendOtpRequest {
        private String email;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
    
    // Inner class for Verify OTP request
    public static class VerifyOtpRequest {
        private String email;
        private String otp;
        private String name; // Required for new users
        private String password; // Required for new users
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    // Inner class for Login request
    public static class LoginRequest {
        private String email;
        private String password;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}

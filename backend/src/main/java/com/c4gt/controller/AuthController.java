package com.c4gt.controller;

import com.c4gt.dto.UserDTO;
import com.c4gt.entity.User;
import com.c4gt.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * Send OTP to email for registration
     */
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            // Check if email already exists
            if (authService.emailExists(email)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already registered. Please login instead."));
            }
            
            authService.sendOtp(email);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + email));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Verify OTP and register new user
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtpAndRegister(@RequestBody VerifyOtpRequest request) {
        try {
            if (request.getEmail() == null || request.getOtp() == null || 
                request.getName() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
            }
            
            User user = authService.verifyOtpAndRegister(
                request.getEmail(), 
                request.getOtp(), 
                request.getName(), 
                request.getPassword()
            );
            
            return ResponseEntity.ok(convertToDTO(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Login with email and password
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
            }
            
            User user = authService.login(email, password);
            return ResponseEntity.ok(convertToDTO(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Send OTP for forgot password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            authService.sendForgotPasswordOtp(email);
            return ResponseEntity.ok(Map.of("message", "Password reset OTP sent to " + email));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Reset password with OTP
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            if (request.getEmail() == null || request.getOtp() == null || request.getNewPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
            }
            
            authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Check if email exists
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = authService.emailExists(email);
        return ResponseEntity.ok(Map.of("exists", exists));
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
    
    // Request DTOs
    public static class VerifyOtpRequest {
        private String email;
        private String otp;
        private String name;
        private String password;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class ResetPasswordRequest {
        private String email;
        private String otp;
        private String newPassword;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}

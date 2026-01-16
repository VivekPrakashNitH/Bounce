package com.c4gt.service;

import com.c4gt.entity.User;
import com.c4gt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // Store OTPs temporarily (in production, use Redis or database)
    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();
    
    private static class OtpData {
        String otp;
        long expiryTime;
        
        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
    
    // Generate 6-digit OTP
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    
    // Send OTP for registration
    public void sendOtp(String email) {
        String otp = generateOtp();
        long expiryTime = System.currentTimeMillis() + (10 * 60 * 1000); // 10 minutes
        
        otpStore.put(email, new OtpData(otp, expiryTime));
        emailService.sendOtpEmail(email, otp);
        
        System.out.println("[DEBUG] OTP for " + email + ": " + otp);
    }
    
    // Verify OTP and register user
    public User verifyOtpAndRegister(String email, String otp, String name, String password) {
        OtpData otpData = otpStore.get(email);
        
        if (otpData == null) {
            throw new RuntimeException("No OTP found for this email. Please request a new OTP.");
        }
        
        if (System.currentTimeMillis() > otpData.expiryTime) {
            otpStore.remove(email);
            throw new RuntimeException("OTP has expired. Please request a new OTP.");
        }
        
        if (!otpData.otp.equals(otp)) {
            throw new RuntimeException("Invalid OTP. Please try again.");
        }
        
        // OTP is valid, remove it
        otpStore.remove(email);
        
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with this email already exists. Please login instead.");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(passwordEncoder.encode(password));
        
        return userRepository.save(user);
    }
    
    // Login with email and password
    public User login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found. Please register first.");
        }
        
        User user = userOpt.get();
        
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException("No password set. Please use 'Forgot Password' to set one.");
        }
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password. Please try again.");
        }
        
        return user;
    }
    
    // Send OTP for password reset
    public void sendForgotPasswordOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("No account found with this email.");
        }
        
        String otp = generateOtp();
        long expiryTime = System.currentTimeMillis() + (10 * 60 * 1000);
        
        otpStore.put("reset_" + email, new OtpData(otp, expiryTime));
        emailService.sendPasswordResetEmail(email, otp);
        
        System.out.println("[DEBUG] Password reset OTP for " + email + ": " + otp);
    }
    
    // Reset password with OTP
    public void resetPassword(String email, String otp, String newPassword) {
        String resetKey = "reset_" + email;
        OtpData otpData = otpStore.get(resetKey);
        
        if (otpData == null) {
            throw new RuntimeException("No reset request found. Please request a new OTP.");
        }
        
        if (System.currentTimeMillis() > otpData.expiryTime) {
            otpStore.remove(resetKey);
            throw new RuntimeException("OTP has expired. Please request a new OTP.");
        }
        
        if (!otpData.otp.equals(otp)) {
            throw new RuntimeException("Invalid OTP. Please try again.");
        }
        
        // OTP is valid
        otpStore.remove(resetKey);
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found.");
        }
        
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    // Check if email exists
    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}

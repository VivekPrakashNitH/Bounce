package com.c4gt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@bouncegame.com}")
    private String fromEmail;
    
    public void sendOtpEmail(String toEmail, String otpCode) {
        if (mailSender == null) {
            // If mail is not configured, log the OTP (for development)
            System.out.println("=== OTP EMAIL (Development Mode) ===");
            System.out.println("To: " + toEmail);
            System.out.println("OTP Code: " + otpCode);
            System.out.println("================================");
            return;
        }
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Your Bounce Game OTP Code");
        message.setText("Your OTP code is: " + otpCode + "\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.");
        
        mailSender.send(message);
    }
}

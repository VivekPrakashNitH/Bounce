package com.c4gt.service;

import com.c4gt.entity.Otp;
import com.c4gt.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class OtpService {
    
    @Autowired
    private OtpRepository otpRepository;
    
    @Autowired
    private EmailService emailService;
    
    private static final Random random = new Random();
    
    /**
     * Generate and send OTP to email
     */
    public String generateAndSendOtp(String email) {
        // Generate 6-digit OTP
        String otpCode = String.format("%06d", random.nextInt(1000000));
        
        // Invalidate previous unused OTPs for this email
        Optional<Otp> existingOtp = otpRepository.findTopByEmailOrderByCreatedAtDesc(email);
        if (existingOtp.isPresent() && !existingOtp.get().isUsed()) {
            Otp prevOtp = existingOtp.get();
            prevOtp.setUsed(true);
            otpRepository.save(prevOtp);
        }
        
        // Create new OTP
        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setOtpCode(otpCode);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpRepository.save(otp);
        
        // Send email
        emailService.sendOtpEmail(email, otpCode);
        
        return otpCode;
    }
    
    /**
     * Verify OTP code
     */
    public boolean verifyOtp(String email, String otpCode) {
        Optional<Otp> otpOpt = otpRepository.findByEmailAndOtpCodeAndUsedFalse(email, otpCode);
        
        if (otpOpt.isEmpty()) {
            return false;
        }
        
        Otp otp = otpOpt.get();
        
        // Check if expired
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }
        
        // Mark as used
        otp.setUsed(true);
        otpRepository.save(otp);
        
        return true;
    }
}

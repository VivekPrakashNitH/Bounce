package com.c4gt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "otps", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_otp_code", columnList = "otpCode")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Otp {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String otpCode;
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(nullable = false)
    private boolean used = false;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // OTP expires in 10 minutes
        expiresAt = LocalDateTime.now().plusMinutes(10);
    }
}

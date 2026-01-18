package com.c4gt.repository;

import com.c4gt.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByEmailAndOtpCodeAndUsedFalse(String email, String otpCode);
    Optional<Otp> findTopByEmailOrderByCreatedAtDesc(String email);
}

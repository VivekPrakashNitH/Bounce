package com.c4gt.service;

import com.c4gt.dto.AuthResponse;
import com.c4gt.dto.UserDTO;
import com.c4gt.entity.User;
import com.c4gt.repository.UserRepository;
import com.c4gt.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final BCryptPasswordEncoder passwordEncoder;

    // SecureRandom instead of Random for cryptographic OTP generation
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Duration OTP_TTL = Duration.ofMinutes(10);

    public AuthService(UserRepository userRepository,
            EmailService emailService,
            JwtTokenProvider jwtTokenProvider,
            StringRedisTemplate redisTemplate,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Generate cryptographically secure 6-digit OTP
     */
    private String generateOtp() {
        int otp = 100000 + SECURE_RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Send OTP for registration — stored in Redis with 10-min TTL
     */
    public void sendOtp(String email) {
        String normalizedEmail = email.toLowerCase().trim();
        String otp = generateOtp();

        // Store in Redis with automatic expiry
        redisTemplate.opsForValue().set("otp:" + normalizedEmail, otp, OTP_TTL);
        emailService.sendOtpEmail(normalizedEmail, otp);

        log.info("OTP sent to: {}", normalizedEmail);
    }

    /**
     * Verify OTP and register user, returning JWT tokens
     */
    public AuthResponse verifyOtpAndRegister(String email, String otp, String name, String password) {
        String normalizedEmail = email.toLowerCase().trim();
        String redisKey = "otp:" + normalizedEmail;

        String storedOtp = redisTemplate.opsForValue().get(redisKey);

        if (storedOtp == null) {
            throw new IllegalArgumentException("No OTP found. Please request a new OTP.");
        }

        if (!storedOtp.equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP. Please try again.");
        }

        // OTP valid — delete it
        redisTemplate.delete(redisKey);

        // Check for existing user
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("Email already registered. Please login instead.");
        }

        // Create user
        User user = new User();
        user.setEmail(normalizedEmail);
        user.setName(name);
        user.setPassword(passwordEncoder.encode(password));
        user = userRepository.save(user);

        log.info("User registered: {}", normalizedEmail);
        return buildAuthResponse(user);
    }

    /**
     * Login — non-revealing error message
     */
    public AuthResponse login(String email, String password) {
        String normalizedEmail = email.toLowerCase().trim();

        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userOpt.get();

        if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        log.info("User logged in: {}", normalizedEmail);
        return buildAuthResponse(user);
    }

    /**
     * Refresh access token using valid refresh token
     */
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String tokenType = jwtTokenProvider.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new IllegalArgumentException("Invalid token type");
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return buildAuthResponse(user);
    }

    /**
     * Send OTP for password reset
     */
    public void sendForgotPasswordOtp(String email) {
        String normalizedEmail = email.toLowerCase().trim();

        if (userRepository.findByEmail(normalizedEmail).isEmpty()) {
            // Don't reveal if email exists — always return success
            log.info("Password reset requested for non-existent email");
            return;
        }

        String otp = generateOtp();
        redisTemplate.opsForValue().set("reset:" + normalizedEmail, otp, OTP_TTL);
        emailService.sendPasswordResetEmail(normalizedEmail, otp);

        log.info("Password reset OTP sent to: {}", normalizedEmail);
    }

    /**
     * Reset password with OTP
     */
    public void resetPassword(String email, String otp, String newPassword) {
        String normalizedEmail = email.toLowerCase().trim();
        String redisKey = "reset:" + normalizedEmail;

        String storedOtp = redisTemplate.opsForValue().get(redisKey);

        if (storedOtp == null) {
            throw new IllegalArgumentException("No reset request found. Please request a new OTP.");
        }

        if (!storedOtp.equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP.");
        }

        redisTemplate.delete(redisKey);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        log.info("Password reset for: {}", normalizedEmail);
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim()).isPresent();
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setAvatar(user.getAvatar());
        dto.setCreatedAt(user.getCreatedAt());

        return new AuthResponse(accessToken, refreshToken, dto);
    }
}

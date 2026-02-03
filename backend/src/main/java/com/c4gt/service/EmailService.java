package com.c4gt.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {
    
    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;
    
    private final HttpClient httpClient = HttpClient.newHttpClient();
    
    public void sendOtpEmail(String to, String otp) {
        try {
            String jsonBody = String.format("""
                {
                    "sender": {"name": "Bounce", "email": "bouncebyvivekprakash@gmail.com"},
                    "to": [{"email": "%s"}],
                    "subject": "Your Bounce OTP Code",
                    "htmlContent": "<h2>Your OTP for Bounce is: <strong>%s</strong></h2><p>This OTP is valid for 10 minutes.</p><p>If you didn't request this, please ignore this email.</p>"
                }
                """, to, otp);
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                .header("api-key", brevoApiKey)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                System.out.println("[INFO] OTP email sent successfully to: " + to);
            } else {
                System.err.println("[ERROR] Brevo API error: " + response.body());
                throw new RuntimeException("Failed to send OTP email: " + response.body());
            }
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send OTP email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    
    public void sendPasswordResetEmail(String to, String otp) {
        try {
            String jsonBody = String.format("""
                {
                    "sender": {"name": "Bounce", "email": "bouncebyvivekprakash@gmail.com"},
                    "to": [{"email": "%s"}],
                    "subject": "Bounce Password Reset OTP",
                    "htmlContent": "<h2>Your password reset OTP is: <strong>%s</strong></h2><p>This OTP is valid for 10 minutes.</p><p>If you didn't request a password reset, please ignore this email.</p>"
                }
                """, to, otp);
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                .header("api-key", brevoApiKey)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                System.out.println("[INFO] Password reset email sent to: " + to);
            } else {
                System.err.println("[ERROR] Brevo API error: " + response.body());
                throw new RuntimeException("Failed to send password reset email: " + response.body());
            }
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send password reset email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
}

package com.c4gt.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${brevo.api-key:}")
    private String brevoApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Async
    public void sendOtpEmail(String to, String otp) {
        if (brevoApiKey == null || brevoApiKey.isEmpty()) {
            log.info("[DEV MODE] OTP email skipped — no API key. To: {}", to);
            return;
        }

        String htmlContent = String.format(
                "<h2>Your OTP for Bounce is: <strong>%s</strong></h2>"
                        + "<p>This OTP is valid for 10 minutes.</p>"
                        + "<p>If you didn't request this, please ignore this email.</p>",
                otp);

        sendEmail(to, "Your Bounce OTP Code", htmlContent);
    }

    @Async
    public void sendPasswordResetEmail(String to, String otp) {
        if (brevoApiKey == null || brevoApiKey.isEmpty()) {
            log.info("[DEV MODE] Password reset email skipped — no API key. To: {}", to);
            return;
        }

        String htmlContent = String.format(
                "<h2>Your password reset OTP is: <strong>%s</strong></h2>"
                        + "<p>This OTP is valid for 10 minutes.</p>"
                        + "<p>If you didn't request a password reset, please ignore this email.</p>",
                otp);

        sendEmail(to, "Bounce Password Reset OTP", htmlContent);
    }

    private void sendEmail(String to, String subject, String htmlContent) {
        try {
            String jsonBody = String.format("""
                    {
                        "sender": {"name": "Bounce", "email": "bouncebyvivekprakash@gmail.com"},
                        "to": [{"email": "%s"}],
                        "subject": "%s",
                        "htmlContent": "%s"
                    }
                    """, to, subject, htmlContent.replace("\"", "\\\""));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("api-key", brevoApiKey)
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Email sent to: {}", to);
            } else {
                log.error("Brevo API error ({}): {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}

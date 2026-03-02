package com.c4gt.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Adds security response headers to all responses.
 *
 * Headers:
 * - X-Content-Type-Options: nosniff — prevents MIME-type sniffing
 * - X-Frame-Options: DENY — prevents clickjacking
 * - X-XSS-Protection: 0 — disable browser XSS filter (CSP is better)
 * - Strict-Transport-Security — enforce HTTPS in production
 * - Content-Security-Policy-Report-Only — CSP in report-only mode initially
 * - Referrer-Policy — limit referrer leakage
 * - Permissions-Policy — restrict browser features
 */
@Component
@Order(3) // After MdcLoggingFilter and RateLimitFilter
public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Prevent MIME-type sniffing
        response.setHeader("X-Content-Type-Options", "nosniff");

        // Prevent clickjacking
        response.setHeader("X-Frame-Options", "DENY");

        // Disable legacy XSS filter (CSP handles this better)
        response.setHeader("X-XSS-Protection", "0");

        // HSTS — enforce HTTPS (1 year, include subdomains)
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

        // CSP — report-only mode for now (Step 56 will enforce)
        response.setHeader("Content-Security-Policy-Report-Only",
                "default-src 'self'; " +
                        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                        "font-src 'self' https://fonts.gstatic.com; " +
                        "img-src 'self' data: blob:; " +
                        "connect-src 'self'; " +
                        "frame-ancestors 'none'");

        // Referrer policy — send origin only on cross-origin
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

        // Permissions policy — restrict browser features
        response.setHeader("Permissions-Policy",
                "camera=(), microphone=(), geolocation=(), payment=()");

        filterChain.doFilter(request, response);
    }
}

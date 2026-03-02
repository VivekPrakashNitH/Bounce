package com.c4gt.config;

import com.c4gt.service.RateLimitService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

/**
 * Rate limiting filter applied to all API requests.
 *
 * Limits:
 * - Auth endpoints (/api/auth/send-otp, /api/auth/login): 5 req/min per IP
 * - General API: 100 req/min per user (authenticated) or per IP (anonymous)
 */
@Component
@Order(2) // After MdcLoggingFilter (order 1), before others
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;

    public RateLimitFilter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();

        // Skip non-API and health check requests
        if (!uri.startsWith("/api") || uri.equals("/actuator/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        boolean allowed;

        // Stricter limits for auth endpoints
        if (uri.contains("/api/auth/send-otp")) {
            allowed = rateLimitService.isAllowed("otp:" + clientIp, 5, Duration.ofMinutes(1));
        } else if (uri.contains("/api/auth/login") || uri.contains("/api/auth/register")) {
            allowed = rateLimitService.isAllowed("auth:" + clientIp, 10, Duration.ofMinutes(1));
        } else {
            // General API: per user or per IP
            String key = resolveKey(clientIp);
            allowed = rateLimitService.isAllowed("api:" + key, 100, Duration.ofMinutes(1));
        }

        if (!allowed) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.setHeader("Retry-After", "60");
            response.getWriter()
                    .write("{\"error\":\"Too many requests\",\"code\":\"RATE_LIMITED\",\"retryAfterSeconds\":60}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String resolveKey(String clientIp) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Long userId) {
            return "user:" + userId;
        }
        return "ip:" + clientIp;
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isEmpty()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

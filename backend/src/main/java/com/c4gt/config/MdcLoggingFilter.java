package com.c4gt.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Populates MDC context for every HTTP request:
 * - requestId: unique per request (for log correlation)
 * - method: HTTP method (GET, POST, etc.)
 * - uri: request path
 * - userId: extracted from JWT auth principal if available
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MdcLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        try {
            MDC.put("requestId", UUID.randomUUID().toString().substring(0, 8));
            MDC.put("method", request.getMethod());
            MDC.put("uri", request.getRequestURI());

            // userId is populated later by JwtAuthFilter if token is valid
            // We set a placeholder here
            MDC.put("userId", "anonymous");

            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}

package com.c4gt.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Distributed tracing filter.
 * Generates or propagates trace IDs across requests.
 * 
 * - Checks for incoming X-Trace-Id header (from frontend or upstream proxy)
 * - Generates UUID if missing
 * - Adds to MDC for structured logging
 * - Returns in response header for client correlation
 */
@Component
@Order(1)
public class TracingFilter extends OncePerRequestFilter {

    public static final String TRACE_HEADER = "X-Trace-Id";
    public static final String SPAN_HEADER = "X-Span-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {
        // Extract or generate trace ID
        String traceId = request.getHeader(TRACE_HEADER);
        if (traceId == null || traceId.isBlank()) {
            traceId = UUID.randomUUID().toString().replace("-", "");
        }

        // Generate span ID (unique per request)
        String spanId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        // Add to MDC for structured logging
        org.slf4j.MDC.put("traceId", traceId);
        org.slf4j.MDC.put("spanId", spanId);

        // Add to response headers
        response.setHeader(TRACE_HEADER, traceId);
        response.setHeader(SPAN_HEADER, spanId);

        try {
            chain.doFilter(request, response);
        } finally {
            org.slf4j.MDC.remove("traceId");
            org.slf4j.MDC.remove("spanId");
        }
    }
}

package com.c4gt.service;

import org.springframework.stereotype.Service;

/**
 * HTML sanitizer for user-generated content.
 * Strips dangerous HTML while allowing basic formatting.
 *
 * Allowed tags: b, i, em, strong, code, pre, a (with href)
 * Everything else is escaped.
 */
@Service
public class InputSanitizer {

    // Simple regex-based sanitizer (for production: use OWASP Java HTML Sanitizer)
    private static final java.util.regex.Pattern DANGEROUS_TAGS = java.util.regex.Pattern.compile(
            "<(?!/?(?:b|i|em|strong|code|pre|a|br)\\b)[^>]+>",
            java.util.regex.Pattern.CASE_INSENSITIVE);

    private static final java.util.regex.Pattern SCRIPT_PATTERN = java.util.regex.Pattern.compile(
            "<script[^>]*>[\\s\\S]*?</script>|<script[^>]*/>",
            java.util.regex.Pattern.CASE_INSENSITIVE);

    private static final java.util.regex.Pattern EVENT_HANDLERS = java.util.regex.Pattern.compile(
            "\\bon\\w+\\s*=",
            java.util.regex.Pattern.CASE_INSENSITIVE);

    /**
     * Sanitize user input — remove dangerous HTML, scripts, and event handlers.
     */
    public String sanitize(String input) {
        if (input == null)
            return null;
        if (input.isBlank())
            return input;

        String result = input;

        // 1. Remove script tags entirely
        result = SCRIPT_PATTERN.matcher(result).replaceAll("");

        // 2. Remove event handlers (onclick, onerror, etc.)
        result = EVENT_HANDLERS.matcher(result).replaceAll("");

        // 3. Remove non-whitelisted HTML tags
        result = DANGEROUS_TAGS.matcher(result)
                .replaceAll(match -> match.group().replace("<", "&lt;").replace(">", "&gt;"));

        // 4. Limit length
        if (result.length() > 5000) {
            result = result.substring(0, 5000);
        }

        return result.trim();
    }

    /**
     * Strict sanitize — no HTML allowed at all (for names, emails, etc.)
     */
    public String stripAll(String input) {
        if (input == null)
            return null;
        return input.replaceAll("<[^>]+>", "").trim();
    }
}

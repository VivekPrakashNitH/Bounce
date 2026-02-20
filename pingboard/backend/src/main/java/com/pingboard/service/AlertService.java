package com.pingboard.service;

import com.pingboard.entity.AlertChannel;
import com.pingboard.entity.Monitor;
import com.pingboard.repository.AlertChannelRepository;
import com.pingboard.repository.MonitorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    private final AlertChannelRepository alertChannelRepository;

    public AlertService(AlertChannelRepository alertChannelRepository) {
        this.alertChannelRepository = alertChannelRepository;
    }

    @Async
    public void sendDownAlert(Monitor monitor, String cause) {
        List<AlertChannel> channels = alertChannelRepository
                .findByUserIdAndIsActiveTrue(monitor.getUserId());

        for (AlertChannel channel : channels) {
            try {
                switch (channel.getChannelType()) {
                    case "email" -> sendEmailAlert(channel, monitor, cause, false);
                    case "webhook" -> sendWebhookAlert(channel, monitor, cause, false);
                    case "slack" -> sendSlackAlert(channel, monitor, cause, false);
                    default -> log.warn("Unknown alert channel type: {}", channel.getChannelType());
                }
            } catch (Exception e) {
                log.error("Failed to send alert via {}: {}", channel.getChannelType(), e.getMessage());
            }
        }
    }

    @Async
    public void sendRecoveryAlert(Monitor monitor, long downtimeSeconds) {
        List<AlertChannel> channels = alertChannelRepository
                .findByUserIdAndIsActiveTrue(monitor.getUserId());

        String cause = "Recovered after " + formatDuration(downtimeSeconds) + " of downtime";

        for (AlertChannel channel : channels) {
            try {
                switch (channel.getChannelType()) {
                    case "email" -> sendEmailAlert(channel, monitor, cause, true);
                    case "webhook" -> sendWebhookAlert(channel, monitor, cause, true);
                    case "slack" -> sendSlackAlert(channel, monitor, cause, true);
                    default -> log.warn("Unknown alert channel type: {}", channel.getChannelType());
                }
            } catch (Exception e) {
                log.error("Failed to send recovery alert via {}: {}", channel.getChannelType(), e.getMessage());
            }
        }
    }

    private void sendEmailAlert(AlertChannel channel, Monitor monitor, String cause, boolean isRecovery) {
        String email = (String) channel.getConfig().get("email");
        if (email == null) {
            log.warn("Email alert channel {} has no email configured", channel.getId());
            return;
        }

        String status = isRecovery ? "✅ RECOVERED" : "🔴 DOWN";
        log.info("EMAIL ALERT to {}: {} — {} ({}): {}",
                email, status, monitor.getName(), monitor.getUrl(), cause);

        // TODO: Integrate with Spring Mail when SMTP is configured
        // For now, log the alert (production would send actual email)
    }

    private void sendWebhookAlert(AlertChannel channel, Monitor monitor, String cause, boolean isRecovery) {
        String url = (String) channel.getConfig().get("url");
        if (url == null) {
            log.warn("Webhook alert channel {} has no URL configured", channel.getId());
            return;
        }

        String status = isRecovery ? "recovered" : "down";
        log.info("WEBHOOK ALERT to {}: {} — {} ({}): {}",
                url, status, monitor.getName(), monitor.getUrl(), cause);

        // TODO: Send HTTP POST to webhook URL with JSON payload
    }

    private void sendSlackAlert(AlertChannel channel, Monitor monitor, String cause, boolean isRecovery) {
        String webhookUrl = (String) channel.getConfig().get("webhook_url");
        if (webhookUrl == null) {
            log.warn("Slack alert channel {} has no webhook_url configured", channel.getId());
            return;
        }

        String status = isRecovery ? "✅ RECOVERED" : "🔴 DOWN";
        log.info("SLACK ALERT to webhook: {} — {} ({}): {}",
                status, monitor.getName(), monitor.getUrl(), cause);

        // TODO: Send Slack incoming webhook with rich message
    }

    private String formatDuration(long seconds) {
        if (seconds < 60)
            return seconds + "s";
        if (seconds < 3600)
            return (seconds / 60) + "m " + (seconds % 60) + "s";
        return (seconds / 3600) + "h " + ((seconds % 3600) / 60) + "m";
    }
}

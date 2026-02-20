const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
}

class ApiClient {
    private getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    private setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;

        const token = this.getToken();
        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers,
        };

        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        let response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        // If 401 and we have a refresh token, try refreshing
        if (response.status === 401 && this.getRefreshToken()) {
            const refreshed = await this.tryRefresh();
            if (refreshed) {
                // Retry original request with new token
                requestHeaders['Authorization'] = `Bearer ${this.getToken()}`;
                response = await fetch(`${API_BASE}${endpoint}`, {
                    method,
                    headers: requestHeaders,
                    body: body ? JSON.stringify(body) : undefined,
                });
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `Request failed: ${response.status}`);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return undefined as T;
        }

        return response.json();
    }

    private async tryRefresh(): Promise<boolean> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${API_BASE}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                this.clearTokens();
                return false;
            }

            const data = await response.json();
            this.setTokens(data.accessToken, data.refreshToken);
            return true;
        } catch {
            this.clearTokens();
            return false;
        }
    }

    // Auth
    async register(email: string, password: string, name: string) {
        const data = await this.request<{
            accessToken: string;
            refreshToken: string;
            user: { id: number; email: string; name: string };
        }>('/auth/register', {
            method: 'POST',
            body: { email, password, name },
        });
        this.setTokens(data.accessToken, data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    async login(email: string, password: string) {
        const data = await this.request<{
            accessToken: string;
            refreshToken: string;
            user: { id: number; email: string; name: string };
        }>('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        this.setTokens(data.accessToken, data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    // Monitors
    async getMonitors() {
        return this.request<MonitorResponse[]>('/monitors');
    }

    async createMonitor(data: CreateMonitorRequest) {
        return this.request<MonitorResponse>('/monitors', { method: 'POST', body: data });
    }

    async updateMonitor(id: number, data: CreateMonitorRequest) {
        return this.request<MonitorResponse>(`/monitors/${id}`, { method: 'PUT', body: data });
    }

    async deleteMonitor(id: number) {
        return this.request<void>(`/monitors/${id}`, { method: 'DELETE' });
    }

    async toggleMonitor(id: number) {
        return this.request<MonitorResponse>(`/monitors/${id}/toggle`, { method: 'PATCH' });
    }

    async getMonitor(id: number) {
        return this.request<MonitorResponse>(`/monitors/${id}`);
    }

    // Health Checks
    async getChecks(monitorId: number, hours = 24) {
        return this.request<HealthCheckResponse[]>(`/monitors/${monitorId}/checks?hours=${hours}`);
    }

    async getUptime(monitorId: number, days = 30) {
        return this.request<UptimeResponse>(`/monitors/${monitorId}/checks/uptime?days=${days}`);
    }

    // Status Page (public)
    async getStatusPage(userId: number) {
        return this.request<StatusPageResponse>(`/status/${userId}`);
    }
}

// Types
export interface MonitorResponse {
    id: number;
    name: string;
    url: string;
    method: string;
    intervalSeconds: number;
    timeoutMs: number;
    expectedStatus: number;
    isActive: boolean;
    currentlyUp: boolean | null;
    uptimePercent: number;
    avgResponseMs: number;
    lastCheckedAt: string | null;
    createdAt: string;
}

export interface CreateMonitorRequest {
    name: string;
    url: string;
    method?: string;
    intervalSeconds?: number;
    timeoutMs?: number;
    expectedStatus?: number;
}

export interface HealthCheckResponse {
    id: number;
    statusCode: number | null;
    responseTimeMs: number;
    isUp: boolean;
    errorMessage: string | null;
    checkedAt: string;
}

export interface UptimeResponse {
    uptimePercent: number;
    avgResponseMs: number;
    totalChecks: number;
    periodDays: number;
}

export interface StatusPageResponse {
    owner: string;
    monitors: Array<{
        name: string;
        isUp: boolean;
        uptimePercent: number;
    }>;
}

export const api = new ApiClient();

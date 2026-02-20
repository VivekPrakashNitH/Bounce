/**
 * JWT-aware API client for Bounce platform.
 * 
 * Features:
 * - Auto-attaches JWT Authorization header
 * - Auto-refreshes access token on 401
 * - Typed response handling
 * - Centralized error handling
 */

const API_BASE = '/api';

// --- Token Management ---

export function getAccessToken(): string | null {
    return localStorage.getItem('bounce_access_token');
}

export function getRefreshToken(): string | null {
    return localStorage.getItem('bounce_refresh_token');
}

export function setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('bounce_access_token', accessToken);
    localStorage.setItem('bounce_refresh_token', refreshToken);
}

export function clearTokens(): void {
    localStorage.removeItem('bounce_access_token');
    localStorage.removeItem('bounce_refresh_token');
    localStorage.removeItem('bounce_user');
}

export function getStoredUser(): UserData | null {
    const raw = localStorage.getItem('bounce_user');
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function setStoredUser(user: UserData): void {
    localStorage.setItem('bounce_user', JSON.stringify(user));
}

// --- Types ---

export interface UserData {
    id: number;
    email: string;
    name: string;
    avatar?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserData;
}

export interface ApiError {
    error: string;
}

// --- Core Fetch Wrapper ---

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            clearTokens();
            return false;
        }

        const data: AuthResponse = await res.json();
        setTokens(data.accessToken, data.refreshToken);
        setStoredUser(data.user);
        return true;
    } catch {
        clearTokens();
        return false;
    }
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    const token = getAccessToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    // Auto-refresh on 401
    if (res.status === 401 && token) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshAccessToken();
        }

        const refreshed = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        if (refreshed) {
            headers['Authorization'] = `Bearer ${getAccessToken()}`;
            res = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers,
            });
        } else {
            // Redirect to login
            window.location.href = '/';
            throw new Error('Session expired');
        }
    }

    if (!res.ok) {
        const error: ApiError = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
}

// --- Auth API ---

export async function login(email: string, password: string): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    setTokens(data.accessToken, data.refreshToken);
    setStoredUser(data.user);
    return data;
}

export async function register(
    email: string, otp: string, name: string, password: string
): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp, name, password }),
    });
    setTokens(data.accessToken, data.refreshToken);
    setStoredUser(data.user);
    return data;
}

export async function sendOtp(email: string): Promise<{ message: string }> {
    return apiFetch('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

export function logout(): void {
    clearTokens();
    window.location.href = '/';
}



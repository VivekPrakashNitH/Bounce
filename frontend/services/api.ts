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

// --- Level Comment Types ---

export interface LevelComment {
    id: number;
    content: string;
    levelId: string;
    author: string;
    authorEmail?: string;
    authorAvatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentRequest {
    content: string;
    levelId: string;
    author: string;
    authorEmail?: string;
    authorAvatar?: string;
}

// --- Level Comments API ---

export const levelCommentApi = {
    async getComments(levelId: string): Promise<LevelComment[]> {
        return apiFetch<LevelComment[]>(`/level-comments/${encodeURIComponent(levelId)}`, {
            method: 'GET',
        });
    },

    async createComment(request: CreateCommentRequest): Promise<LevelComment> {
        return apiFetch<LevelComment>('/level-comments', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    async deleteComment(id: number): Promise<void> {
        await apiFetch<void>(`/level-comments/${id}`, {
            method: 'DELETE',
        });
    },
};

// --- Extended Auth API ---

export async function forgotPassword(email: string): Promise<{ message: string }> {
    return apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    return apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
    });
}

export async function getUserByEmail(email: string): Promise<UserData | null> {
    try {
        return await apiFetch<UserData>(`/auth/user/${encodeURIComponent(email)}`, {
            method: 'GET',
        });
    } catch {
        return null;
    }
}

export async function checkEmailExists(email: string): Promise<boolean> {
    try {
        const data = await apiFetch<{ exists: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`, {
            method: 'GET',
        });
        return data.exists || false;
    } catch {
        return false;
    }
}

// --- Legacy authApi object (for backward compatibility with AuthModal) ---

export interface LegacyAuthResponse {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    message?: string;
}

export const authApi = {
    sendOtp: sendOtp,
    verifyOtpAndRegister: async (request: { email: string; otp: string; name?: string; password?: string }): Promise<LegacyAuthResponse> => {
        const result = await register(request.email, request.otp, request.name || '', request.password || '');
        return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            avatar: result.user.avatar,
            message: 'Registration successful',
        };
    },
    login: async (email: string, password: string): Promise<LegacyAuthResponse> => {
        const result = await login(email, password);
        return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            avatar: result.user.avatar,
            message: 'Login successful',
        };
    },
    forgotPassword,
    resetPassword,
    getUserByEmail,
    checkEmailExists,
};

// --- Project API (Evolving Project) ---

export interface ProjectStageDTO {
    stageId: string;
    status: 'locked' | 'in_progress' | 'completed';
    startedAt: string | null;
    completedAt: string | null;
}

export interface UserProjectDTO {
    id: number;
    currentStage: string;
    projectName: string;
    startedAt: string;
    lastActiveAt: string;
    stages: ProjectStageDTO[];
}

export const projectApi = {
    init: (): Promise<UserProjectDTO> =>
        apiFetch('/v1/projects/init', { method: 'POST' }),

    getMyProject: (): Promise<UserProjectDTO> =>
        apiFetch('/v1/projects/me'),

    advanceStage: (stageId: string): Promise<UserProjectDTO> =>
        apiFetch('/v1/projects/me/stage', {
            method: 'PUT',
            body: JSON.stringify({ stageId }),
        }),

    submitCode: (stageId: string, codeContent: string, notes?: string): Promise<void> =>
        apiFetch('/v1/projects/me/submit', {
            method: 'POST',
            body: JSON.stringify({ stageId, codeContent, notes }),
        }),
};

// --- Engagement API ---

export interface EngagementSummary {
    totalPagesVisited: number;
    totalActiveTimeMs: number;
    averageScrollDepth: number;
    dropoffCount: number;
    retryCount: number;
}

export const engagementApi = {
    submitBatch: (events: Array<{
        eventType: string; pageId: string; timestamp: number;
        sectionId?: string; duration?: number; scrollDepth?: number;
        metadata?: Record<string, unknown>;
    }>, sessionId?: string): Promise<void> =>
        apiFetch('/v1/engagement/batch', {
            method: 'POST',
            body: JSON.stringify({ events, sessionId }),
        }),

    submitPageTime: (pageId: string, activeTimeMs: number, totalTimeMs: number, tabSwitches: number): Promise<void> =>
        apiFetch('/v1/engagement/page-time', {
            method: 'POST',
            body: JSON.stringify({ pageId, activeTimeMs, totalTimeMs, tabSwitches }),
        }),

    submitSectionTime: (pageId: string, sectionId: string, activeTimeMs: number, visibilityPercent: number): Promise<void> =>
        apiFetch('/v1/engagement/section-time', {
            method: 'POST',
            body: JSON.stringify({ pageId, sectionId, activeTimeMs, visibilityPercent }),
        }),

    submitDropoff: (pageId: string, lastSectionSeen: string | null, scrollDepthPercent: number, timeSpentMs: number): Promise<void> =>
        apiFetch('/v1/engagement/dropoff', {
            method: 'POST',
            body: JSON.stringify({ pageId, lastSectionSeen, scrollDepthPercent, timeSpentMs, referrer: document.referrer }),
        }),

    submitRetry: (pageId: string, attemptNumber: number, opts?: { sectionId?: string; quizId?: string; previousResult?: string }): Promise<void> =>
        apiFetch('/v1/engagement/retry', {
            method: 'POST',
            body: JSON.stringify({ pageId, attemptNumber, ...opts }),
        }),

    getSummary: (): Promise<EngagementSummary> =>
        apiFetch('/v1/engagement/summary'),
};

// ── Session Management ──────────────────────────────
export const sessionApi = {
    list: (): Promise<{ sessions: Array<{ id: number; device_info: string; ip_address: string; last_active_at: string; created_at: string }> }> =>
        apiFetch('/v1/auth/sessions'),

    revoke: (sessionId: number): Promise<void> =>
        apiFetch(`/v1/auth/sessions/${sessionId}`, { method: 'DELETE' }),
};

// ── Feature Flags ───────────────────────────────────
export const flagsApi = {
    getAll: (): Promise<Record<string, boolean>> =>
        apiFetch('/v1/flags'),
};

// ── GDPR User Data ──────────────────────────────────
export const userDataApi = {
    export: (): Promise<Record<string, unknown>> =>
        apiFetch('/v1/user/data/export'),

    delete: (): Promise<{ totalRecordsDeleted: number }> =>
        apiFetch('/v1/user/data/delete', {
            method: 'DELETE',
            body: JSON.stringify({ confirmed: true }),
        }),
};

// ── Server-Side Progress ────────────────────────────
export const progressApi = {
    get: (): Promise<{ levels: Array<{ level_id: string; completed: boolean; score: number }> }> =>
        apiFetch('/v1/progress/me'),

    update: (levelId: string, completed: boolean, score: number, metadata?: Record<string, unknown>): Promise<void> =>
        apiFetch('/v1/progress/update', {
            method: 'POST',
            body: JSON.stringify({ levelId, completed, score, metadata }),
        }),

    sync: (levels: Array<{ levelId: string; completed: boolean; score: number }>): Promise<{ synced: number }> =>
        apiFetch('/v1/progress/sync', {
            method: 'POST',
            body: JSON.stringify({ levels }),
        }),
};

// ── Learning Path ───────────────────────────────────
export const learningApi = {
    getNextRecommendation: (): Promise<{ nextLevel: string; reason: string; prerequisitesMet: boolean }> =>
        apiFetch('/v1/recommendations/next'),

    getMastery: (conceptId: string): Promise<{ conceptId: string; totalScore: number; tier: string; breakdown: Record<string, number> }> =>
        apiFetch(`/v1/mastery/${conceptId}`),
};


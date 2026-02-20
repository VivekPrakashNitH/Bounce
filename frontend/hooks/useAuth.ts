import { useState, useCallback, useEffect } from 'react';
import {
    login as apiLogin,
    register as apiRegister,
    sendOtp as apiSendOtp,
    logout as apiLogout,
    getStoredUser,
    getAccessToken,
    type UserData,
    type AuthResponse,
} from '../services/api';

interface UseAuthReturn {
    user: UserData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (email: string, otp: string, name: string, password: string) => Promise<AuthResponse>;
    sendOtp: (email: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Restore session on mount
    useEffect(() => {
        const stored = getStoredUser();
        const token = getAccessToken();
        if (stored && token) {
            setUser(stored);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiLogin(email, password);
            setUser(data.user);
            return data;
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Login failed';
            setError(message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (
        email: string, otp: string, name: string, password: string
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiRegister(email, otp, name, password);
            setUser(data.user);
            return data;
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Registration failed';
            setError(message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendOtp = useCallback(async (email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await apiSendOtp(email);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Failed to send OTP';
            setError(message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        apiLogout();
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        user,
        isAuthenticated: !!user && !!getAccessToken(),
        isLoading,
        error,
        login,
        register,
        sendOtp,
        logout,
        clearError,
    };
}

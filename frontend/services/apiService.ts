// API Service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bounce-bvtj.onrender.com/api';

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

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  levelId: string;
  author: string;
  authorEmail?: string;
  authorAvatar?: string;
}

export interface GoogleAuthRequest {
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
}

export interface GitHubAuthRequest {
  email: string;
  name: string;
  avatar?: string;
  githubId?: string;
}

// Level Comments API
export const levelCommentApi = {
  async getComments(levelId: string): Promise<LevelComment[]> {
    const response = await fetch(`${API_BASE_URL}/level-comments/${encodeURIComponent(levelId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }
    
    return response.json();
  },

  async createComment(request: CreateCommentRequest): Promise<LevelComment> {
    const response = await fetch(`${API_BASE_URL}/level-comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create comment: ${response.statusText}`);
    }
    
    return response.json();
  },

  async deleteComment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/level-comments/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`);
    }
  },
};

// OTP Auth Request/Response types
export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  name?: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  message?: string;
}

// Auth API with OTP support
export const authApi = {
  // Send OTP to email (for registration or password reset)
  async sendOtp(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to send OTP');
    }
    
    return response.json();
  },

  // Verify OTP and register new user
  async verifyOtpAndRegister(request: VerifyOtpRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'OTP verification failed');
    }
    
    return response.json();
  },

  // Login with email and password
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }
    
    return response.json();
  },

  // Send OTP for password reset
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to send reset OTP');
    }
    
    return response.json();
  },

  // Reset password with OTP
  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Password reset failed');
    }
    
    return response.json();
  },

  // Get user by email (to check if user exists)
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return null;
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  // Check if email exists (returns true/false)
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Failed to check email:', error);
      return false;
    }
  },
};

// API Service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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

// Auth API
export const authApi = {
  async googleAuth(request: GoogleAuthRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to authenticate: ${response.statusText}`);
    }
    
    return response.json();
  },

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

  async githubAuth(request: GitHubAuthRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to authenticate: ${response.statusText}`);
    }
    
    return response.json();
  },
};

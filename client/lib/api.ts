import { config, apiEndpoints } from '@shared/config';
import { ApiResponse, PaginatedResponse } from '@shared/types';

// API Client class for handling all API requests
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get authorization header if token exists
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token 
      ? { ...this.defaultHeaders, Authorization: `Bearer ${token}` }
      : this.defaultHeaders;
  }

  // Generic request method
  private async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  // GET request
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  auth = {
    requestVerification: (username: string) =>
      this.post('/auth/request-verification', { username }),
    
    verifyCode: (username: string, code: string) =>
      this.post('/auth/verify-code', { username, code }),
    
    getStatus: () => this.get('/auth/status'),
    
    logout: () => this.post('/auth/logout'),
  };

  // Player methods
  players = {
    getAll: (params?: { page?: number; limit?: number; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.append('page', params.page.toString());
      if (params?.limit) query.append('limit', params.limit.toString());
      if (params?.search) query.append('search', params.search);
      
      return this.get(`/players?${query.toString()}`);
    },
    
    getOnline: () => this.get('/players/online'),
    
    getById: (id: string) => this.get(`/players/${id}`),
    
    updateRank: (id: string, rank: string) =>
      this.patch(`/players/${id}/rank`, { rank }),
  };

  // Server methods
  server = {
    getStatus: () => this.get('/server/status'),
    
    executeRcon: (command: string, args?: string[]) =>
      this.post('/server/rcon', { command, args }),
    
    restart: () => this.post('/server/restart'),
    
    stop: () => this.post('/server/stop'),
    
    createBackup: () => this.post('/server/backup'),
    
    getActions: () => this.get('/server/actions'),
  };

  // Store methods
  store = {
    getItems: (params?: { category?: string; popular?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.popular) query.append('popular', 'true');
      
      return this.get(`/store/items?${query.toString()}`);
    },
    
    getItem: (id: string) => this.get(`/store/items/${id}`),
    
    createPurchase: (itemId: string, playerId: string) =>
      this.post('/store/purchase', { itemId, playerId }),
    
    getPurchases: (params?: { playerId?: string; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.playerId) query.append('playerId', params.playerId);
      if (params?.status) query.append('status', params.status);
      
      return this.get(`/store/purchases?${query.toString()}`);
    },
    
    retryDelivery: (purchaseId: string) =>
      this.post(`/store/purchases/${purchaseId}/retry`),
  };

  // Leaderboard methods
  leaderboards = {
    getAll: () => this.get('/leaderboards'),
    
    get: (type: string, limit?: number) => {
      const query = limit ? `?limit=${limit}` : '';
      return this.get(`/leaderboards/${type}${query}`);
    },
    
    getPlayerRanking: (type: string, playerId: string) =>
      this.get(`/leaderboards/${type}/player/${playerId}`),
    
    update: (type: string, entries: any[]) =>
      this.post(`/leaderboards/${type}`, { entries }),
  };

  // Plugin methods
  plugins = {
    getAll: (enabled?: boolean) => {
      const query = enabled !== undefined ? `?enabled=${enabled}` : '';
      return this.get(`/plugins${query}`);
    },
    
    get: (id: string) => this.get(`/plugins/${id}`),
    
    toggle: (id: string, enabled: boolean) =>
      this.patch(`/plugins/${id}/toggle`, { enabled }),
    
    reload: (id: string) => this.post(`/plugins/${id}/reload`),
    
    getCommands: (id: string) => this.get(`/plugins/${id}/commands`),
    
    getPermissions: (id: string) => this.get(`/plugins/${id}/permissions`),
  };
}

// Create singleton instance
export const api = new ApiClient();

// Export individual endpoint configurations for direct usage
export { apiEndpoints, config };

// Utility functions for common API patterns
export const handleApiError = (response: ApiResponse<any>, fallbackMessage = 'An error occurred') => {
  if (!response.success) {
    console.error('API Error:', response.error);
    return response.error || fallbackMessage;
  }
  return null;
};

export const handleApiSuccess = <T>(response: ApiResponse<T>) => {
  if (response.success && response.data) {
    return response.data;
  }
  return null;
};

// Hook for API loading states
export const useApiState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T>(apiCall: Promise<ApiResponse<T>>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall;
      const errorMessage = handleApiError(response);
      
      if (errorMessage) {
        setError(errorMessage);
        return null;
      }
      
      return handleApiSuccess(response);
    } catch (err) {
      setError('Network error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};

export default api;

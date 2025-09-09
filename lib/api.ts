const BASE_URL = 'http://localhost:8080/api';

interface ApiResponse<T> {
  data?: T;
  issues?: T;
  users?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class AdminApiService {
  private async getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Authentication
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem('authToken');
  }

  // Issues
  async getIssues(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters?.category && filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters?.priority && filters.priority !== 'all') queryParams.append('priority', filters.priority);
      if (filters?.search) queryParams.append('search', filters.search);

      const response = await fetch(
        `${BASE_URL}/issues?${queryParams.toString()}`,
        {
          headers: await this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }

      return await response.json();
    } catch (error) {
      console.error('Get issues error:', error);
      throw error;
    }
  }

  async getIssueById(id: string) {
    try {
      const response = await fetch(`${BASE_URL}/issues/${id}`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch issue');
      }

      return await response.json();
    } catch (error) {
      console.error('Get issue error:', error);
      throw error;
    }
  }

  async updateIssue(id: string, updates: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
  }) {
    try {
      const response = await fetch(`${BASE_URL}/issues/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update issue');
      }

      return await response.json();
    } catch (error) {
      console.error('Update issue error:', error);
      throw error;
    }
  }

  async deleteIssue(id: string) {
    try {
      const response = await fetch(`${BASE_URL}/issues/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete issue');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete issue error:', error);
      throw error;
    }
  }

  // Users
  async getUsers(filters?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.role && filters.role !== 'all') queryParams.append('role', filters.role);
      if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters?.search) queryParams.append('search', filters.search);

      const response = await fetch(
        `${BASE_URL}/users?${queryParams.toString()}`,
        {
          headers: await this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    status?: string;
  }) {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Statistics
  async getStats() {
    try {
      const response = await fetch(`${BASE_URL}/issues/stats/overview`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  }
}

export default new AdminApiService();
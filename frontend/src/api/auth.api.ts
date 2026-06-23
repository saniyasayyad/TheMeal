import client from './client'
import type { AuthResponse, User, UserPreferences } from '../types/user.types'
import type { ApiResponse } from '../types/api.types'

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    client.post<ApiResponse<AuthResponse>>('/auth/signup', { name, email, password }),

  login: (email: string, password: string) =>
    client.post<ApiResponse<AuthResponse>>('/auth/login', { email, password }),

  logout: () => client.post('/auth/logout'),

  getMe: () => client.get<ApiResponse<{ user: User }>>('/auth/me'),

  updatePreferences: (prefs: UserPreferences) =>
    client.put<ApiResponse<{ user: User }>>('/auth/preferences', prefs),
}

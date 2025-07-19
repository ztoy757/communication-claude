import { api, saveToken, removeToken } from './api';
import { mockApiService } from './mockApi';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

// 開発環境ではモックAPIを使用
const USE_MOCK_API = true;

export const authService = {
  // ログイン
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      const response = await mockApiService.login(credentials.email, credentials.password);
      await saveToken(response.token);
      return response;
    }
    
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    await saveToken(response.data.token);
    return response.data;
  },

  // 新規登録
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      const response = await mockApiService.register(userData.username, userData.email, userData.password);
      await saveToken(response.token);
      return response;
    }
    
    const response = await api.post<AuthResponse>('/auth/register', userData);
    await saveToken(response.data.token);
    return response.data;
  },

  // ログアウト
  async logout(): Promise<void> {
    await removeToken();
  },

  // 現在のユーザー情報取得
  async getCurrentUser(): Promise<any> {
    try {
      if (USE_MOCK_API) {
        return await mockApiService.getCurrentUser();
      }
      
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API基本設定
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';

// Axiosインスタンス作成
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（認証トークン追加）
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 認証エラーの場合、トークンを削除してログイン画面へ
      await AsyncStorage.removeItem('authToken');
      // ここでナビゲーションを行う場合は、別途処理が必要
    }
    return Promise.reject(error);
  }
);

// トークン保存
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem('authToken', token);
};

// トークン削除
export const removeToken = async () => {
  await AsyncStorage.removeItem('authToken');
};

// トークン取得
export const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};
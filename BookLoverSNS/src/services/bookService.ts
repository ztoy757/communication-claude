import { api } from './api';
import { mockApiService } from './mockApi';
import { Book, BookReadingStatus, Review } from '../types';

// 開発環境ではモックAPIを使用
const USE_MOCK_API = true;

export const bookService = {
  // 書籍検索
  async searchBooks(query: string, limit = 10, offset = 0): Promise<Book[]> {
    if (USE_MOCK_API) {
      return await mockApiService.searchBooks(query);
    }
    
    const response = await api.get<Book[]>('/books', {
      params: { query, limit, offset },
    });
    return response.data;
  },

  // 書籍詳細取得
  async getBook(bookId: string): Promise<Book> {
    if (USE_MOCK_API) {
      return await mockApiService.getBook(bookId);
    }
    
    const response = await api.get<Book>(`/books/${bookId}`);
    return response.data;
  },

  // 書籍登録
  async createBook(bookData: Partial<Book>): Promise<Book> {
    const response = await api.post<Book>('/books', bookData);
    return response.data;
  },

  // 今日の一冊取得
  async getTodaysBook(): Promise<Book> {
    if (USE_MOCK_API) {
      return await mockApiService.getTodaysBook();
    }
    
    const response = await api.get<Book>('/books/today');
    return response.data;
  },

  // ユーザーの読書状況取得
  async getUserReadingStatus(userId: string, status?: string): Promise<BookReadingStatus[]> {
    if (USE_MOCK_API) {
      return await mockApiService.getUserReadingStatus(userId, status);
    }
    
    const response = await api.get<BookReadingStatus[]>(`/users/${userId}/reading-status`, {
      params: { status },
    });
    return response.data;
  },

  // 読書状況更新
  async updateReadingStatus(userId: string, statusData: any): Promise<BookReadingStatus> {
    if (USE_MOCK_API) {
      return await mockApiService.updateReadingStatus(userId, statusData);
    }
    
    const response = await api.post<BookReadingStatus>(
      `/users/${userId}/reading-status`,
      statusData
    );
    return response.data;
  },

  // 書籍のレビュー取得
  async getBookReviews(bookId: string, limit = 10, offset = 0): Promise<Review[]> {
    // モックAPIでは空配列を返す
    if (USE_MOCK_API) {
      return [];
    }
    
    const response = await api.get<Review[]>(`/books/${bookId}/reviews`, {
      params: { limit, offset },
    });
    return response.data;
  },

  // レビュー投稿
  async postReview(bookId: string, reviewData: any): Promise<Review> {
    if (USE_MOCK_API) {
      return await mockApiService.postReview(bookId, reviewData);
    }
    
    const response = await api.post<Review>(`/books/${bookId}/reviews`, reviewData);
    return response.data;
  },

  // リアクション追加
  async addReaction(reviewId: string, reactionType: string): Promise<void> {
    if (USE_MOCK_API) {
      return; // モックでは何もしない
    }
    
    await api.post(`/reviews/${reviewId}/reactions`, { reactionType });
  },
};
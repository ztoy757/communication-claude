import { Book, BookReadingStatus, Review, User, AuthResponse } from '../types';

// モックデータ
const mockBooks: Book[] = [
  {
    bookId: '978-4-06-123456-7',
    title: '銀河鉄道の夜',
    author: '宮沢賢治',
    publisher: '新潮社',
    publicationYear: 1927,
    synopsis: 'ジョバンニが銀河鉄道に乗って旅をする幻想的な物語。',
    coverImageUrl: 'https://placehold.co/128x192/2D3748/E2E8F0?text=銀河鉄道',
    genre: '幻想文学',
    createdAt: '2023-01-05T15:00:00Z',
  },
  {
    bookId: '978-4-10-100001-1',
    title: 'ノルウェイの森',
    author: '村上春樹',
    publisher: '講談社',
    publicationYear: 1987,
    synopsis: '青春の喪失と愛の物語を描いた代表作。',
    coverImageUrl: 'https://placehold.co/128x192/2D3748/E2E8F0?text=ノルウェイ',
    genre: '現代文学',
    createdAt: '2023-01-05T15:00:00Z',
  },
  {
    bookId: '978-4-04-100002-2',
    title: '君の名は。',
    author: '新海誠',
    publisher: 'KADOKAWA',
    publicationYear: 2016,
    synopsis: '時空を超えた青春恋愛ストーリー。',
    coverImageUrl: 'https://placehold.co/128x192/2D3748/E2E8F0?text=君の名は',
    genre: 'SF恋愛',
    createdAt: '2023-01-05T15:00:00Z',
  },
];

const mockUser: User = {
  userId: 'user123',
  username: 'booklover_taro',
  email: 'taro@example.com',
  profileBio: 'SFとミステリーをこよなく愛する読書家です。',
  preferredGenres: ['SF', 'ミステリー', 'ファンタジー'],
  readingLevel: 'ADVANCED',
  readingStyle: '多読派',
  isPublicProfile: true,
  createdAt: '2023-01-01T10:00:00Z',
  lastLoginAt: '2023-06-27T18:30:00Z',
};

let mockReadingStatus: BookReadingStatus[] = [
  {
    statusId: 'status_1',
    userId: 'user123',
    bookId: '978-4-06-123456-7',
    book: mockBooks[0],
    status: 'READING',
    currentPage: 120,
    startDate: '2023-06-01',
    readingTimeMinutes: 720,
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2023-06-20T14:00:00Z',
  },
  {
    statusId: 'status_2',
    userId: 'user123',
    bookId: '978-4-10-100001-1',
    book: mockBooks[1],
    status: 'FINISHED',
    finishDate: '2023-05-25',
    readingTimeMinutes: 1200,
    moodAtFinish: '感動した',
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-25T14:00:00Z',
  },
  {
    statusId: 'status_3',
    userId: 'user123',
    bookId: '978-4-04-100002-2',
    book: mockBooks[2],
    status: 'WANT_TO_READ',
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2023-06-15T10:00:00Z',
  },
];

// モック認証トークン
let isAuthenticated = false;

// モックAPIサービス
export const mockApiService = {
  // 認証関連
  async login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password') {
          isAuthenticated = true;
          resolve({
            token: 'mock_jwt_token_12345',
            userId: mockUser.userId,
            username: mockUser.username,
          });
        } else {
          reject(new Error('ログイン情報が正しくありません'));
        }
      }, 1000);
    });
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        isAuthenticated = true;
        resolve({
          token: 'mock_jwt_token_12345',
          userId: mockUser.userId,
          username,
        });
      }, 1000);
    });
  },

  async getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isAuthenticated) {
          resolve(mockUser);
        } else {
          reject(new Error('認証が必要です'));
        }
      }, 500);
    });
  },

  // 書籍関連
  async searchBooks(query: string): Promise<Book[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredBooks = mockBooks.filter(
          (book) =>
            book.title.includes(query) ||
            book.author.includes(query) ||
            (book.genre && book.genre.includes(query))
        );
        resolve(filteredBooks);
      }, 800);
    });
  },

  async getBook(bookId: string): Promise<Book> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = mockBooks.find((b) => b.bookId === bookId);
        if (book) {
          resolve(book);
        } else {
          reject(new Error('書籍が見つかりません'));
        }
      }, 500);
    });
  },

  async getTodaysBook(): Promise<Book> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomBook = mockBooks[Math.floor(Math.random() * mockBooks.length)];
        resolve(randomBook);
      }, 500);
    });
  },

  // 読書状況関連
  async getUserReadingStatus(userId: string, status?: string): Promise<BookReadingStatus[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = mockReadingStatus.filter((rs) => rs.userId === userId);
        if (status) {
          filtered = filtered.filter((rs) => rs.status === status);
        }
        resolve(filtered);
      }, 500);
    });
  },

  async updateReadingStatus(userId: string, statusData: any): Promise<BookReadingStatus> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingStatusIndex = mockReadingStatus.findIndex(
          (rs) => rs.userId === userId && rs.bookId === statusData.bookId
        );

        const book = mockBooks.find((b) => b.bookId === statusData.bookId);
        const newStatus: BookReadingStatus = {
          statusId: existingStatusIndex >= 0 ? mockReadingStatus[existingStatusIndex].statusId : `status_${Date.now()}`,
          userId,
          bookId: statusData.bookId,
          book,
          status: statusData.status,
          currentPage: statusData.currentPage,
          startDate: statusData.startDate,
          finishDate: statusData.finishDate,
          readingTimeMinutes: statusData.readingTimeMinutes,
          moodAtFinish: statusData.moodAtFinish,
          createdAt: existingStatusIndex >= 0 ? mockReadingStatus[existingStatusIndex].createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (existingStatusIndex >= 0) {
          mockReadingStatus[existingStatusIndex] = newStatus;
        } else {
          mockReadingStatus.push(newStatus);
        }

        resolve(newStatus);
      }, 500);
    });
  },

  // レビュー関連
  async postReview(bookId: string, reviewData: any): Promise<Review> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const review: Review = {
          reviewId: `review_${Date.now()}`,
          userId: mockUser.userId,
          bookId,
          rating: reviewData.rating,
          reviewText: reviewData.reviewText,
          hasSpoiler: reviewData.hasSpoiler || false,
          postedAt: new Date().toISOString(),
          imageUrl: reviewData.imageUrl,
          user: mockUser,
          book: mockBooks.find((b) => b.bookId === bookId),
        };
        resolve(review);
      }, 800);
    });
  },
};
// ユーザー関連
export interface User {
  userId: string;
  username: string;
  email: string;
  profileBio?: string;
  avatarUrl?: string;
  preferredGenres?: string[];
  readingLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  readingStyle?: string;
  isPublicProfile: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// 書籍関連
export interface Book {
  bookId: string;
  title: string;
  author: string;
  publisher?: string;
  publicationYear?: number;
  synopsis?: string;
  coverImageUrl?: string;
  genre?: string;
  createdAt: string;
}

// 読書ステータス
export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'FINISHED' | 'STACKED';

export interface BookReadingStatus {
  statusId: string;
  userId: string;
  bookId: string;
  book?: Book;
  status: ReadingStatus;
  currentPage?: number;
  startDate?: string;
  finishDate?: string;
  readingTimeMinutes?: number;
  moodAtFinish?: string;
  createdAt: string;
  updatedAt: string;
}

// レビュー関連
export interface Review {
  reviewId: string;
  userId: string;
  bookId: string;
  rating: number; // 1-5
  reviewText: string;
  hasSpoiler: boolean;
  postedAt: string;
  imageUrl?: string;
  user?: User;
  book?: Book;
}

// 本棚関連
export interface Shelf {
  shelfId: string;
  userId: string;
  shelfName: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  bookCount?: number;
}

export interface ShelfItem {
  itemId: string;
  shelfId: string;
  bookId: string;
  addedAt: string;
  book?: Book;
}

// リアクション
export type ReactionType = 'LIKE' | 'CRY' | 'DEEP' | 'WANT_TO_READ_EMOJI';

export interface Reaction {
  reactionId: string;
  userId: string;
  targetType: 'REVIEW' | 'FEED_POST' | 'COMMENT';
  targetId: string;
  reactionType: ReactionType;
  reactedAt: string;
}

// コメント
export interface Comment {
  commentId: string;
  userId: string;
  targetType: 'REVIEW' | 'FEED_POST';
  targetId: string;
  commentText: string;
  commentedAt: string;
  user?: User;
}

// 認証関連
export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
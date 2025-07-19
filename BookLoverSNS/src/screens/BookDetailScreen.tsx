import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { Button } from '../components/Button';
import { Book, ReadingStatus } from '../types';
import { colors, spacing, typography, borderRadius, shadow } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type BookDetailScreenRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;
type BookDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

interface BookDetailScreenProps {
  route: BookDetailScreenRouteProp;
  navigation: BookDetailScreenNavigationProp;
}

const BookDetailScreen: React.FC<BookDetailScreenProps> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ReadingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const bookData = await bookService.getBook(bookId);
      setBook(bookData);
      
      if (user) {
        const userReadingStatus = await bookService.getUserReadingStatus(user.userId);
        const currentBookStatus = userReadingStatus.find(status => status.bookId === bookId);
        setCurrentStatus(currentBookStatus?.status || null);
      }
    } catch (error) {
      console.error('Failed to fetch book details:', error);
      Alert.alert('エラー', '書籍の詳細を取得できませんでした');
    } finally {
      setLoading(false);
    }
  };

  const updateReadingStatus = async (status: ReadingStatus) => {
    if (!user || !book) return;

    try {
      await bookService.updateReadingStatus(user.userId, {
        bookId: book.bookId,
        status,
        startDate: status === 'READING' ? new Date().toISOString().split('T')[0] : undefined,
        finishDate: status === 'FINISHED' ? new Date().toISOString().split('T')[0] : undefined,
      });
      setCurrentStatus(status);
      Alert.alert('更新完了', `「${book.title}」を${getStatusLabel(status)}に登録しました`);
    } catch (error) {
      console.error('Failed to update reading status:', error);
      Alert.alert('エラー', '読書状況の更新に失敗しました');
    }
  };

  const getStatusLabel = (status: ReadingStatus) => {
    switch (status) {
      case 'WANT_TO_READ': return '読みたい';
      case 'READING': return '読書中';
      case 'FINISHED': return '読了';
      case 'STACKED': return '積読';
    }
  };

  const getStatusColor = (status: ReadingStatus) => {
    switch (status) {
      case 'WANT_TO_READ': return colors.wantToRead;
      case 'READING': return colors.reading;
      case 'FINISHED': return colors.finished;
      case 'STACKED': return colors.stacked;
    }
  };

  const handleReviewPress = () => {
    if (book) {
      navigation.navigate('Review', { bookId: book.bookId });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>書籍が見つかりませんでした</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.bookHeader}>
        <View style={styles.bookImageContainer}>
          {book.coverImageUrl ? (
            <Image
              source={{ uri: book.coverImageUrl }}
              style={styles.bookImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.bookImage, styles.bookImagePlaceholder]}>
              <Text style={styles.bookImagePlaceholderText}>📚</Text>
            </View>
          )}
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>
          {book.publisher && (
            <Text style={styles.bookPublisher}>{book.publisher}</Text>
          )}
          {book.publicationYear && (
            <Text style={styles.bookYear}>{book.publicationYear}年</Text>
          )}
          {book.genre && (
            <View style={styles.genreContainer}>
              <Text style={styles.bookGenre}>{book.genre}</Text>
            </View>
          )}
        </View>
      </View>

      {currentStatus && (
        <View style={styles.currentStatusContainer}>
          <View style={[styles.currentStatus, { backgroundColor: getStatusColor(currentStatus) }]}>
            <Text style={styles.currentStatusText}>
              {getStatusLabel(currentStatus)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.actionButtons}>
        <Button
          title="読みたい"
          onPress={() => updateReadingStatus('WANT_TO_READ')}
          variant={currentStatus === 'WANT_TO_READ' ? 'primary' : 'outline'}
          size="small"
        />
        <Button
          title="読書中"
          onPress={() => updateReadingStatus('READING')}
          variant={currentStatus === 'READING' ? 'primary' : 'outline'}
          size="small"
        />
        <Button
          title="読了"
          onPress={() => updateReadingStatus('FINISHED')}
          variant={currentStatus === 'FINISHED' ? 'primary' : 'outline'}
          size="small"
        />
        <Button
          title="積読"
          onPress={() => updateReadingStatus('STACKED')}
          variant={currentStatus === 'STACKED' ? 'primary' : 'outline'}
          size="small"
        />
      </View>

      {book.synopsis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>あらすじ</Text>
          <Text style={styles.synopsis}>{book.synopsis}</Text>
        </View>
      )}

      <View style={styles.section}>
        <TouchableOpacity style={styles.reviewButton} onPress={handleReviewPress}>
          <Ionicons name="create" size={20} color={colors.accent} />
          <Text style={styles.reviewButtonText}>レビューを書く</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bookHeader: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  bookImageContainer: {
    marginRight: spacing.lg,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
  },
  bookImagePlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookImagePlaceholderText: {
    fontSize: 60,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
  },
  bookAuthor: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bookPublisher: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bookYear: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  genreContainer: {
    alignSelf: 'flex-start',
  },
  bookGenre: {
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    backgroundColor: `${colors.accent}20`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  currentStatusContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  currentStatus: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  currentStatusText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  synopsis: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadow.sm,
  },
  reviewButtonText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    fontWeight: '500',
    marginLeft: spacing.md,
  },
});

export default BookDetailScreen;
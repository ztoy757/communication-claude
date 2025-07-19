import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { Book } from '../types';
import { colors, spacing, typography, borderRadius, shadow } from '../constants/theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [todaysBook, setTodaysBook] = useState<Book | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysBook();
  }, []);

  const fetchTodaysBook = async () => {
    try {
      setLoading(true);
      const book = await bookService.getTodaysBook();
      setTodaysBook(book);
    } catch (error) {
      console.error('Failed to fetch today\'s book:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodaysBook();
    setRefreshing(false);
  };

  const handleBookPress = (bookId: string) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const renderTodaysBook = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      );
    }

    if (!todaysBook) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>今日のおすすめ本が見つかりませんでした</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.todaysBookCard}
        onPress={() => handleBookPress(todaysBook.bookId)}
        activeOpacity={0.8}
      >
        <View style={styles.bookImageContainer}>
          {todaysBook.coverImageUrl ? (
            <Image
              source={{ uri: todaysBook.coverImageUrl }}
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
          <Text style={styles.bookTitle} numberOfLines={2}>
            {todaysBook.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {todaysBook.author}
          </Text>
          {todaysBook.genre && (
            <Text style={styles.bookGenre}>{todaysBook.genre}</Text>
          )}
          {todaysBook.synopsis && (
            <Text style={styles.bookSynopsis} numberOfLines={3}>
              {todaysBook.synopsis}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          こんばんは、{user?.username || 'ゲスト'}さん
        </Text>
        <Text style={styles.subtitle}>今夜はどんな本を読みますか？</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>今日のあなたへの一冊</Text>
        {renderTodaysBook()}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.actionIcon}>🔍</Text>
          <Text style={styles.actionText}>本を探す</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('MyBooks')}
        >
          <Text style={styles.actionIcon}>📖</Text>
          <Text style={styles.actionText}>読書中</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ReadingStats')}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>読書統計</Text>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  todaysBookCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    ...shadow.md,
  },
  bookImageContainer: {
    marginRight: spacing.md,
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: borderRadius.md,
  },
  bookImagePlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookImagePlaceholderText: {
    fontSize: 40,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bookAuthor: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bookGenre: {
    fontSize: typography.fontSize.xs,
    color: colors.accent,
    backgroundColor: `${colors.accent}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  bookSynopsis: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  loadingContainer: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    flex: 1,
    marginHorizontal: spacing.sm,
    ...shadow.sm,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
});

export default HomeScreen;
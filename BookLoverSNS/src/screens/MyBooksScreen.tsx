import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { BookReadingStatus, ReadingStatus } from '../types';
import { colors, spacing, typography, borderRadius, shadow } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type MyBooksScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const MyBooksScreen: React.FC = () => {
  const navigation = useNavigation<MyBooksScreenNavigationProp>();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<ReadingStatus | 'ALL'>('ALL');
  const [books, setBooks] = useState<BookReadingStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const statusTabs = [
    { key: 'ALL', label: 'すべて', color: colors.text },
    { key: 'READING', label: '読書中', color: colors.reading },
    { key: 'WANT_TO_READ', label: '読みたい', color: colors.wantToRead },
    { key: 'FINISHED', label: '読了', color: colors.finished },
    { key: 'STACKED', label: '積読', color: colors.stacked },
  ];

  const fetchBooks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const status = selectedStatus === 'ALL' ? undefined : selectedStatus;
      const results = await bookService.getUserReadingStatus(user.userId, status);
      setBooks(results);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedStatus]);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [fetchBooks])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  };

  const handleBookPress = (bookId: string) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const getStatusColor = (status: ReadingStatus) => {
    switch (status) {
      case 'READING':
        return colors.reading;
      case 'WANT_TO_READ':
        return colors.wantToRead;
      case 'FINISHED':
        return colors.finished;
      case 'STACKED':
        return colors.stacked;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: ReadingStatus) => {
    switch (status) {
      case 'READING':
        return '読書中';
      case 'WANT_TO_READ':
        return '読みたい';
      case 'FINISHED':
        return '読了';
      case 'STACKED':
        return '積読';
      default:
        return '';
    }
  };

  const renderBookItem = ({ item }: { item: BookReadingStatus }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookPress(item.bookId)}
      activeOpacity={0.8}
    >
      <View style={styles.bookImageContainer}>
        {item.book?.coverImageUrl ? (
          <Image
            source={{ uri: item.book.coverImageUrl }}
            style={styles.bookImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.bookImage, styles.bookImagePlaceholder]}>
            <Text style={styles.bookImagePlaceholderText}>📚</Text>
          </View>
        )}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusBadgeText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.book?.title || '不明なタイトル'}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.book?.author || '不明な著者'}
        </Text>
        {item.status === 'READING' && item.currentPage && (
          <View style={styles.progressContainer}>
            <Ionicons name="bookmark" size={14} color={colors.textSecondary} />
            <Text style={styles.progressText}>
              {item.currentPage}ページまで読了
            </Text>
          </View>
        )}
        {item.status === 'FINISHED' && item.finishDate && (
          <View style={styles.progressContainer}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.progressText}>
              {new Date(item.finishDate).toLocaleDateString('ja-JP')} 読了
            </Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyText}>
        {selectedStatus === 'ALL'
          ? 'まだ本が登録されていません'
          : `${statusTabs.find((tab) => tab.key === selectedStatus)?.label}の本がありません`}
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.addButtonText}>本を探す</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <FlatList
          data={statusTabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                selectedStatus === item.key && styles.selectedTab,
              ]}
              onPress={() => setSelectedStatus(item.key as ReadingStatus | 'ALL')}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedStatus === item.key && styles.selectedTabText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.tabContentContainer}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.statusId}
          renderItem={renderBookItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow.sm,
  },
  tabContentContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
  },
  selectedTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  selectedTabText: {
    color: colors.text,
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: spacing.md,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  bookImageContainer: {
    marginRight: spacing.md,
    position: 'relative',
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: borderRadius.sm,
  },
  bookImagePlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookImagePlaceholderText: {
    fontSize: 24,
  },
  statusBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusBadgeText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bookAuthor: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  progressText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 60 + spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    fontWeight: '600',
  },
});

export default MyBooksScreen;
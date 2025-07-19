import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Input } from '../components/Input';
import { bookService } from '../services/bookService';
import { Book } from '../types';
import { colors, spacing, typography, borderRadius, shadow } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type BookSearchScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const BookSearchScreen: React.FC = () => {
  const navigation = useNavigation<BookSearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const results = await bookService.searchBooks(searchQuery);
      setBooks(results);
    } catch (error) {
      console.error('Search failed:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleBookPress = (bookId: string) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookPress(item.bookId)}
      activeOpacity={0.8}
    >
      <View style={styles.bookImageContainer}>
        {item.coverImageUrl ? (
          <Image
            source={{ uri: item.coverImageUrl }}
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
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        {item.publisher && (
          <Text style={styles.bookPublisher} numberOfLines={1}>
            {item.publisher}
          </Text>
        )}
        {item.genre && (
          <View style={styles.genreContainer}>
            <Text style={styles.bookGenre}>{item.genre}</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => {
    if (!searched) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>
            書籍名、著者名、ISBNで検索してください
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📚</Text>
        <Text style={styles.emptyText}>
          「{searchQuery}」に一致する書籍が見つかりませんでした
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Input
            placeholder="書籍を検索..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            containerStyle={styles.inputContainer}
            style={styles.searchInput}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Ionicons name="search" size={24} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.bookId}
        renderItem={renderBookItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  searchInput: {
    paddingRight: spacing.xl + spacing.lg,
  },
  searchButton: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.sm,
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
  bookPublisher: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  genreContainer: {
    marginTop: spacing.xs,
  },
  bookGenre: {
    fontSize: typography.fontSize.xs,
    color: colors.accent,
    backgroundColor: `${colors.accent}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 60 + spacing.md,
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
  },
});

export default BookSearchScreen;
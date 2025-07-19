import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Shelf, ShelfItem } from '../types';
import { colors, spacing, typography, borderRadius, shadow } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type ShelfScreenRouteProp = RouteProp<RootStackParamList, 'Shelf'>;
type ShelfScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Shelf'>;

interface ShelfScreenProps {
  route: ShelfScreenRouteProp;
  navigation: ShelfScreenNavigationProp;
}

const ShelfScreen: React.FC<ShelfScreenProps> = ({ route, navigation }) => {
  const { shelfId } = route.params;
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [books, setBooks] = useState<ShelfItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShelfData();
  }, [shelfId]);

  const fetchShelfData = async () => {
    try {
      setLoading(true);
      // TODO: 本棚とアイテムのデータを取得
      // const shelfData = await shelfService.getShelf(shelfId);
      // const shelfItems = await shelfService.getShelfItems(shelfId);
      // setShelf(shelfData);
      // setBooks(shelfItems);
      
      // モックデータ
      setShelf({
        shelfId,
        userId: 'user123',
        shelfName: 'お気に入りのファンタジー',
        description: '心に響いたファンタジー小説をまとめました',
        isPublic: true,
        createdAt: '2023-01-01T00:00:00Z',
        bookCount: 5,
      });
      
      setBooks([]);
    } catch (error) {
      console.error('Failed to fetch shelf data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (bookId: string) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const renderBookItem = ({ item }: { item: ShelfItem }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookPress(item.bookId)}
      activeOpacity={0.8}
    >
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
      <Text style={styles.bookTitle} numberOfLines={2}>
        {item.book?.title || '不明なタイトル'}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyText}>この本棚にはまだ本が登録されていません</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!shelf) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>本棚が見つかりませんでした</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.shelfInfo}>
          <Text style={styles.shelfName}>{shelf.shelfName}</Text>
          {shelf.description && (
            <Text style={styles.shelfDescription}>{shelf.description}</Text>
          )}
          <View style={styles.shelfMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="book" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{shelf.bookCount || 0}冊</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name={shelf.isPublic ? 'globe' : 'lock-closed'}
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.metaText}>
                {shelf.isPublic ? '公開' : '非公開'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.itemId}
        renderItem={renderBookItem}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow.sm,
  },
  shelfInfo: {
    alignItems: 'center',
  },
  shelfName: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  shelfDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    marginBottom: spacing.md,
  },
  shelfMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  metaText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  row: {
    justifyContent: 'space-around',
  },
  bookItem: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    width: '30%',
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  bookImagePlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookImagePlaceholderText: {
    fontSize: 32,
  },
  bookTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    textAlign: 'center',
    lineHeight: typography.fontSize.sm * typography.lineHeight.tight,
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

export default ShelfScreen;
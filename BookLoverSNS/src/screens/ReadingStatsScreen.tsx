import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { BookReadingStatus } from '../types';
import { colors, spacing, typography, borderRadius, shadow } from '../constants/theme';

interface ReadingStats {
  totalBooks: number;
  readingBooks: number;
  finishedBooks: number;
  wantToReadBooks: number;
  stackedBooks: number;
  thisMonthFinished: number;
  thisYearFinished: number;
}

const ReadingStatsScreen: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const allBooks = await bookService.getUserReadingStatus(user.userId);
      const stats = calculateStats(allBooks);
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch reading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (books: BookReadingStatus[]): ReadingStats => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const stats = {
      totalBooks: books.length,
      readingBooks: 0,
      finishedBooks: 0,
      wantToReadBooks: 0,
      stackedBooks: 0,
      thisMonthFinished: 0,
      thisYearFinished: 0,
    };

    books.forEach((book) => {
      switch (book.status) {
        case 'READING':
          stats.readingBooks++;
          break;
        case 'FINISHED':
          stats.finishedBooks++;
          if (book.finishDate) {
            const finishDate = new Date(book.finishDate);
            if (finishDate.getFullYear() === currentYear) {
              stats.thisYearFinished++;
              if (finishDate.getMonth() === currentMonth) {
                stats.thisMonthFinished++;
              }
            }
          }
          break;
        case 'WANT_TO_READ':
          stats.wantToReadBooks++;
          break;
        case 'STACKED':
          stats.stackedBooks++;
          break;
      }
    });

    return stats;
  };

  const renderStatCard = (title: string, value: number, color: string, subtitle?: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>統計情報を取得できませんでした</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>読書統計</Text>
        <Text style={styles.headerSubtitle}>あなたの読書記録を振り返ってみましょう</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 全体統計</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('登録済み書籍', stats.totalBooks, colors.primary)}
          {renderStatCard('読了', stats.finishedBooks, colors.finished)}
          {renderStatCard('読書中', stats.readingBooks, colors.reading)}
          {renderStatCard('読みたい', stats.wantToReadBooks, colors.wantToRead)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 期間別統計</Text>
        <View style={styles.statsGrid}>
          {renderStatCard(
            '今月読了',
            stats.thisMonthFinished,
            colors.accent,
            '今月読み終えた本'
          )}
          {renderStatCard(
            '今年読了',
            stats.thisYearFinished,
            colors.success,
            '今年読み終えた本'
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 読書傾向</Text>
        <View style={styles.trendCard}>
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>読書完了率</Text>
            <Text style={styles.trendValue}>
              {stats.totalBooks > 0
                ? Math.round((stats.finishedBooks / stats.totalBooks) * 100)
                : 0}%
            </Text>
          </View>
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>積読率</Text>
            <Text style={styles.trendValue}>
              {stats.totalBooks > 0
                ? Math.round(((stats.stackedBooks + stats.wantToReadBooks) / stats.totalBooks) * 100)
                : 0}%
            </Text>
          </View>
        </View>
      </View>

      {stats.finishedBooks > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 読書実績</Text>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementText}>
              {stats.finishedBooks >= 100 && '📚 読書マスター（100冊以上読了）'}
              {stats.finishedBooks >= 50 && stats.finishedBooks < 100 && '📖 読書愛好家（50冊以上読了）'}
              {stats.finishedBooks >= 20 && stats.finishedBooks < 50 && '📑 読書好き（20冊以上読了）'}
              {stats.finishedBooks >= 10 && stats.finishedBooks < 20 && '📔 読書習慣（10冊以上読了）'}
              {stats.finishedBooks < 10 && '📖 読書を始めよう'}
            </Text>
            {stats.thisYearFinished >= 12 && (
              <Text style={styles.achievementBadge}>月1冊ペース達成中！</Text>
            )}
          </View>
        </View>
      )}
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    width: '48%',
    borderLeftWidth: 4,
    ...shadow.sm,
  },
  statValue: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.text,
  },
  statSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  trendCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  trendLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  trendValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.accent,
  },
  achievementCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.sm,
  },
  achievementText: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  achievementBadge: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
    backgroundColor: `${colors.success}20`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    fontWeight: '500',
  },
});

export default ReadingStatsScreen;
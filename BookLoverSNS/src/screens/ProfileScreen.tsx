import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography, borderRadius, shadow } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'reading-stats',
      icon: 'stats-chart',
      title: '読書統計',
      subtitle: '読書の記録を確認する',
      onPress: () => navigation.navigate('ReadingStats'),
    },
    {
      id: 'settings',
      icon: 'settings',
      title: '設定',
      subtitle: 'アプリの設定を変更する',
      onPress: () => {
        // 設定画面への遷移（後で実装）
        Alert.alert('設定', '設定画面は開発中です');
      },
    },
    {
      id: 'help',
      icon: 'help-circle',
      title: 'ヘルプ',
      subtitle: '使い方やサポート情報',
      onPress: () => {
        Alert.alert('ヘルプ', 'ヘルプページは開発中です');
      },
    },
    {
      id: 'logout',
      icon: 'log-out',
      title: 'ログアウト',
      subtitle: 'アカウントからログアウトする',
      onPress: handleLogout,
      isDangerous: true,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={40} color={colors.textSecondary} />
            </View>
          )}
        </View>
        <Text style={styles.username}>{user?.username || 'ゲスト'}</Text>
        {user?.profileBio && (
          <Text style={styles.bio}>{user.profileBio}</Text>
        )}
        <View style={styles.userInfo}>
          {user?.readingLevel && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>読書レベル</Text>
              <Text style={styles.infoValue}>
                {user.readingLevel === 'BEGINNER' && '初心者'}
                {user.readingLevel === 'INTERMEDIATE' && '中級者'}
                {user.readingLevel === 'ADVANCED' && '上級者'}
              </Text>
            </View>
          )}
          {user?.readingStyle && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>読書スタイル</Text>
              <Text style={styles.infoValue}>{user.readingStyle}</Text>
            </View>
          )}
        </View>
      </View>

      {user?.preferredGenres && user.preferredGenres.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>好きなジャンル</Text>
          <View style={styles.genreContainer}>
            {user.preferredGenres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>メニュー</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === 0 && styles.menuItemFirst,
              index === menuItems.length - 1 && styles.menuItemLast,
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIcon,
                  item.isDangerous && styles.menuIconDangerous,
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.isDangerous ? colors.error : colors.text}
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text
                  style={[
                    styles.menuTitle,
                    item.isDangerous && styles.menuTitleDangerous,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.appVersion}>本好きのためのSNS v1.0.0</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bio: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    marginBottom: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  infoItem: {
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
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
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  genreText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemFirst: {
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  menuItemLast: {
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuIconDangerous: {
    backgroundColor: `${colors.error}20`,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  menuTitleDangerous: {
    color: colors.error,
  },
  menuSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  appVersion: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
});

export default ProfileScreen;
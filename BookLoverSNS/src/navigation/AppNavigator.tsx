import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';

// スクリーンのインポート（後で作成）
import HomeScreen from '../screens/HomeScreen';
import BookSearchScreen from '../screens/BookSearchScreen';
import MyBooksScreen from '../screens/MyBooksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ShelfScreen from '../screens/ShelfScreen';
import ReadingStatsScreen from '../screens/ReadingStatsScreen';

// 型定義
export type RootStackParamList = {
  MainTabs: undefined;
  BookDetail: { bookId: string };
  Review: { bookId: string };
  Shelf: { shelfId: string };
  ReadingStats: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  MyBooks: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 認証画面のスタック
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'ログイン' }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: '新規登録' }}
      />
    </AuthStack.Navigator>
  );
};

// メインタブナビゲーター
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MyBooks') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'ホーム' }}
      />
      <Tab.Screen
        name="Search"
        component={BookSearchScreen}
        options={{ title: '書籍検索' }}
      />
      <Tab.Screen
        name="MyBooks"
        component={MyBooksScreen}
        options={{ title: 'マイブック' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'プロフィール' }}
      />
    </Tab.Navigator>
  );
};

// メインスタックナビゲーター
const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{ title: '書籍詳細' }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{ title: 'レビュー投稿' }}
      />
      <Stack.Screen
        name="Shelf"
        component={ShelfScreen}
        options={{ title: '本棚' }}
      />
      <Stack.Screen
        name="ReadingStats"
        component={ReadingStatsScreen}
        options={{ title: '読書統計' }}
      />
    </Stack.Navigator>
  );
};

// アプリのメインナビゲーター
export const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // ローディング画面を表示（後で作成）
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainStackNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
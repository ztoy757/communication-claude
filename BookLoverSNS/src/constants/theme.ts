export const colors = {
  // 基本カラー
  primary: '#4A5568', // 落ち着いたグレー
  secondary: '#2D3748', // 深いグレー
  background: '#1A202C', // ダークな背景
  surface: '#2D3748', // カード背景など
  text: '#E2E8F0', // 明るいグレーのテキスト
  textSecondary: '#A0AEC0', // セカンダリテキスト
  
  // アクセントカラー
  accent: '#D69E2E', // 暖かみのあるゴールド
  success: '#48BB78', // 落ち着いた緑
  error: '#E53E3E', // エラー赤
  warning: '#ED8936', // 警告オレンジ
  
  // 読書ステータスカラー
  wantToRead: '#9F7AEA', // 紫
  reading: '#4299E1', // 青
  finished: '#48BB78', // 緑
  stacked: '#ED8936', // オレンジ
  
  // その他
  border: '#4A5568',
  disabled: '#718096',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
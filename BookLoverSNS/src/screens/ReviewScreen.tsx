import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;
type ReviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Review'>;

interface ReviewScreenProps {
  route: ReviewScreenRouteProp;
  navigation: ReviewScreenNavigationProp;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }

    if (rating === 0) {
      Alert.alert('評価必須', '星評価を選択してください');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('レビュー必須', 'レビュー内容を入力してください');
      return;
    }

    setLoading(true);
    try {
      await bookService.postReview(bookId, {
        rating,
        reviewText: reviewText.trim(),
        hasSpoiler,
      });
      Alert.alert('投稿完了', 'レビューを投稿しました', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Failed to post review:', error);
      Alert.alert('エラー', 'レビューの投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = () => {
    return (
      <View style={styles.starContainer}>
        <Text style={styles.ratingLabel}>評価</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRatingPress(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={30}
                color={star <= rating ? colors.accent : colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>
          {rating === 0 && '評価を選択してください'}
          {rating === 1 && '★ いまいち'}
          {rating === 2 && '★★ 普通'}
          {rating === 3 && '★★★ 良い'}
          {rating === 4 && '★★★★ とても良い'}
          {rating === 5 && '★★★★★ 最高'}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {renderStarRating()}

        <View style={styles.section}>
          <Input
            label="レビュー"
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="この本についての感想を書いてください..."
            multiline
            numberOfLines={8}
            style={styles.reviewInput}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.spoilerToggle}
          onPress={() => setHasSpoiler(!hasSpoiler)}
        >
          <View style={styles.spoilerCheckbox}>
            {hasSpoiler && (
              <Ionicons name="checkmark" size={16} color={colors.text} />
            )}
          </View>
          <View style={styles.spoilerTextContainer}>
            <Text style={styles.spoilerLabel}>ネタバレを含む</Text>
            <Text style={styles.spoilerDescription}>
              チェックすると、他のユーザーにはネタバレ警告が表示されます
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button
            title="投稿する"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            size="large"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  starContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  ratingLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  starButton: {
    paddingHorizontal: spacing.xs,
  },
  ratingText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  reviewInput: {
    height: 120,
    paddingTop: spacing.md,
  },
  spoilerToggle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  spoilerCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
    backgroundColor: hasSpoiler ? colors.accent : 'transparent',
  },
  spoilerTextContainer: {
    flex: 1,
  },
  spoilerLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  spoilerDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});

export default ReviewScreen;
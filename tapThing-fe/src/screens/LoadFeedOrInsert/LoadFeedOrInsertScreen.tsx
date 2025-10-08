// screens/LoadFeedOrInsertScreen/LoadFeedOrInsertScreen.tsx
import React, { use } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FeedStackScreensNavigation from '@/navigation/FeedStackScreens/FeedStackScreens';
import PromptLandingStackNavigation from '@/navigation/PromptLandingStackNavigation/PromptLandingStackNavigation';
import { useActivePrompt } from '@/hook/prompt/useHookPrompts';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const LoadFeedOrInsertScreen: React.FC = () => {
  const { isLoading, prompt, hasPostedOnPrompt, error } = useActivePrompt();
  const { t } = useTranslation();

  // Mostra un loader durante il bootstrap iniziale
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
if (error) { 
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="red" />
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>
             {t(error) || t('UNKNOWN_ERROR')}
          </Text>
        </View>
      </View>
    );
}
  // Nessun prompt attivo => l’utente non può ancora postare → landing del prompt
  if (!prompt) {
    // todo: torna perché non c’è nessun prompt attivo
    return <PromptLandingStackNavigation />;
  }

  // Prompt attivo:
  // - se l’utente ha già postato → feed
  // - altrimenti → landing (dove può postare la foto)
  return hasPostedOnPrompt ? (
    <FeedStackScreensNavigation />
  ) : (
    <PromptLandingStackNavigation />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadFeedOrInsertScreen;

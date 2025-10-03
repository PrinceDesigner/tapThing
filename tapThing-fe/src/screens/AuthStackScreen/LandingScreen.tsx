// src/screens/AuthStackScreen/LandingScreen.tsx
import React, { use } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextBold, TextRegular } from '@/components/ui/customText';
import { useTranslation } from 'react-i18next';
import { setAppLanguage } from '@/i18n';
import { useNavigation } from '@react-navigation/native';

type Props = { onGetStarted?: () => void };

const TapThingLandingScreen: React.FC<Props> = ({ onGetStarted }) => {
  const theme = useTheme();
  const isDark = theme.dark;

  const navigate = useNavigation<any>();

  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background as string}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      <View style={styles.container}>
        {/* Contenuto centrale */}
        <View style={styles.centerContent}>
          <TextBold style={[styles.title, { color: theme.colors.onBackground }]}>
            {t('brand')}
          </TextBold>

          <TextRegular style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {t('subtitle')}
          </TextRegular>

          <Button
            mode="contained"
            onPress={() => navigate.navigate('Register')}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {t('get_started')}
          </Button>
        </View>

        {/* Footer lingua */}
        <View style={styles.footer}>
          <Button
            compact
            mode="text"
            onPress={() => setAppLanguage('en')}
            labelStyle={{ color: theme.colors.onSurfaceVariant }}
          >
            English
          </Button>
          <Button
            compact
            mode="text"
            onPress={() => setAppLanguage('it')}
            labelStyle={{ color: theme.colors.onSurfaceVariant }}
          >
            Italiano
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TapThingLandingScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 44, marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 32, textAlign: 'center' },
  button: { borderRadius: 12, alignSelf: 'stretch' },
  buttonContent: { height: 52 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
});

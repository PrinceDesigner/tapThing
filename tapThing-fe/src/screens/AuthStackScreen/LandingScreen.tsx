// src/screens/AuthStackScreen/LandingScreen.tsx
import React from 'react';
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextBold, TextRegular } from '@/components/ui/customText';
import { useTranslation } from 'react-i18next';
import { setAppLanguage } from '@/i18n';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '@/context/themeContext';
import HowItFeels from '@/components/ui/HowFeel';

type Props = { onGetStarted?: () => void };

const TapThingLandingScreen: React.FC<Props> = ({ onGetStarted }) => {
  const theme = useTheme();
  const navigate = useNavigation<any>();
  const { toggleTheme, theme: currentTheme } = useThemeContext();
  const { t } = useTranslation();

  const isDark = theme.dark;

  const handleGetStarted = () => {
    if (onGetStarted) return onGetStarted();
    navigate.navigate('Register');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background as string}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      <View style={styles.container}>
        {/* Header con toggle */}
        <View style={styles.header}>
          <IconButton
            icon={currentTheme === 'light' ? 'moon-waning-crescent' : 'white-balance-sunny'}
            size={24}
            onPress={toggleTheme}
            iconColor={theme.colors.onBackground}
            accessibilityLabel="Cambia tema"
          />
        </View>

        {/* Corpo scrollabile: hero + sezione emozionale */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.centerContent}>
            <TextBold style={[styles.title, { color: theme.colors.onBackground }]}>
              {t('brand')}
            </TextBold>
            <Button
              mode="contained"
              onPress={handleGetStarted}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {t('get_started')}
            </Button>
          </View>

          {/* Sezione emozionale (senza i18n) */}
          <HowItFeels />
        </ScrollView>

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
  header: { alignItems: 'flex-end' },
  scrollContent: {
    paddingBottom: 16,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
  title: { fontSize: 44, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
  button: { borderRadius: 12, alignSelf: 'stretch' },
  buttonContent: { height: 52 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});

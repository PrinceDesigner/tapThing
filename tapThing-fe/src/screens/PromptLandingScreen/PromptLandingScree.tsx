import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Button,
  ProgressBar,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useActivePrompt } from '@/hook/prompt/useHookPrompts';
import { PromptCountdown } from '@/components/promptCountDown/PromptCountDown';

export const DailyPromptStaticScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  // --- PROMPT ---
  const { prompt } = useActivePrompt();
  
  const { t } = useTranslation();

  const promptTitle = prompt?.title || '';
  // --- TIMER/COUNTDOWN ---
  // 1) prendi l'ISO di fine dal backend
  const ENDS_ISO = prompt?.ends_at || new Date().toISOString(); // es.


  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'top']}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* wrapper centrale con larghezza massima per lettura piacevole */}
          <View style={styles.centerWrap}>
            <Text
              variant="titleLarge"
              style={[styles.prompt, { color: theme.colors.onSurface }]}
              accessibilityRole="header"
            >
              {promptTitle}
            </Text>

            <Divider style={{ marginVertical: 14, opacity: 0.5 }} />

            <Button
              mode="contained"
              icon="camera"
              onPress={() => navigation.navigate('InsertPhotoScreen')}
              style={styles.cta}
              contentStyle={styles.ctaContent}
              accessibilityLabel="Scatta o scegli una foto per rispondere allo stimolo"
            >
              {t('take_photo')}
            </Button>

            {/* micro–messaggio opzionale, empatico (puoi toglierlo se vuoi ancora più minimal) */}
            <Text
              variant="bodySmall"
              style={[styles.subtleNote, { color: theme.colors.onSurfaceVariant }]}
            >
              {t('post_only_if_moved')}
            </Text>
          </View>
        </ScrollView>

        {/* Countdown fisso in basso dentro SafeArea */}
        <SafeAreaView
          style={[styles.footer, { borderTopColor: theme.colors.outlineVariant }]}
          edges={['bottom']}
        >
          <PromptCountdown
            endsAt={ENDS_ISO || new Date().toISOString()}
            totalMs={23 * 60 * 60 * 1000}
            expiredText={t('EXPIRED_AT')}
            labelPrefix={t('EXPIRES_IN')}
            onSecondary={false}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 12 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',   // vero centraggio verticale
  },
  centerWrap: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 640,              // lettura migliore su tablet / telefoni grandi
    alignItems: 'center',
  },
  prompt: {
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 30,
  },
  cta: { borderRadius: 12, alignSelf: 'stretch' },
  ctaContent: { height: 52 },
  subtleNote: { textAlign: 'center', marginTop: 10 },
  footer: {
    marginTop: 'auto',
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  progress: {
    marginTop: 8,
    height: 6,
    borderRadius: 8,
    width: '100%',
  },
});

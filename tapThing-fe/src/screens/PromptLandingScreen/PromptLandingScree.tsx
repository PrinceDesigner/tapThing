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

export const DailyPromptStaticScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  // --- DATI DI BASE ---
  const promptTitle = 'Perché sei felice oggi? Dillo con una foto.';

  // --- TIMER/COUNTDOWN ---
  const expiry = useMemo(() => Date.now() + 23 * 60 * 60 * 1000, []);
  const [remaining, setRemaining] = useState<number>(Math.max(0, expiry - Date.now()));
  
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, expiry - Date.now())), 1000);
    return () => clearInterval(id);
  }, [expiry]);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };

  const progress = useMemo(() => {
    const total = 23 * 60 * 60 * 1000;
    return Math.max(0, Math.min(1, (total - remaining) / total));
  }, [remaining]);

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
          <Text variant="bodyMedium" style={{ fontWeight: '700' }}>
            Scade tra {fmt(remaining)}
          </Text>
          <ProgressBar progress={progress} style={styles.progress} />
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

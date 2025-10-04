import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text,
  useTheme,
  Button,
  Card,
  ProgressBar,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DailyPromptStaticScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

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
      <View style={styles.container}>
        {/* Contenuto centrale */}
        <View style={styles.centerContent}>
          <Text
            variant="headlineSmall"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Stimolo di oggi
          </Text>

          <Card mode="elevated" style={styles.card}>
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[styles.prompt, { color: theme.colors.onSurface }]}
              >
                Mostra un pezzetto vero
              </Text>

              <Divider style={{ marginVertical: 12, opacity: 0.5 }} />

              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  textAlign: 'center',
                }}
              >
                Se questo stimolo ti ha motivato, pubblica una foto ispirata ad esso — altrimenti
                passa quando vuoi e torna più tardi o al nuovo stimolo.
              </Text>
            </Card.Content>

            <Card.Actions style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
              <Button
                mode="contained"
                icon="camera"
                onPress={() => navigation.navigate('InsertPhotoScreen')}
                style={{ flex: 1, borderRadius: 12 }}
                contentStyle={{ paddingVertical: 8 }}
              >
                Scatta o carica
              </Button>
            </Card.Actions>
          </Card>
        </View>

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
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 18,
    paddingTop: 6,
  },
  prompt: {
    fontWeight: '800',
    textAlign: 'center',
  },
  footer: {
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

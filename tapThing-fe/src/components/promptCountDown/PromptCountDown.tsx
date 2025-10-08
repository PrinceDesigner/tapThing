import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';

type Props = {
  /** Fine prompt (ISO o Date) */
  endsAt: string | Date;
  /** Se lo passi, mostra una progress bar: progresso = (durata - rimanente) / durata */
  totalMs?: number; // es. 23 * 60 * 60 * 1000
  /** Aggiornamento timer (ms) */
  intervalMs?: number; // default 1000
  /** Testo mostrato quando scaduto */
  expiredText?: string; // default "Prompt scaduto"
  /** Prefisso del countdown (es. "Scade tra ") */
  labelPrefix?: string; // default "Scade tra "
  /** Custom renderer per l’etichetta; se ritorna stringa vuota, non mostra nulla */
  renderLabel?: (remainingMs: number, isExpired: boolean) => string;
  /** Arrotonda i secondi */
  floorSeconds?: boolean; // default true
  /** Stile wrapper esterno */
  style?: ViewStyle;
  /** Variante testo (default bodyMedium) */
  variant?: 'labelSmall' | 'bodyMedium'
  /** Se true, il testo sarà colorato con onSecondary (utile su sfondo colorato) */
  onSecondary?: boolean; // default true
};

const toMillisISO = (iso: string) =>
  iso.replace(/(\.\d{3})\d+(?=[Z+\-])/, '$1');

const formatHHMMSS = (ms: number, floorSeconds = true) => {
  const totalSeconds = floorSeconds ? Math.floor(ms / 1000) : Math.round(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const PromptCountdown: React.FC<Props> = ({
  endsAt,
  totalMs,
  intervalMs = 1000,
  expiredText,
  labelPrefix,
  renderLabel,
  floorSeconds = true,
  style,
  variant,
  onSecondary = true,
}) => {
  const theme = useTheme();

  const expiry = useMemo(() => {
    const d = typeof endsAt === 'string' ? new Date(toMillisISO(endsAt)) : endsAt;
    return d.getTime();
  }, [endsAt]);

  const computeRemaining = () => Math.max(0, expiry - Date.now());
  const [remaining, setRemaining] = useState<number>(computeRemaining);

  useEffect(() => {
    setRemaining(computeRemaining());
  }, [expiry]);

  useEffect(() => {
    const tick = () => setRemaining(computeRemaining());
    const id = setInterval(tick, intervalMs);
    tick();
    return () => clearInterval(id);
  }, [intervalMs, expiry]);

  const isExpired = remaining === 0;

  const progress = useMemo(() => {
    if (!totalMs || totalMs <= 0) return undefined;
    const elapsed = Math.min(totalMs, Math.max(0, totalMs - remaining));
    return Math.max(0, Math.min(1, elapsed / totalMs));
  }, [remaining, totalMs]);

  const defaultLabel = isExpired
    ? expiredText
    : `${labelPrefix} ${formatHHMMSS(remaining, floorSeconds)}`;

  const label = renderLabel?.(remaining, isExpired) ?? defaultLabel;

  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Text
          variant={variant ?? 'bodyMedium'}
          style={[styles.label, { color: onSecondary ? theme.colors.onSecondary : theme.colors.onSurface }]}
          accessibilityLabel={isExpired ? 'Prompt scaduto' : 'Tempo rimanente'}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center' },
  label: { fontWeight: '700' },
  progress: { marginTop: 8, height: 6, borderRadius: 8, width: '100%' },
});

// src/components/ui/GlobalLoader.tsx
import { useLoadingStore } from '@/store/loaderStore/loaderGlobalStore';
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const GlobalLoader = () => {
  const { isLoading } = useLoadingStore();
  const { colors } = useTheme();

  if (!isLoading) return null;

  return (
    <View style={[styles.overlay]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
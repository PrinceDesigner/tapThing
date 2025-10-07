// components/BottomSheetGeneral.tsx
import React, { forwardRef, useMemo } from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

export type SheetAction = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export type BottomSheetGeneralProps = {
  snapPoints?: (string | number)[];
  children?: React.ReactNode;
  actions?: SheetAction[]; // bottoni in basso
  onClose?: () => void;
  // opzionale: separatore, padding, ecc.
};

export type BottomSheetGeneralRef = BottomSheetModal;


export const BottomSheetGeneral = forwardRef<BottomSheetGeneralRef, BottomSheetGeneralProps>(
  ({ children, actions = [], snapPoints, onClose }, ref) => {
    const snaps = useMemo(() => snapPoints ?? ['25%', '50%'], [snapPoints]);
    const theme = useTheme();

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        pressBehavior="close" // chiude toccando il backdrop
      />
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snaps}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
        backgroundStyle={{ backgroundColor: theme.colors.secondaryContainer }}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.container}>
          {actions.length > 0 && (
            <View style={styles.actionsRow}>
              {actions.map((a, i) => (
                <TouchableOpacity
                  key={`${a.label}-${i}`}
                  onPress={a.onPress}
                  disabled={a.disabled}
                  style={{
                    marginBottom: 4,
                    padding: 20,
                    backgroundColor:  theme.colors.primaryContainer,
                    borderWidth: 1,
                    borderColor: theme.colors.outline,
                    borderRadius: 12,
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.btnText}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: '600' },
  content: { gap: 8 },
  actionsRow: { flexDirection: 'column', gap: 8, marginTop: 12 },
  btnBase: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', },
  btnText: { color: 'white', fontWeight: '600' },
  btnPressed: { opacity: 0.9 },
  btnDisabled: { opacity: 0.5 },
});

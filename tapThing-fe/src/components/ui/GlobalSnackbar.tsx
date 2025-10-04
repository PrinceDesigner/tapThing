// src/components/GlobalSnackbar.tsx
import { useSnackbarStore } from "@/store/snackbar/snackbar.store";
import { Snackbar, Portal, useTheme } from "react-native-paper";

export const GlobalSnackbar = () => {
  const { message, variant, visible, hide } = useSnackbarStore();
  const theme = useTheme();

  const backgroundColor =
    variant === "error"
      ? theme.colors.error
      : variant === "success"
      ? theme.colors.primary
      : theme.colors.inverseSurface;

  return (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={hide}
        duration={3000}
        style={{ backgroundColor }}
      >
        {message}
      </Snackbar>
    </Portal>
  );
};

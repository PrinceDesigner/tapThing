// src/theme/paperMonoDark.ts
import { MD3DarkTheme, MD3Theme } from "react-native-paper";

const mono = {
  // Base
  bg:           "#000000",
  surface:      "#0A0A0A",
  surfaceVar:   "#111111",
  text:         "#FFFFFF",
  textMuted:    "rgba(255,255,255,0.72)",
  textDisabled: "rgba(255,255,255,0.38)",

  // Accenti (quasi inesistenti: usiamo il bianco come primary)
  primary:      "#FFFFFF",
  onPrimary:    "#000000",

  // Secondari neutri
  secondary:    "#B3B3B3",  // icone/testo secondario
  tertiary:     "#9E9E9E",  // piccoli hint/links, sempre neutro

  // Stato/feedback
  error:        "#FF5A5A",
  onError:      "#000000",

  // Contorni
  outline:      "#2A2A2A",
  outlineVar:   "#1E1E1E",

  // Inverse (per banner/toast)
  inverseSurface:"#FFFFFF",
  inverseOnSurf: "#000000",
  inversePrimary:"#000000",

  // Overlay
  shadow:       "#000000",
  scrim:        "rgba(0,0,0,0.7)",
  backdrop:     "rgba(0,0,0,0.6)",
};

// Elevation: gradazioni leggerissime verso il grigio
const elevation = {
  level0: "transparent",
  level1: "#0D0D0D",
  level2: "#121212",
  level3: "#161616",
  level4: "#1A1A1A",
  level5: "#1F1F1F",
};

export const MonoDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: 12,
  colors: {
    ...MD3DarkTheme.colors,

    // Core
    primary:            mono.primary,
    onPrimary:          mono.onPrimary,
    primaryContainer:   "#1C1C1C",
    onPrimaryContainer: mono.text,

    secondary:            mono.secondary,
    onSecondary:          "#0A0A0A",
    secondaryContainer:   "#1A1A1A",
    onSecondaryContainer: mono.text,

    tertiary:            mono.tertiary,
    onTertiary:          "#0A0A0A",
    tertiaryContainer:   "#1A1A1A",
    onTertiaryContainer: mono.text,

    background:         mono.bg,
    onBackground:       mono.text,

    surface:            mono.surface,
    onSurface:          mono.text,
    surfaceVariant:     mono.surfaceVar,
    onSurfaceVariant:   mono.textMuted,

    surfaceDisabled:    "rgba(255,255,255,0.12)",
    onSurfaceDisabled:  mono.textDisabled,

    error:              mono.error,
    onError:            mono.onError,
    errorContainer:     "#3A0E0E",
    onErrorContainer:   "#FFD6D6",

    outline:            mono.outline,
    outlineVariant:     mono.outlineVar,

    inverseSurface:     mono.inverseSurface,
    inverseOnSurface:   mono.inverseOnSurf,
    inversePrimary:     mono.inversePrimary,

    shadow:             mono.shadow,
    scrim:              mono.scrim,
    backdrop:           mono.backdrop,

    elevation,
  },
};

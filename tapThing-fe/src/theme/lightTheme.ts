// src/theme/paperMonoLight.ts
import { MD3LightTheme, MD3Theme } from "react-native-paper";

const mono = {
  // Base
  bg:           "#FFFFFF",
  surface:      "#f6f6f6ff",
  surfaceVar:   "#F6F6F6",           // liste / toolbar
  text:         "#0A0A0A",
  textMuted:    "rgba(10,10,10,0.72)",
  textDisabled: "rgba(10,10,10,0.38)",

  // Accenti: usiamo il nero come primary
  primary:      "#0A0A0A",
  onPrimary:    "#FFFFFF",

  // Neutri secondari
  secondary:    "#6B6B6B",           // icone/testi secondari
  tertiary:     "#8A8A8A",           // hint/link discreti

  // Stato/feedback (leggermente desaturato ma leggibile)
  error:        "#D32F2F",
  onError:      "#FFFFFF",

  // Contorni
  outline:      "#E2E2E2",
  outlineVar:   "#F0F0F0",

  // Inverse (per banner/toast)
  inverseSurface:"#111111",
  inverseOnSurf: "#FFFFFF",
  inversePrimary:"#FFFFFF",

  // Overlay
  shadow:       "#000000",
  scrim:        "rgba(0,0,0,0.4)",
  backdrop:     "rgba(17,17,17,0.25)",
};

// Elevation: passaggi sottili, quasi impercettibili
const elevation = {
  level0: "transparent",
  level1: "#FFFFFF",  // mantiene look flat
  level2: "#FCFCFC",
  level3: "#FAFAFA",
  level4: "#F7F7F7",
  level5: "#F5F5F5",
};

export const MonoLightTheme: MD3Theme = {
  ...MD3LightTheme,
  dark: false,
  roundness: 12,
  colors: {
    ...MD3LightTheme.colors,

    // Core
    primary:            mono.primary,
    onPrimary:          mono.onPrimary,
    primaryContainer:   "#EDEDED",
    onPrimaryContainer: mono.text,

    secondary:            mono.secondary,
    onSecondary:          "#FFFFFF",
    secondaryContainer:   "#EFEFEF",
    onSecondaryContainer: mono.text,

    tertiary:            mono.tertiary,
    onTertiary:          "#FFFFFF",
    tertiaryContainer:   "#EDEDED",
    onTertiaryContainer: mono.text,

    background:         mono.bg,
    onBackground:       mono.text,

    surface:            mono.surface,
    onSurface:          mono.text,
    surfaceVariant:     mono.surfaceVar,
    onSurfaceVariant:   mono.textMuted,

    surfaceDisabled:    "rgba(10,10,10,0.12)",
    onSurfaceDisabled:  mono.textDisabled,

    error:              mono.error,
    onError:            mono.onError,
    errorContainer:     "#FBE7E7",
    onErrorContainer:   "#4A0D0D",

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

import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';
import {
  Provider as PaperProvider,
  configureFonts,
  adaptNavigationTheme
} from 'react-native-paper';
import { DefaultTheme as NavLight, DarkTheme as NavDark, NavigationContainer } from '@react-navigation/native';

import { MonoLightTheme } from '@/theme/lightTheme';
import TapThingLandingScreen from '@/screens/AuthStackScreen/LandingScreen';
import { MonoDarkTheme } from '@/theme/darkTheme';
import AuthStackNavigation from '@/navigation/AuthStackNavigation/AuthStackNavigation';
import { useEffect, useState } from 'react';
import { initI18n } from './i18n';

export function App() {
  const colorScheme = useColorScheme();
  const [i18nReady, setI18nReady] = useState(false);


  const [loaded] = useFonts({
    'RobotoCondensed-Light': require('./assets/fonts/Roboto_Condensed-Light.ttf'),
    'RobotoCondensed-Regular': require('./assets/fonts/Roboto_Condensed-Regular.ttf'),
    'RobotoCondensed-Medium': require('./assets/fonts/Roboto_Condensed-Medium.ttf'),
    'RobotoCondensed-Bold': require('./assets/fonts/Roboto_Condensed-Bold.ttf'),
  });

  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);


  if (!loaded || !i18nReady) return null;

  // Helper per MD3 fonts
  const M = (family: string, weight: '300' | '400' | '500' | '700', size: number, line: number, letter = 0) => ({
    fontFamily: family,
    fontWeight: weight,
    fontSize: size,
    lineHeight: line,
    letterSpacing: letter,
  });

  const md3Fonts = {
    displayLarge: M('RobotoCondensed-Regular', '400', 57, 64),
    displayMedium: M('RobotoCondensed-Regular', '400', 45, 52),
    displaySmall: M('RobotoCondensed-Regular', '400', 36, 44),
    headlineLarge: M('RobotoCondensed-Regular', '400', 32, 40),
    headlineMedium: M('RobotoCondensed-Regular', '400', 28, 36),
    headlineSmall: M('RobotoCondensed-Regular', '400', 24, 32),
    titleLarge: M('RobotoCondensed-Medium', '500', 22, 28, 0),
    titleMedium: M('RobotoCondensed-Medium', '500', 16, 24, 0.15),
    titleSmall: M('RobotoCondensed-Medium', '500', 14, 20, 0.1),
    labelLarge: M('RobotoCondensed-Medium', '500', 14, 20, 0.1),
    labelMedium: M('RobotoCondensed-Medium', '500', 12, 16, 0.5),
    labelSmall: M('RobotoCondensed-Medium', '500', 11, 16, 0.5),
    bodyLarge: M('RobotoCondensed-Regular', '400', 16, 24, 0.5),
    bodyMedium: M('RobotoCondensed-Regular', '400', 14, 20, 0.25),
    bodySmall: M('RobotoCondensed-Regular', '400', 12, 16, 0.4),
  } as const;

  // Base Paper theme (mono)
  const basePaperTheme = colorScheme === 'dark' ? MonoDarkTheme : MonoLightTheme;

  // Navigation theme adattato da Paper (garantisce compatibilità chiavi)
  const { LightTheme: NavPaperLight, DarkTheme: NavPaperDark } = adaptNavigationTheme({
    reactNavigationLight: NavLight,
    reactNavigationDark: NavDark,
  });

  const baseNavTheme = (colorScheme === 'dark' ? NavPaperDark : NavPaperLight);

  // Unifica: usiamo i colori del tema mono come "fonte", completati da chiavi Navigation
  const unifiedColors = {
    ...baseNavTheme.colors,
    ...basePaperTheme.colors,
    // mapping consigliato per Navigation
    card: basePaperTheme.colors.surface,
    border: basePaperTheme.colors.outline,
    notification: basePaperTheme.colors.primary,
    background: basePaperTheme.colors.background,
    text: basePaperTheme.colors.onBackground,
  };

  // Tema unico da passare sia a Paper che a Navigation
  const appTheme = {
    ...basePaperTheme,
    ...baseNavTheme,
    colors: unifiedColors,
    fonts: configureFonts({ config: md3Fonts, isV3: true }),
  };

  return (
    <PaperProvider theme={appTheme}>
      <NavigationContainer theme={appTheme as any}>
        <AuthStackNavigation />
      </NavigationContainer>
    </PaperProvider>
  );
}

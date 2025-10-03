import 'react-native-reanimated';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from './constants/Colors';
// SplashScreen.preventAutoHideAsync();

export function App() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    RobotoCondensed: require('./assets/fonts/Roboto_Condensed-Regular.ttf'),
    RobotoLightCondensed: require('./assets/fonts/Roboto_Condensed-Light.ttf'),
    RobotoMediumCondensed: require('./assets/fonts/Roboto_Condensed-Medium.ttf'),
    RobotoBoldCondensed: require('./assets/fonts/Roboto_Condensed-Bold.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return null
}

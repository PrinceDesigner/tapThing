import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';
import {
  TextRegular,
  TextLight,
  TextMedium,
  TextBold,
} from "@/components/ui/customText";
import { View } from 'react-native';
import { Colors } from './constants/Colors';
import TapThingLandingScreen from './screens/AuthStackScreen/LandingScreen';

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

 return <TapThingLandingScreen />;  
}

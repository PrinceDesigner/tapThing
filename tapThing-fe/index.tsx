// index.ts / main entry del progetto
import 'react-native-gesture-handler';
import 'react-native-reanimated';
if (__DEV__) {
  // side-effect import: configura Reactotron e setta console.tron
  require('./src/config/zudstandReactotron');
}

import App from '@/App';
// import './gesture-handler';

import '@expo/metro-runtime';
import { registerRootComponent } from 'expo';

registerRootComponent(App);

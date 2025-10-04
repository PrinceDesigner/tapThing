// src/config/reactotron.ts
import Reactotron from 'reactotron-react-native';

declare global {
  interface Console {
    tron?: typeof Reactotron;
  }
}

if (__DEV__) {
  Reactotron
    // SCEGLI l'host giusto:
    // - iOS Simulator: puoi ometterlo
    // - Android Emulator: host: '10.0.2.2'
    // - Device reale (Expo Go): host: '192.168.x.x' (IP del tuo PC)
    .configure({ name: 'tapThing', /* host: '10.0.2.2' */ })
    .useReactNative()
    .connect();

  // 👇 IMPORTANTE: assegna prima di usare console.tron
  (console as any).tron = Reactotron;

  // Smoke test: uno subito...
  Reactotron.log?.('🔌 Reactotron ready');

}

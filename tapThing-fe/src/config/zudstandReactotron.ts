// src/config/reactotron.ts
import Reactotron from 'reactotron-react-native';

declare global {
  interface Console {
    tron?: typeof Reactotron;
  }
}

if (__DEV__) {
  Reactotron
    .configure({ name: 'dree-client' }) // opzionale: { host: 'IP_DEL_TUO_PC' }
    .useReactNative()
    .connect();

  console.tron = Reactotron; // così puoi loggare con console.tron.log()

}
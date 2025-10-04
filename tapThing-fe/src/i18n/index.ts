import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '@/locales/en/common.json';
import it from '@/locales/it/common.json';

const STORAGE_KEY = 'app.lang';

// piccolo helper: restituisce "en", "it", ecc.
const systemLang = (() => {
  const tag = Localization.getLocales?.()[0]?.languageCode || 'en';
  return tag;
})();

export async function initI18n() {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) {
    await AsyncStorage.setItem(STORAGE_KEY, systemLang);
  }
  const lng = stored || systemLang;

  await i18n
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: 'en',
      resources: {
        en: { common: en },
        it: { common: it },
      },
      defaultNS: 'common',
      ns: ['common'],
      interpolation: { escapeValue: false },
      returnEmptyString: false,
    });

  return i18n;
}

export async function setAppLanguage(lang: 'en' | 'it') {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(STORAGE_KEY, lang);
}

export default i18n;

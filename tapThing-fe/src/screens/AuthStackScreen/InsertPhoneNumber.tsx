// src/screens/AuthStackScreen/PhoneAuthScreen.tsx
import { TextBold } from '@/components/ui/customText';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, StatusBar, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/libs/supabase/supabase.client';
import { useLoadingStore } from '@/store/loaderStore/loaderGlobalStore';
import { useSnackbarStore } from '@/store/snackbar/snackbar.store';
import PhoneInput, { IPhoneInputRef, ICountry } from "react-native-international-phone-number";
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';
import { Keyboard } from "react-native";

const PhoneAuthScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+39'); // default IT

  const { setLoading } = useLoadingStore();
  const { show } = useSnackbarStore();

  const isDark = theme.dark;
  const phoneInputRef = useRef<IPhoneInputRef>(null);
  const nav = useNavigation<any>();

  // Numero completo + validazione
  const completePhone = useMemo(() => {
    // Manteniamo solo cifre dalla parte locale (libreria visualizza spazi/separatori)
    const localDigits = phoneNumber.replace(/\D/g, '');
    // Costruiamo E.164 provvisorio: +{countryCodeDigits}{localDigits}
    const prefixDigits = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
    return `${prefixDigits}${localDigits}`;
  }, [phoneNumber, countryCode]);

  const parsedPhone = useMemo(() => {
    try {
      if (!completePhone || completePhone.length < 4) return undefined;
      return parsePhoneNumberFromString(completePhone);
    } catch {
      return undefined;
    }
  }, [completePhone]);

  const isValidPhone = !!parsedPhone?.isValid();

  const handleContinue = async () => {
    // Blocca submit se non valido
    if (!isValidPhone) {
      show(t('invalid_phone') || 'Inserisci un numero di telefono valido', 'error');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    // Invia sempre in E.164 standard (es. +393331234567)
    const phoneToSend = parsedPhone?.number || completePhone;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneToSend,
        options: { channel: 'sms' },
      });

      if (error) {
        show(error.message, 'error');
        return;
      }

      nav.navigate('VerifyOTP', { phone: phoneToSend });
    } catch (err: any) {
      show(err?.message ?? 'Errore inatteso', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background as string}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.centerHead}>
              <TextBold style={[styles.title, { color: theme.colors.onBackground, fontSize: 32 }]}>
                TapThing
              </TextBold>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                {t('enter_phone') || 'Inserisci il tuo numero di telefono'}
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text
                variant="labelLarge"
                style={[styles.label, { color: theme.colors.onSurface }]}
              >
                {t('phone_number') || 'Numero di telefono'}
              </Text>

              <PhoneInput
                ref={phoneInputRef}
                defaultCountry="IT"
                value={phoneNumber}
                onChangePhoneNumber={(value) => {
                  setPhoneNumber(value);
                }}
                onChangeSelectedCountry={(country: ICountry) => {
                  // Alcuni paesi hanno più suffixes: prendiamo il primo come default.
                  const cc = `${country?.idd?.root ?? '+'}${country?.idd?.suffixes?.[0] ?? ''}`.trim();
                  setCountryCode(cc || '+');
                }}
                placeholder={t('phone_placeholder') || 'Inserisci il tuo numero'}
              />

              {/* Errore inline (UX) */}
              {!!phoneNumber && !isValidPhone && (
                <Text variant="bodySmall" style={{ marginTop: 6, color: theme.colors.error }}>
                  {t('invalid_phone') || 'Numero non valido'}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={handleContinue}
                style={styles.cta}
                contentStyle={styles.ctaContent}
                accessibilityLabel="Continue"
                testID="btn-continue"
                disabled={!isValidPhone}
              >
                {t('continue') || 'Continua'}
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                {t('post_photo') || 'Scatta e pubblica per entrare nel feed'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneAuthScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  centerHead: {
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    marginBottom: 6,
  },
  form: {
    marginTop: 12,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    marginBottom: 16,
  },
  cta: {
    borderRadius: 12,
    marginTop: 8,
  },
  ctaContent: {
    height: 52,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 8,
  },
});

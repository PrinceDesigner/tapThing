// src/screens/AuthStackScreen/PhoneAuthScreen.tsx
import { TextBold } from '@/components/ui/customText';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, StatusBar, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';



const PhoneAuthScreen: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.dark;

  const [phone, setPhone] = useState('');

  const { t, i18n } = useTranslation();

  const nav = useNavigation<any>();

  // Validazione semplice: inizia con + e almeno 8 cifre totali (E.164 light)
  const isValid = useMemo(() => /^\+\d{8,15}$/.test(phone.replace(/\s+/g, '')), [phone]);
  const language = i18n.language;

  const handleContinue = () => {
    const normalized = phone.replace(/\s+/g, '');
    if (isValid) {
      // Procedi con l'invio del codice di verifica
      nav.navigate('VerifyOTP', { phone: normalized });
      console.log('Invio codice a:', normalized);
      // Qui puoi integrare la logica per inviare il codice via SMS
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
        keyboardVerticalOffset={80} // se hai header / safearea

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
                {t('enter_phone')}
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text
                variant="labelLarge"
                style={[styles.label, { color: theme.colors.onSurface }]}
              >
                {t('phone_number')}
              </Text>

              <TextInput
                mode="outlined"
                value={phone}
                onChangeText={setPhone}
                placeholder={language === 'it' ? '+39 333 123 4567' : '+1 555 123 4567'}
                keyboardType="phone-pad"
                autoComplete="tel"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                style={styles.input}
                outlineColor={theme.colors.outline}
                theme={{
                  colors: {
                    placeholder: theme.colors.onSurfaceVariant,
                  },
                }}
              />

              <Button
                mode="contained"
                onPress={handleContinue}
                disabled={!isValid}
                style={styles.cta}
                contentStyle={styles.ctaContent}
                accessibilityLabel="Continue"
                testID="btn-continue"
              >
                {t('continue')}
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                {t('post_photo')}
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
  },
  ctaContent: {
    height: 52,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 8,
  },
});

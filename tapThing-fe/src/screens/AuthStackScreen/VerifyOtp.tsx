import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Button,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { supabase } from "@/libs/supabase/supabase.client";
import { useLoadingStore } from "@/store/loaderStore/loaderGlobalStore";
import { useSnackbarStore } from "@/store/snackbar/snackbar.store";
import { Keyboard } from "react-native";


type RouteParams = {
  phone: string;
};

const SLOTS = 6;
const RESEND_SECONDS = 120;

const VerifyOTPScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute();

  const { setLoading } = useLoadingStore();
  const { show } = useSnackbarStore();

  const { t } = useTranslation();
  const { phone = "" } = (route.params as RouteParams) || {};

  const [digits, setDigits] = useState<string[]>(Array(SLOTS).fill(""));
  const [resendIn, setResendIn] = useState<number>(RESEND_SECONDS);
  const inputsRef = useRef<Array<RNTextInput | null>>([]);

  const otp = useMemo(() => digits.join(""), [digits]);
  const isComplete = otp.length === SLOTS && /^\d{6}$/.test(otp);

  useEffect(() => {
    // countdown per resend
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const focusIndex = (i: number) => {
    inputsRef.current[i]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    // supporta incolla di 6 cifre in un campo
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const next = cleaned.slice(0, SLOTS).split("");
      const padded = [...next, ...Array(SLOTS - next.length).fill("")];
      setDigits(padded);
      const lastFilled = Math.min(SLOTS - 1, next.length - 1);
      focusIndex(lastFilled);
      return;
    }

    setDigits((prev) => {
      const copy = [...prev];
      copy[index] = cleaned;
      return copy;
    });

    if (cleaned && index < SLOTS - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (digits[index]) {
        // cancella il corrente
        setDigits((prev) => {
          const copy = [...prev];
          copy[index] = "";
          return copy;
        });
      } else if (index > 0) {
        // vai indietro e cancella
        focusIndex(index - 1);
        setDigits((prev) => {
          const copy = [...prev];
          copy[index - 1] = "";
          return copy;
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: "sms",
      });

      if (error) {
        // handle error (e.g., show a message)
        show(error.message, 'error');
        return;
      }
      // handle successful verification (e.g., navigate)
      // navigation.navigate("Home", { verified: true });
    } catch (err) {
      // handle unexpected errors
      show("An unexpected error occurred. Please try again.", 'error');
    } finally {
      setLoading(false);
    }

    // navigation.navigate("Home", { verified: true });
  };

  const handleResend = () => {
    if (resendIn > 0) return;
    // TODO: logica resend OTP
    setResendIn(RESEND_SECONDS);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={80} // se hai header / safearea

      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
              {t('verify_otp')}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
              {t('enter_code', { phone })}
            </Text>
          </View>

          <View accessibilityLabel="Verification code" style={styles.otpRow}>
            {Array.from({ length: SLOTS }).map((_, i) => (
              <TextInput
                key={i}
                mode="outlined"
                value={digits[i]}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                returnKeyType={i === SLOTS - 1 ? "done" : "next"}
                ref={(r: RNTextInput | null) => { inputsRef.current[i] = r; }}
                maxLength={1}
                style={[styles.otpInput, { borderRadius: 12 }]}
                contentStyle={styles.otpContent}
                autoCorrect={false}
                autoCapitalize="none"
                // su iOS abilita OTP auto-fill
                inputMode="numeric"
              />
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!isComplete}
            style={styles.verifyBtn}
          >
            {t('verify')}
          </Button>

          <Button
            mode="text"
            onPress={handleResend}
            disabled={resendIn > 0}
            textColor={resendIn > 0 ? theme.colors.onSurfaceDisabled : theme.colors.primary}
          >
            {resendIn > 0
              ? t('resend_in', { resendIn })
              : t('didnt_receive_code')}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: {
    paddingHorizontal: 24,
    gap: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "600",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpInput: {
    width: 48,
    height: 56,
    textAlign: "center",
  },
  otpContent: {
    textAlign: "center",
    fontSize: 20,
    letterSpacing: 2,
  },
  verifyBtn: {
    marginTop: 8,
  },
});

export default VerifyOTPScreen;

// screens/ProfiloUpdateScreen.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInput, Button, Text, Avatar, IconButton, useTheme, ActivityIndicator, HelperText } from 'react-native-paper';
import type { User } from '@/api/users/model/user.model';
import { useUserStore } from '@/store/user/user.store';
import { useLoadingStore } from '@/store/loaderStore/loaderGlobalStore';
import { updateCurrentUser } from '@/api/users/users.service';
import { useSnackbarStore } from '@/store/snackbar/snackbar.store';

const ProfiloUpdateScreen = () => {
  const nav = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const { setLoading } = useLoadingStore();
  const { show } = useSnackbarStore();

  // ----- Stato locale del form (inizializzato dai dati reali) -----
  const profile = useUserStore((s) => s.profile);
  const isProfileReady = useUserStore((s) => s.isProfileReady);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const [username, setUsername] = useState('');
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // Quando lo store è pronto o cambia il profilo, popola i campi
  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '');
      setNome(profile.nome ?? '');
      setCognome(profile.cognome ?? '');
      setBio(profile.bio ?? '');
      setAvatarUrl(profile.avatar_url || undefined);
    }
  }, [profile]);

  const displayAvatar = useMemo(
    () => avatarUrl || 'https://i.pravatar.cc/300?img=12',
    [avatarUrl]
  );

  const handleSave = async () => {
    // Qui puoi chiamare la tua API (Supabase/NestJS) e poi usare updateProfile per l’ottimismo.
    const patch: Partial<User> = {
      username: username.trim(),
      nome: nome.trim(),
      cognome: cognome.trim(),
      bio: bio,
      avatar_url: avatarUrl,
    };

    try {
      setLoading(true);
      await updateCurrentUser(patch);
      updateProfile(patch);
      show(t('profile_updated_successfully') || 'Profilo aggiornato', 'success');
      nav.goBack();
    } catch (error) {
      console.error('Errore aggiornando il profilo:', error instanceof Error ? error.message : error);
      if (error instanceof Error) {
        show(error.message, 'error');
      }
    } finally {
      setLoading(false);
    }

  };

  const handleChangeAvatar = async () => {
    // TODO: apri image picker e carica su storage => ottieni URL pubblico
    console.log('Cambio avatar premuto');
    // setAvatarUrl(newUrl);
  };

  if (!isProfileReady) {
    return (
      <View style={[styles.flex, styles.center]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12 }}>{t('loading') || 'Caricamento...'}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.flex, styles.center, { padding: 16 }]}>
        <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 8 }}>
          {t('no_profile_found') || 'Nessun profilo trovato'}
        </Text>
        <Text style={{ textAlign: 'center', opacity: 0.7 }}>
          {t('no_profile_found_hint') ||
            'Accedi o completa l’onboarding per modificare il profilo.'}
        </Text>
        <Button mode="outlined" style={{ marginTop: 16 }} onPress={() => nav.goBack()}>
          {t('back') || 'Indietro'}
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* AVATAR + PENNINA */}
          <View style={styles.avatarWrapper}>
            <Avatar.Image size={120} source={{ uri: displayAvatar }} />
            <IconButton
              icon="pencil"
              size={18}
              onPress={handleChangeAvatar}
              style={[styles.avatarEditBtn, { borderWidth: 1, borderColor: theme.colors.outline }]}
              iconColor={theme.colors.primary}
              containerColor={theme.colors.onPrimary}
              accessibilityLabel={t('change_avatar') || 'Cambia avatar'}
            />
          </View>

          <TextInput
            label="Username"
            mode="outlined"
            value={username}
            onChangeText={(text) => setUsername(text.replace(/\s/g, ''))}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            style={styles.input}
          />


          <TextInput
            label={t('first_name') || 'Nome'}
            mode="outlined"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            style={styles.input}
          />

          <TextInput
            label={t('last_name') || 'Cognome'}
            mode="outlined"
            value={cognome}
            onChangeText={setCognome}
            autoCapitalize="words"
            style={styles.input}
          />

          <TextInput
            label="Bio"
            mode="outlined"
            value={bio}
            onChangeText={setBio}
            multiline
            style={[styles.input, styles.bio]}
            textAlignVertical="top"
            returnKeyType="go"
            onKeyPress={({ nativeEvent}) => {
              if (nativeEvent.key === 'Enter') {
                Keyboard.dismiss();
              }
            }}
          />
          <HelperText style={{ marginTop: -16, marginLeft: -10 }} type={bio.length > 160 ? "error" : "info"} visible>
            {`Caratteri consentiti: ${bio.length}/160`}
          </HelperText>
          <View style={styles.actionRow}>
            <Button mode="contained" onPress={handleSave}>
              {t('save') || 'Salva'}
            </Button>
            <Button mode="outlined" onPress={() => nav.goBack()}>
              {t('back') || 'Indietro'}
            </Button>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: {
    padding: 16,
    paddingBottom: 200,
  },
  /* --- AVATAR --- */
  avatarWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: 0,
    right: -6, // leggera sporgenza per staccarla dal bordo
  },
  input: {
    marginBottom: 16,
  },
  bio: {
    minHeight: 120,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
});

export default ProfiloUpdateScreen;

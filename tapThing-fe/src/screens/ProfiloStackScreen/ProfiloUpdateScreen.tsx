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

import * as ImagePicker from 'expo-image-picker';
import { useAuthClienteStore } from '@/store/auth/AuthClienteStore';
import { uploadImageAndGetUrl } from '@/api/supabase/uploadphoto';
import { usePostQuery } from '@/hook/post/postQuery/postQuery';
import { useActivePrompt } from '@/hook/prompt/useHookPrompts';


const ProfiloUpdateScreen = () => {
  const nav = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const { setLoading } = useLoadingStore();
  const { show } = useSnackbarStore();

  // image
  const [asset, setAsset] = useState<null | { uri: string; width?: number; height?: number }>(null);
  const userId = useAuthClienteStore((s) => s.userId); // { id: string } 

  // ----- Stato locale del form (inizializzato dai dati reali) -----
  const profile = useUserStore((s) => s.profile);
  const isProfileReady = useUserStore((s) => s.isProfileReady);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const [username, setUsername] = useState('');
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const { prompt } = useActivePrompt();

  const { post, patchAuthorOptimistic } = usePostQuery(prompt?.posted_id || '', prompt?.prompt_id || '');




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

  // --- sostituisci il tuo displayAvatar con questo ---
  const displayAvatar = useMemo(
    () => asset?.uri ?? avatarUrl ?? 'https://i.pravatar.cc/300?img=12',
    [asset, avatarUrl]
  );

  // Galleria
  const requestPermissions = async () => {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return lib.status === 'granted';
  };

  // --- migliora la selezione per avere crop 1:1 e solo immagini ---
  const choosePhoto = async () => {
    const ok = await requestPermissions();
    if (!ok) return;

    const res = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      allowsEditing: true,        // per usare aspect
      aspect: [1, 1],             // crop quadrato
      quality: 0.9,
      mediaTypes: ['images'], // <— tipo corretto
    });

    if (!res.canceled) {
      const img = res.assets[0];
      setAsset({ uri: img.uri, width: img.width, height: img.height });
    }
  };

  // --- carica su Supabase SOLO se c'è una nuova immagine in asset ---
  const handleSave = async () => {
    try {
      setLoading(true);

      let newAvatarUrl = avatarUrl;

      if (asset?.uri) {
        const folder = `${userId}/profile`;
        const { url } = await uploadImageAndGetUrl(asset.uri, {
          bucket: 'images',
          folder,
          makePublic: false,
        });
        newAvatarUrl = url;
      }

      const patch: Partial<User> = {
        username: username.trim(),
        nome: nome.trim(),
        cognome: cognome.trim(),
        bio,
        avatar_url: newAvatarUrl, // usa quello nuovo o quello già salvato
      };

      await updateCurrentUser(patch);
      patchAuthorOptimistic({ username: patch.username, avatar_url: patch.avatar_url });

      // Aggiorna lo store locale
      updateProfile(patch);

      // sync locale: se hai appena caricato un file, rendilo l’avatar di default
      setAvatarUrl(newAvatarUrl);
      setAsset(null);

      show(t('profile_updated_successfully') || 'Profilo aggiornato', 'success');
      nav.goBack();
    } catch (error) {
      console.error('Errore aggiornando il profilo:', error);
      if (error instanceof Error) show(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAvatar = async () => {
    await choosePhoto();
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
            onKeyPress={({ nativeEvent }) => {
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

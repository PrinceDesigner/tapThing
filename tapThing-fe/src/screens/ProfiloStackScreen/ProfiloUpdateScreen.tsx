import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
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
import { TextInput, Button, Text, Avatar, IconButton, useTheme } from 'react-native-paper';

const ProfiloUpdateScreen = () => {
  const nav = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const [username, setUsername] = useState('michelerossi');
  const [nome, setNome] = useState('Michele');
  const [cognome, setCognome] = useState('Rossi');
  const [bio, setBio] = useState('Appassionato di fotografia, tecnologia e viaggi.');
  const [avatarUrl] = useState('https://i.pravatar.cc/300?img=12');

  const handleSave = () => {
    console.log('Salva profilo premuto', { username, nome, cognome, bio });
  };

  const handleChangeAvatar = () => {
    console.log('Cambio avatar premuto');
  };

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
            <Avatar.Image size={120} source={{ uri: avatarUrl }} />
            <IconButton
              icon="pencil"
              size={18}
              onPress={handleChangeAvatar}
              style={[styles.avatarEditBtn, { borderWidth: 1, borderColor: theme.colors.outline }]}
              iconColor={theme.colors.primary}
              containerColor={theme.colors.onPrimary}
            />
          </View>

          <TextInput
            label="Username"
            mode="outlined"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <TextInput
            label={t('first_name')}
            mode="outlined"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            style={styles.input}
          />

          <TextInput
            label={t('last_name')}
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
            numberOfLines={5}
            style={[styles.input, styles.bio]}
            textAlignVertical="top"
          />

          <View style={styles.actionRow}>
            <Button mode="contained" onPress={handleSave}>Salva</Button>
            <Button mode="outlined" onPress={() => nav.goBack()}>Indietro</Button>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
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

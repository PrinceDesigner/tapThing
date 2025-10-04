import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';

const ProfiloScreen = () => {
  const { t } = useTranslation();
  const nav = useNavigation<any>();

  const handleEditProfile = () => {
    nav.navigate('ProfiloUpdateScreen');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
        style={styles.avatar}
      />

      <Text style={styles.name}>Michele Rossi</Text>
      <Text style={styles.username}>@michelerossi</Text>

      <Text style={styles.bio}>
        Appassionato di fotografia, tecnologia e viaggi. Amo catturare momenti autentici e condividere storie vere.
      </Text>

      <Button
        mode="contained"
        onPress={handleEditProfile}
        style={styles.button}
      >
        {t('edit_profile_button')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#777',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  button: {
    borderRadius: 24,
    paddingHorizontal: 24,
  },
});

export default ProfiloScreen;

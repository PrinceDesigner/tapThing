import { PostDetail } from '@/api/posts/model/post.model';
import { usePostQuery } from '@/hook/post/postQuery/postQuery';
import { useActivePrompt } from '@/hook/prompt/useHookPrompts';
import { useUserStore } from '@/store/user/user.store';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, Button, Card, Icon, useTheme, Avatar } from 'react-native-paper';

const ProfiloScreen = () => {
  const { t } = useTranslation();
  const profile = useUserStore((s) => s.profile);
  const nav = useNavigation<any>();
  const { prompt } = useActivePrompt();
  const { post } = usePostQuery(prompt?.posted_id || '');

  const handleEditProfile = () => {
    nav.navigate('ProfiloUpdateScreen');
  };


  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{profile?.nome} {profile?.cognome}</Text>
        <Text style={styles.username}>@{profile?.username}</Text>

        <Text style={styles.bio}>
          {profile?.bio}
        </Text>

        <Button
          mode="contained"
          onPress={handleEditProfile}
          style={styles.button}
        >
          {t('edit_profile_button')}
        </Button>
      </View>
    </ScrollView>
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
  card: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: '#eee',
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 10,
  },
  locationText: { opacity: 0.8 },

});

export default ProfiloScreen;

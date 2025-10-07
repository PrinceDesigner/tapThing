import { useDeletePost, usePostQuery } from '@/hook/post/postQuery/postQuery';
import { useActivePrompt } from '@/hook/prompt/useHookPrompts';
import { useUserStore } from '@/store/user/user.store';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Text, Button, useTheme, ActivityIndicator, Portal, Modal } from 'react-native-paper';

import FeedPost from '@/components/feed/feedPost';
import { BottomSheetGeneral } from '@/components/bottomSheetGeneral/BottomSheetGeneral';
import { useBottomSheetGeneral } from '@/hook/useBottomSheetGeneral';

const ProfiloScreen = () => {
  const { t } = useTranslation();

  const profile = useUserStore((s) => s.profile);

  const nav = useNavigation<any>();

  const { prompt } = useActivePrompt();

  const { post } = usePostQuery(prompt?.posted_id || '');

  const { mutate: deletePost, isPending } = useDeletePost();

  const promptTitle = prompt?.title;




  const handleEditProfile = () => {
    // nav.navigate('ProfiloUpdateScreen');
    open();
  };

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
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
        {post && (
          <View style={{ marginHorizontal: 25 }}>
            <Text variant="labelLarge" style={{ textAlign: 'center', marginVertical: 10 }}>{promptTitle}</Text>
            <FeedPost post={post} />
          </View>

        )}
      </ScrollView>

    </>
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
  }
});

export default ProfiloScreen;

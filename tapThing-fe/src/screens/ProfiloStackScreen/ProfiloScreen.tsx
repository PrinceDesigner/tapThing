import { PostDetail } from '@/api/posts/model/post.model';
import { useDeletePost, usePostQuery } from '@/hook/post/postQuery/postQuery';
import { useActivePrompt, useUpdatePromptCache } from '@/hook/prompt/useHookPrompts';
import { useLoadingStore } from '@/store/loaderStore/loaderGlobalStore';
import { useUserStore } from '@/store/user/user.store';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { Text, Button, Card, Icon, useTheme, Avatar, ToggleButton, ActivityIndicator, IconButton, Portal, Modal } from 'react-native-paper';

const ProfiloScreen = () => {
  const { t } = useTranslation();
  const profile = useUserStore((s) => s.profile);
  const nav = useNavigation<any>();
  const { prompt } = useActivePrompt();
  const { post } = usePostQuery(prompt?.posted_id || '');

  const { mutate: deletePost, isPending } = useDeletePost();

  const theme = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const promptTitle = prompt?.title;

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: theme.colors.primaryContainer, padding: 20, margin: 20, borderRadius: 12 };

  const showModalMetodo = () => {
    showModal();
    bottomSheetRef.current?.close();
  }

  

  const handleEditProfile = () => {
    nav.navigate('ProfiloUpdateScreen');
  };
  // preferisci la località del post
  const location = post?.post.city && post?.post.country
    ? `${post.post.city}, ${post.post.country}`
    : t('unknown_location');

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
            <Card style={styles.card}>
              <Card.Title
                title={
                  <View>
                    <Text variant="labelLarge">{`@${post.author.username}`}</Text>
                    <Text variant="labelSmall" style={styles.locationText}>{location}</Text>
                  </View>
                }
                left={(props) => <Avatar.Image {...props} size={40} source={{ uri: post.author.avatar_url }} />}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="dots-vertical"
                    size={28}
                    onPress={() => bottomSheetRef.current?.expand()}
                    style={{ marginRight: 8 }}
                  />
                )}
                style={{ paddingBottom: 0 }}
              />


              <TouchableOpacity activeOpacity={0.8}>
                <Image source={{ uri: post.post.storage_path }} style={styles.image} />
              </TouchableOpacity>

              <View style={styles.content}>
                <View style={styles.statsRow}>
                  {/* Cuore */}
                  <View style={styles.stat}>
                    <ToggleButton
                      icon="heart"
                      value="cuore"
                      style={styles.iconBtn}
                      rippleColor="transparent"
                    />
                    {/* <Text style={styles.statText}>{counts.cuore}</Text> */}
                  </View>

                  {/* Pollice su */}
                  <View style={styles.stat}>
                    <ToggleButton
                      icon="thumb-up"
                      value="pollice_su"
                      style={styles.iconBtn}
                      rippleColor="transparent"
                    />
                    {/* <Text style={styles.statText}>{counts.pollice_su}</Text> */}
                  </View>

                  {/* Pollice giù */}
                  <View style={styles.stat}>
                    <ToggleButton
                      icon="thumb-down"
                      value="pollice_giu"
                      style={styles.iconBtn}
                      rippleColor="transparent"
                    />
                    {/* <Text style={styles.statText}>{counts.pollice_giu}</Text> */}
                  </View>
                </View>
              </View>
            </Card>
          </View>

        )}
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}                         // <— parte chiuso
        snapPoints={['50']}
        backgroundStyle={{ backgroundColor: theme.colors.secondaryContainer }}
        // scegli tu
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}
      // swipe per chiudere
      >
        <BottomSheetView>
          <View style={{ padding: 20, gap: 12, flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => showModalMetodo()}
              style={{
                padding: 20,
                backgroundColor: theme.colors.primaryContainer,
                borderWidth: 1,
                borderColor: theme.colors.outline,
                borderRadius: 12,
                flex: 1,
                alignItems: 'center',
              }}>
              <Text variant="bodyMedium">{t('delete_post')}</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text variant="titleMedium" style={{ marginBottom: 20 }}>{t('are_you_sure_delete_post')}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>

            <Button mode="contained"
              disabled={isPending}
              onPress={() => {
                if (post) {
                  deletePost(post.post.id);
                  hideModal();
                }
              }} loading={isPending}>
              {t('yes_delete')}
            </Button>
          </View>
        </Modal>
      </Portal>
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
  locationText: { opacity: 0.8 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderRadius: 999,
    width: 34,
    height: 34,
    justifyContent: 'center',
  },
  statText: {
    fontSize: 14,
    opacity: 0.75,
  },

});

export default ProfiloScreen;

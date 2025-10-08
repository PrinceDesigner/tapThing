import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, AccessibilityInfo, Pressable } from 'react-native';
import { Emoji, PostDetail, Reactions } from '@/api/posts/model/post.model';
import { ActivityIndicator, Avatar, Button, Card, IconButton, Modal, Portal, Text, ToggleButton, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import ImageViewing from 'react-native-image-viewing';
import { Image as ExpoImage } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { BottomSheetGeneral } from '../bottomSheetGeneral/BottomSheetGeneral';
import { useBottomSheetGeneral } from '@/hook/useBottomSheetGeneral';
import { useDeletePost } from '@/hook/post/postQuery/postQuery';
import { useActivePrompt } from '@/hook/prompt/useHookPrompts';
import { usePinchPan } from '@/hook/usePinchPanAnimate/usePinchPan';
import { useShareSnapshot } from '@/hook/shareSnapshot/useShareSnapshot';
import { MOCK_AVATAR } from '@/constants/mockAvatar';
import { useUserStore } from '@/store/user/user.store';
import { useNavigation } from '@react-navigation/native';

interface FeedPostProps {
  post: PostDetail;
  currentPrompt?: any; // Aggiungi prop opzionale
}

const FeedPost = ({ post, currentPrompt }: FeedPostProps) => {

  const theme = useTheme();
  const { t } = useTranslation();

  const { mutate: deletePost, isPending } = useDeletePost(currentPrompt?.prompt_id || '');

  const profile = useUserStore((s) => s.profile);
  const nav = useNavigation<any>();

  const { author, post: postData, reactions } = post;
  const [shareMode, setShareMode] = useState(false);

  // share
  const { SnapTarget, share, busy } = useShareSnapshot({
    // width: 1080, height: 1350, format: "png",
    onBeforeShare: () => setShareMode(true),
    onAfterShare: () => setShareMode(false),
  });

  // Pinch & Pan
  const { composed, animatedStyle } = usePinchPan();

  const sheet = useBottomSheetGeneral();
  const open = () => sheet.present();

  const [visible, setVisible] = React.useState(false);

  // Modal elimina
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: theme.colors.primaryContainer, padding: 20, margin: 20, borderRadius: 12 };

  const showModalMetodo = () => {
    showModal();
    sheet.dismiss();
  }

  const [imgLoaded, setImgLoaded] = useState(false);
  const postId = postData.id;
  const isPostOnPrompt = currentPrompt?.posted_id === postId;

  const actionsBottomSheet = useMemo(
    () =>
      isPostOnPrompt
        ? [{ label: t('share_mode'), onPress: () => { share().catch(console.warn); sheet.dismiss(); }, disabled: busy }, { label: t('delete_post'), onPress: showModalMetodo }]
        : [{ label: t('share_mode'), onPress: () => { share().catch(console.warn); sheet.dismiss(); }, disabled: busy }],
    [isPostOnPrompt, showModalMetodo]
  );

  // Derivati memo
  const location = useMemo(() => {
    const { city, country } = postData;
    return city && country ? `${city}, ${country}` : t('unknown_location');
  }, [postData.city, postData.country, t]);

  const avatarSource = useMemo(() => ({ uri: author.avatar_url || MOCK_AVATAR }), [author.avatar_url]);
  const imageSource = useMemo(() => ({ uri: postData.storage_path } as const), [postData.storage_path]);

  const goToProfile = useCallback((postId: string) => {
    if (author.id === profile?.user_id) {
      nav.navigate('Profile', { screen: 'ProfiloScreen', params: { fromFeed: true } });
    } else {
      nav.navigate('ProfileUserNotMe', { postId });
    }
  }, [author.id, nav, profile?.user_id]);

  return (
    <>
      <GestureDetector gesture={composed}>
        <SnapTarget>
          <Card elevation={0} style={styles.card}>
            <Card.Title
              titleStyle={{ marginBottom: -4 }}
              title={
                <Pressable
                  style={{ flexDirection: 'column', justifyContent: 'center' }}
                  onPress={() => goToProfile(postData.id)}>
                  <Text variant="labelLarge">{`@${author.username}`}</Text>
                  <Text variant="labelSmall" style={styles.locationText}>{location}</Text>
                </Pressable>
              }
              titleVariant="titleMedium"
              left={(props) => {
                return (
                  <Pressable onPress={() => goToProfile(postData.id)}>
                    <Avatar.Image {...props} source={avatarSource} size={40} />
                  </Pressable>
                );
              }}
              leftStyle={{ marginRight: 10, marginLeft: 0 }}
              right={(props) => (
                <IconButton
                  {...props}
                  onPress={open}
                  icon="dots-vertical"
                  size={28}
                  style={{ marginRight: 8 }}
                />
              )}
            />

            <View style={styles.imageWrapper}>
              {!imgLoaded && <View style={styles.imageSkeleton} />}
              <Animated.View style={[animatedStyle]}>
                <ExpoImage
                  source={imageSource}
                  style={[styles.image]}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="disk"
                  onLoadStart={() => setImgLoaded(false)}
                  onLoadEnd={() => setImgLoaded(true)}
                />
              </Animated.View>
            </View>
            {
              shareMode &&
              <View>
                <View style={{ paddingLeft: 16, paddingBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>TapThing</Text>
                </View>
                <View style={{ paddingHorizontal: 16 }}>
                  <Text variant='labelLarge' style={{ textAlign: 'center' }}>{currentPrompt?.title}</Text>
                </View>
              </View>

            }
          </Card>
        </SnapTarget>
      </GestureDetector>


      <BottomSheetGeneral
        ref={sheet.ref}
        snapPoints={['50%']} // opzionale
        actions={actionsBottomSheet}
        onClose={() => {
          // cleanup/log
        }}
      />

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

// Evita re-render se non cambiano le parti importanti
function areEqual(prev: Readonly<FeedPostProps>, next: Readonly<FeedPostProps>) {
  const a = prev.post;
  const b = next.post;

  if (a.post.id !== b.post.id) return false;
  if (a.post.storage_path !== b.post.storage_path) return false;
  if (a.author.username !== b.author.username) return false;
  if (a.author.avatar_url !== b.author.avatar_url) return false;
  if (a.post.city !== b.post.city || a.post.country !== b.post.country) return false;

  const toMap = (r: Reactions) => {
    const m: Record<string, number> = {};
    for (const it of r.byEmoji) m[it.shortcode] = it.count ?? 0;
    return m;
  };
  const am = toMap(a.reactions), bm = toMap(b.reactions);
  const keys = new Set([...Object.keys(am), ...Object.keys(bm)]);
  for (const k of keys) if ((am[k] ?? 0) !== (bm[k] ?? 0)) return false;

  return true;
}

export default memo(FeedPost, areEqual);

const styles = StyleSheet.create({
  card: {
    // marginBottom: 14,
    borderRadius: 16,
    // overflow: 'hidden',
  },
  locationText: { opacity: 0.8 },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // paddingHorizontal: 12,
    // paddingVertical: 15,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 4 / 5,
    position: 'relative',
  },
  image: {
    aspectRatio: 4 / 5,
  },
  imageSkeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e6e6e6',
    borderRadius: 6,
  },
});

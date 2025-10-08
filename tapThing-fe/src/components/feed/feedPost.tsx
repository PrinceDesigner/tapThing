import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { PostDetail, Reactions } from '@/api/posts/model/post.model';
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

interface FeedPostProps {
  post: PostDetail;
}

type Shortcode = 'cuore' | 'pollice_su' | 'pollice_giu';
type CountsMap = Record<Shortcode, number>;

const EMPTY_COUNTS: CountsMap = { cuore: 0, pollice_su: 0, pollice_giu: 0 };

const toCountsMap = (r: Reactions): CountsMap => {
  const base: CountsMap = { ...EMPTY_COUNTS };
  r.byEmoji.forEach((b) => {
    base[b.shortcode] = b.count ?? 0;
  });
  return base;
};

const FeedPost = ({ post }: FeedPostProps) => {

  const theme = useTheme();
  const { t } = useTranslation();

  const { prompt } = useActivePrompt();
  const { mutate: deletePost, isPending } = useDeletePost(prompt?.prompt_id || '');
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

  const [selectedReaction, setSelectedReaction] = useState<Record<string, Shortcode | null>>({});
  const [countsDeltaByPost, setCountsDeltaByPost] = useState<Record<string, CountsMap>>({});
  const [imgLoaded, setImgLoaded] = useState(false);

  const postId = postData.id;
  const isPostOnPrompt = prompt?.posted_id === postId;

  const actionsBottomSheet = useMemo(
    () =>
      isPostOnPrompt
        ? [{ label: t('share_mode'), onPress: () => { share().catch(console.warn); sheet.dismiss(); }, disabled: busy }, { label: t('delete_post'), onPress: showModalMetodo }]
        : [{ label: t('share_mode'), onPress: () => { share().catch(console.warn); sheet.dismiss(); }, disabled: busy }],
    [isPostOnPrompt, showModalMetodo]
  );


  // Derivati memo
  const baseCounts = useMemo(() => toCountsMap(reactions), [reactions]);

  const delta = countsDeltaByPost[postId] ?? EMPTY_COUNTS;
  const displayedCounts = useMemo<CountsMap>(
    () => ({
      cuore: baseCounts.cuore + (delta.cuore ?? 0),
      pollice_su: baseCounts.pollice_su + (delta.pollice_su ?? 0),
      pollice_giu: baseCounts.pollice_giu + (delta.pollice_giu ?? 0),
    }),
    [baseCounts, delta]
  );

  const location = useMemo(() => {
    const { city, country } = postData;
    return city && country ? `${city}, ${country}` : t('unknown_location');
  }, [postData.city, postData.country, t]);

  const avatarSource = useMemo(() => ({ uri: author.avatar_url || MOCK_AVATAR }), [author.avatar_url]);
  const imageSource = useMemo(() => ({ uri: postData.storage_path } as const), [postData.storage_path]);

  const currentSelected = selectedReaction[postId] ?? null;

  const handleChangeReaction = useCallback(
    (postIdParam: string, nextRaw: Shortcode | null) => {
      setSelectedReaction((prev) => {
        const prevReaction = prev[postIdParam] ?? null;
        const toggledOff = prevReaction !== null && prevReaction === nextRaw;
        const next = toggledOff ? null : nextRaw;

        setCountsDeltaByPost((rc) => {
          const curr = rc[postIdParam] ?? { ...EMPTY_COUNTS };
          const updated: CountsMap = { ...curr };
          if (prevReaction) updated[prevReaction] = (updated[prevReaction] ?? 0) - 1;
          if (next && next !== prevReaction) updated[next] = (updated[next] ?? 0) + 1;
          return { ...rc, [postIdParam]: updated };
        });


        return { ...prev, [postIdParam]: next };
      });
    },
    [t]
  );


  return (
    <>
      <GestureDetector gesture={composed}>
        <SnapTarget>
          <Card elevation={0} style={styles.card}>
            <Card.Title
              title={
                <View>
                  <Text variant="labelLarge">{`@${author.username}`}</Text>
                  <Text variant="labelSmall" style={styles.locationText}>{location}</Text>
                </View>
              }
              titleVariant="titleMedium"
              left={(props) => <Avatar.Image {...props} size={30} source={avatarSource} />}
              leftStyle={{ marginRight: 0, marginLeft: 0 }}
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

            <Card.Actions style={styles.content}>
              <View style={styles.statsRow}>
                {/* Cuore */}
                <View style={styles.stat}>
                  <ToggleButton
                    icon="heart"
                    value="cuore"
                    iconColor={currentSelected === 'cuore' ? 'red' : undefined}
                    onPress={() => handleChangeReaction(postId, 'cuore')}
                    style={styles.iconBtn}
                    rippleColor="transparent"
                  />
                  <Text style={styles.statText}>{displayedCounts.cuore}</Text>
                </View>

                {/* Pollice su */}
                <View style={styles.stat}>
                  <ToggleButton
                    icon="thumb-up"
                    value="pollice_su"
                    iconColor={currentSelected === 'pollice_su' ? 'rgb(41, 41, 226)' : undefined}
                    onPress={() => handleChangeReaction(postId, 'pollice_su')}
                    style={styles.iconBtn}
                    rippleColor="transparent"
                  />
                  <Text style={styles.statText}>{displayedCounts.pollice_su}</Text>
                </View>

                {/* Pollice giù */}
                <View style={styles.stat}>
                  <ToggleButton
                    icon="thumb-down"
                    value="pollice_giu"
                    iconColor={currentSelected === 'pollice_giu' ? 'rgba(102, 42, 42, 0.986)' : undefined}
                    onPress={() => handleChangeReaction(postId, 'pollice_giu')}
                    style={styles.iconBtn}
                    rippleColor="transparent"
                  />
                  <Text style={styles.statText}>{displayedCounts.pollice_giu}</Text>
                </View>
              </View>
            </Card.Actions>
            {
              shareMode &&
              <View>
                <View style={{ paddingLeft: 16, paddingBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>TapThing</Text>
                </View>
                <View style={{ paddingHorizontal: 16 }}>
                  <Text variant='labelLarge' style={{ textAlign: 'center' }}>{prompt?.title}</Text>
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
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // paddingHorizontal: 12,
    // paddingVertical: 15,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
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

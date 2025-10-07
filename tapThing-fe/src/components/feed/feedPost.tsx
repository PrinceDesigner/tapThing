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

  const { mutate: deletePost, isPending } = useDeletePost();

  // --- Shared values ---
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Pinch: consenti solo >= 1, e al rilascio resetta tutto
  const pinchGesture = Gesture.Pinch()              // ⬅️ importante
    .onBegin(() => {
      // fotografa lo stato corrente di scala per il pinch corrente
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      // blocca lo zoom minimo a 1
      const next = Math.max(1, savedScale.value * e.scale);
      scale.value = next;
    })
    .onFinalize(() => {
      // appena "lascio lo zoom": torna tutto iniziale
      scale.value = withTiming(1, { duration: 180 });
      savedScale.value = 1;

      translateX.value = withTiming(0, { duration: 180 });
      translateY.value = withTiming(0, { duration: 180 });
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    });

  // Pan: attivo solo quando zoom > 1; si muove finché il pinch è attivo
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .minPointers(2)
    .onUpdate((e) => {
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],

  }));


  const sheet = useBottomSheetGeneral();

  const open = () => sheet.present();

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: theme.colors.primaryContainer, padding: 20, margin: 20, borderRadius: 12 };

  const showModalMetodo = () => {
    showModal();
    sheet.dismiss();
  }


  const { t } = useTranslation();
  const { author, post: postData, reactions } = post;

  const { prompt } = useActivePrompt();

  const [selectedReaction, setSelectedReaction] = useState<Record<string, Shortcode | null>>({});
  const [countsDeltaByPost, setCountsDeltaByPost] = useState<Record<string, CountsMap>>({});
  const [imgLoaded, setImgLoaded] = useState(false);

  const postId = postData.id;
  const isPostOnPrompt = prompt?.posted_id === postId;

  const actionsBottomSheet = useMemo(
    () =>
      isPostOnPrompt
        ? [{ label: 'Elimina', onPress: showModalMetodo }]
        : [],
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

  const avatarSource = useMemo(() => ({ uri: author.avatar_url }), [author.avatar_url]);
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
        </Card>
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

export default FeedPost;

const styles = StyleSheet.create({
  card: {
    // marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
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

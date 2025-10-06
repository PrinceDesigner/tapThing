import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Card, ToggleButton, Avatar, useTheme, Text, Icon, ActivityIndicator, Button, FAB } from 'react-native-paper';
import ImageViewing from 'react-native-image-viewing';
import { FlashList } from '@shopify/flash-list';
import { useActivePrompt } from '@/hook/prompt/useHookPrompts';
import { PostDetail, Reactions } from '@/api/posts/model/post.model';
import { usePostInfinite } from '@/hook/post/postQuery/postQuery';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';




// ======== Mappa helper ========
type Shortcode = 'cuore' | 'pollice_su' | 'pollice_giu';
type CountsMap = Record<Shortcode, number>;

const toCountsMap = (r: Reactions): CountsMap => {
  const base: CountsMap = { cuore: 0, pollice_su: 0, pollice_giu: 0 };
  r.byEmoji.forEach(b => {
    base[b.shortcode] = b.count ?? 0;
  });
  return base;
};

// ======== UI Component ========
const FeedScreen: React.FC = () => {
  const theme = useTheme();
  const { prompt } = useActivePrompt();
  const { t } = useTranslation();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = usePostInfinite(prompt?.prompt_id, { pageSize: 10 });


  const MOCK_POST_DETAILS = data?.pages.flatMap((p) => p.posts) ?? [];

  // stato: reazione selezionata per post
  const [selectedReaction, setSelectedReaction] = useState<Record<string, Shortcode | null>>({});

  // stato: conteggi per post (shortcode -> count)
  const [countsByPost, setCountsByPost] = useState<Record<string, CountsMap>>(
    () =>
      Object.fromEntries(
        MOCK_POST_DETAILS.map(pd => [pd.post.id, toCountsMap(pd.reactions)])
      )
  );

  // image viewer
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);


  const imagesForViewer = useMemo(
    () => MOCK_POST_DETAILS.map(pd => ({ uri: pd.post.storage_path })),
    []
  );


  const handleChangeReaction = useCallback((postId: string, nextRaw: Shortcode | null) => {
    setSelectedReaction(prev => {
      const prevReaction = prev[postId] ?? null;
      const toggledOff = prevReaction !== null && prevReaction === nextRaw;
      const next = toggledOff ? null : (nextRaw as Shortcode | null);

      setCountsByPost(rc => {
        const current = rc[postId] ?? { cuore: 0, pollice_su: 0, pollice_giu: 0 };
        const updated: CountsMap = { ...current };

        if (prevReaction) {
          updated[prevReaction] = Math.max(0, updated[prevReaction] - 1);
        }
        if (next && next !== prevReaction) {
          updated[next] = (updated[next] ?? 0) + 1;
        }
        return { ...rc, [postId]: updated };
      });

      return { ...prev, [postId]: next };
    });
  }, []);

  const openViewerAt = useCallback((index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  }, []);

  const keyExtractor = useCallback((item: PostDetail) => item.post.id, []);

  const renderItem = useCallback(
    ({ item, index }: { item: PostDetail; index: number }) => {
      const postId = item.post.id;
      const selected = selectedReaction[postId] ?? null;
      const counts = countsByPost[postId] ?? { cuore: 0, pollice_su: 0, pollice_giu: 0 };

      // preferisci la località del post
      const location = item.post.city && item.post.country
        ? `${item.post.city}, ${item.post.country}`
        : t('unknown_location');

      return (
        <Card style={styles.card}>
          <Card.Title
            title={
              <View style={styles.locationRow}>
                <Text variant="labelLarge">{`@${item.author.username}`}</Text>
                <Text variant="labelSmall" style={styles.locationText}>{location}</Text>
              </View>
            }
            titleVariant="titleMedium"
            left={(props) => <Avatar.Image {...props} size={40} source={{ uri: item.author.avatar_url }} />}
          />

          <TouchableOpacity activeOpacity={0.8} onPress={() => openViewerAt(index)}>
            <Image source={{ uri: item.post.storage_path }} style={styles.image} />
          </TouchableOpacity>

          <View style={styles.content}>

            <View style={styles.statsRow}>
              {/* Cuore */}
              <View style={styles.stat}>
                <ToggleButton
                  icon="heart"
                  value="cuore"
                  iconColor={selected === 'cuore' ? 'red' : undefined}
                  onPress={() => handleChangeReaction(postId, 'cuore')}
                  style={styles.iconBtn}
                  rippleColor="transparent"
                />
                <Text style={styles.statText}>{counts.cuore}</Text>
              </View>

              {/* Pollice su */}
              <View style={styles.stat}>
                <ToggleButton
                  icon="thumb-up"
                  value="pollice_su"
                  iconColor={selected === 'pollice_su' ? 'rgb(41, 41, 226)' : undefined}
                  onPress={() => handleChangeReaction(postId, 'pollice_su')}
                  style={styles.iconBtn}
                  rippleColor="transparent"
                />
                <Text style={styles.statText}>{counts.pollice_su}</Text>
              </View>

              {/* Pollice giù */}
              <View style={styles.stat}>
                <ToggleButton
                  icon="thumb-down"
                  value="pollice_giu"
                  iconColor={selected === 'pollice_giu' ? 'rgba(102, 42, 42, 0.986)' : undefined}
                  onPress={() => handleChangeReaction(postId, 'pollice_giu')}
                  style={styles.iconBtn}
                  rippleColor="transparent"
                />
                <Text style={styles.statText}>{counts.pollice_giu}</Text>
              </View>
            </View>
          </View>
        </Card>
      );
    },
    [handleChangeReaction, openViewerAt, countsByPost, selectedReaction, theme.colors.primary]
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Text style={{ textAlign: 'center' }}>{t('post_loading_error')}</Text>
        <Button mode="contained" onPress={() => refetch()} style={{ marginTop: 16 }}>
          {t('retry')}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outline,
          backgroundColor: theme.colors.surface,
        }}
      >
        <Text
          variant="titleMedium"
          style={{ letterSpacing: 0.2, color: theme.colors.onSurface, fontWeight: '700', textAlign: 'center' }}
        >
          {prompt?.title}
        </Text>
      </View>

      <FlashList
        onRefresh={refetch}
        data={MOCK_POST_DETAILS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        scrollEventThrottle={16}

      />

      <ImageViewing
        images={imagesForViewer}
        imageIndex={viewerIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    padding: 12,
    paddingBottom: 24,
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
    paddingVertical: 15,
  },
  locationRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // gap: 6,
    // marginVertical: 10,
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
  }
});

export default FeedScreen;

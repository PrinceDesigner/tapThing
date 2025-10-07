import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, RefreshControl } from 'react-native';
import { useTheme, Text, ActivityIndicator, Button, FAB } from 'react-native-paper';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import type { FlashList as FlashListType } from '@shopify/flash-list';
import { useActivePrompt } from '@/hook/prompt/useHookPrompts';
import { PostDetail } from '@/api/posts/model/post.model';
import { usePostInfinite } from '@/hook/post/postQuery/postQuery';
import { useTranslation } from 'react-i18next';
import FeedPost from '@/components/feed/feedPost';
import { Image } from 'expo-image';

const SCROLL_TO_TOP_THRESHOLD = 350;
const PREFETCH_AHEAD = 12;
const INITIAL_PREFETCH = 24;

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

  const posts = useMemo<PostDetail[]>(
    () => data?.pages.flatMap((p) => p.posts) ?? [],
    [data]
  );

  type FlashListRef = React.ComponentRef<typeof FlashList<PostDetail>>;

  const listRef = useRef<FlashListRef>(null);
  // FAB scroll-to-top
  const [showFab, setShowFab] = useState(false);
  const lastFabStateRef = useRef(false);
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const next = y > SCROLL_TO_TOP_THRESHOLD;
    if (next !== lastFabStateRef.current) {
      lastFabStateRef.current = next;
      setShowFab(next);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  // ---- PREFETCH HELPERS ----
  const prefetched = useRef<Set<string>>(new Set());
  const doPrefetch = useCallback(async (urls: string[]) => {
    const uniq = urls
      .map((u) => (u ?? '').trim())
      .filter((u) => u && !prefetched.current.has(u));
    if (!uniq.length) return;
    uniq.forEach((u) => prefetched.current.add(u));
    try {
      await Image.prefetch(uniq, 'disk'); // coerente con cachePolicy="disk"
    } catch { }
  }, []);

  // Prefetch iniziale
  useEffect(() => {
    if (!posts.length) return;
    const initial = posts.slice(0, INITIAL_PREFETCH).map((p) => p.post.storage_path);
    doPrefetch(initial);
  }, [posts, doPrefetch]);

  // Viewability (prefetch “just-in-time”)
  const lastEndRef = useRef(-1);

  // IMPORTANTISSIMO: mantieni stabile ref/callback come richiede RN
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 10, // considera visibile se >=10%
    // minimumViewTime: 50,          // opzionale
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (!viewableItems?.length) return;
      const indices = viewableItems
        .map(v => (v.index ?? -1))
        .filter(i => i >= 0);
      if (!indices.length) return;

      const end = Math.max(...indices);
      if (end <= lastEndRef.current) return;
      lastEndRef.current = end;

      const start = Math.min(end + 1, posts.length);
      const stop = Math.min(end + PREFETCH_AHEAD, posts.length - 1);
      if (start > stop) return;

      const aheadUrls = posts.slice(start, stop + 1).map(p => p.post.storage_path);
      doPrefetch(aheadUrls);
    }
  ).current;

  // --- renderItem e keyExtractor memoizzati
  const renderItem = useCallback<ListRenderItem<PostDetail>>(
    ({ item }) => {
      return <FeedPost post={item} />;
    },
    []
  );

  const keyExtractor = useCallback((item: PostDetail) => item.post.id, []);

  // --- loading / error
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
      <View style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outline,
        backgroundColor: theme.colors.surface,
      }}>
        <Text
          variant="titleMedium"
          style={{
            letterSpacing: 0.2,
            color: theme.colors.onSurface,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          {prompt?.title}
        </Text>
      </View>

      <FlashList
        ref={listRef}
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={refetch} />
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ paddingVertical: 32, alignItems: 'center' }}>
              <Text>{t('no_posts_available') ?? 'No posts available'}</Text>
            </View>
          ) : null
        }
        // // Viewability API (supportata): perfetta per prefetch e impression
        // onViewableItemsChanged={onViewableItemsChanged}
        // viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      />

      {showFab && (
        <FAB
          icon="arrow-up"
          onPress={scrollToTop}
          style={styles.fab}
          mode="elevated"
          size="medium"
          accessibilityLabel={t('back_to_top') ?? "Torna all'inizio"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingBottom: 24,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
});

export default FeedScreen;

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, ToggleButton, Avatar, useTheme, Text, Icon } from 'react-native-paper';
import ImageViewing from 'react-native-image-viewing';
import { FlashList } from '@shopify/flash-list';

type Post = {
  id: string;
  username: string;
  avatar: string;
  image: string;
  location: string;
};

type ReactionKey = 'heart' | 'up' | 'down';
type ReactionCounts = Record<ReactionKey, number>;

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    username: 'michelerossi',
    avatar: 'https://i.pravatar.cc/100?img=12',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop',
    location: 'Roma, Italia',
  },
  {
    id: '2',
    username: 'giulia.b',
    avatar: 'https://i.pravatar.cc/100?img=32',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop',
    location: 'Sardegna, Italia',
  },
  {
    id: '3',
    username: 'andrea_dev',
    avatar: 'https://i.pravatar.cc/100?img=5',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop',
    location: 'Dolomiti, Italia',
  },
];

const INITIAL_COUNTS: Record<string, ReactionCounts> = {
  '1': { heart: 12, up: 5, down: 1 },
  '2': { heart: 3, up: 9, down: 0 },
  '3': { heart: 0, up: 2, down: 1 },
};

const IMAGE_RATIO = 1.2;

/**
 * Stima dell'altezza item:
 * - Card.Title ~ 56
 * - Image: dipende dalla larghezza schermo; come stima usiamo 320px / ratio 1.2 ≈ 266
 * - Content (location + stats) ~ 64
 * - Margini/padding vari ~ 24
 */
const ESTIMATED_ITEM_SIZE = 56 + 266 + 64 + 24; // ~410

const FeedScreen: React.FC = () => {
  const theme = useTheme();

  const [reactions, setReactions] = useState<Record<string, ReactionKey | null>>({});
  const [reactionCounts, setReactionCounts] = useState<Record<string, ReactionCounts>>(INITIAL_COUNTS);

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const imagesForViewer = useMemo(() => MOCK_POSTS.map(p => ({ uri: p.image })), []);

  const handleChangeReaction = useCallback((postId: string, nextRaw: string | null) => {
    setReactions(prev => {
      const prevReaction = prev[postId] ?? null;
      const toggledOff = prevReaction !== null && prevReaction === nextRaw;
      const next = toggledOff ? null : (nextRaw as ReactionKey | null);

      setReactionCounts(rc => {
        const current = rc[postId] ?? { heart: 0, up: 0, down: 0 };
        const updated: ReactionCounts = { ...current };

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

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => {
      const selected = reactions[item.id] ?? '';
      const counts = reactionCounts[item.id] ?? { heart: 0, up: 0, down: 0 };

      return (
        <Card style={styles.card}>
          <Card.Title
            title={`@${item.username}`}
            titleVariant="titleMedium"
            left={(props) => <Avatar.Image {...props} size={40} source={{ uri: item.avatar }} />}
          />

          <TouchableOpacity activeOpacity={0.8} onPress={() => openViewerAt(index)}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.locationRow}>
              <Icon source="map-marker" size={18} color={theme.colors.primary} />
              <Text variant="labelLarge" style={styles.locationText}>{item.location}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <ToggleButton
                  icon="heart"
                  iconColor={selected === 'heart' ? 'red' : undefined}
                  value="heart"
                  onPress={() => handleChangeReaction(item.id, 'heart')}
                  style={styles.iconBtn}
                  rippleColor="transparent"
                />
                <Text style={styles.statText}>{counts.heart}</Text>
              </View>

              <View style={styles.stat}>
                <ToggleButton
                  icon="thumb-up"
                  value="up"
                  iconColor={selected === 'up' ? 'rgb(41, 41, 226)' : undefined}
                  onPress={() => handleChangeReaction(item.id, 'up')}
                  style={styles.iconBtn}
                  rippleColor="transparent"
                />
                <Text style={styles.statText}>{counts.up}</Text>
              </View>

              <View style={styles.stat}>
                <ToggleButton
                  icon="thumb-down"
                  iconColor={selected === 'down' ? 'rgba(102, 42, 42, 0.986)' : undefined}
                  value="down"
                  onPress={() => handleChangeReaction(item.id, 'down')}
                  style={styles.iconBtn}
                  rippleColor="transparent"
                />
                <Text style={styles.statText}>{counts.down}</Text>
              </View>
            </View>
          </View>
        </Card>
      );
    },
    [handleChangeReaction, openViewerAt, reactionCounts, reactions, theme.colors.primary]
  );

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
          Racconta un momento speciale della tua giornata!
        </Text>
      </View>

      <FlashList
        data={MOCK_POSTS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    aspectRatio: IMAGE_RATIO,
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

export default FeedScreen;

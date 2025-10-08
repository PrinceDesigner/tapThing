import { useDeletePost, usePostQuery } from '@/hook/post/postQuery/postQuery';
import { useActivePrompt } from '@/hook/prompt/useHookPrompts';
import { useUserStore } from '@/store/user/user.store';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, Button, ActivityIndicator } from 'react-native-paper';

import FeedPost from '@/components/feed/feedPost';
import { HeaderTitle } from '@react-navigation/elements';

const ProfileUserNotMe = () => {
    const params = useRoute().params as { postId: string };
    const postId = params?.postId;

    const { t } = useTranslation();
    const nav = useNavigation<any>();
    const { prompt } = useActivePrompt();
    const { post, isLoading } = usePostQuery(postId, prompt?.prompt_id || '');
    const { author } = post || {};
    const promptTitle = prompt?.title;

    return (
        <>
            <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
                <View style={styles.container}>
                    <Image
                        source={{ uri: author?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                        style={styles.avatar}
                    />

                    <Text style={styles.name}>{author?.nome} {author?.cognome}</Text>
                    <Text style={styles.username}>@{author?.username}</Text>

                    <Text style={styles.bio}>
                        {author?.bio}
                    </Text>

                </View>
                {isLoading && (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginVertical: 20, paddingVertical: 100 }}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
                {post && (
                    <View style={{ marginHorizontal: 25 }}>
                        <Text variant="labelLarge" style={{ textAlign: 'center', marginVertical: 10 }}>{promptTitle}</Text>
                        <FeedPost post={post} currentPrompt={prompt} />
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

export default ProfileUserNotMe;

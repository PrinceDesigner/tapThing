import FeedStackScreensNavigation from '@/navigation/FeedStackScreens/FeedStackScreens';
import React from 'react';
import { StyleSheet } from 'react-native';
import { InsertPhotoScreen } from '../InsertPhotoScreen/InsertPhotoScreen';

const LoadFeedOrInsertScreen: React.FC = () => {
    const prompt = false

    return prompt ? <FeedStackScreensNavigation /> : <InsertPhotoScreen />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default LoadFeedOrInsertScreen;
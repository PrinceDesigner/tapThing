import FeedStackScreensNavigation from '@/navigation/FeedStackScreens/FeedStackScreens';
import React from 'react';
import { StyleSheet } from 'react-native';
import { InsertPhotoScreen } from '../InsertPhotoScreen/InsertPhotoScreen';
import PromptLandingStackNavigation from '@/navigation/PromptLandingStackNavigation/PromptLandingStackNavigation';

const LoadFeedOrInsertScreen: React.FC = () => {
    const prompt = false

    return !prompt ? <FeedStackScreensNavigation /> : <PromptLandingStackNavigation />;
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
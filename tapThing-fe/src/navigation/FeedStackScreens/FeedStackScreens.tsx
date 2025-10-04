import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TapThingLandingScreen from '@/screens/AuthStackScreen/LandingScreen';
import { useTranslation } from 'react-i18next';
import FeedScreen from '@/screens/FeedScreen/FeedScreen';
import { DailyPromptStaticScreen } from '@/screens/PromptLandingScreen/PromptLandingScree';

// Importa qui le tue pagine

export type FeedAuthParamList = {
    FeedScreen: undefined;
    DailyPromptStaticScreen: undefined;

};

const Stack = createNativeStackNavigator<FeedAuthParamList>();

const FeedStackScreensNavigation: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator initialRouteName="DailyPromptStaticScreen" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="FeedScreen"
                component={FeedScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default FeedStackScreensNavigation;
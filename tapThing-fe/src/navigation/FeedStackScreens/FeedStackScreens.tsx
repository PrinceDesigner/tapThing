import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TapThingLandingScreen from '@/screens/AuthStackScreen/LandingScreen';
import { useTranslation } from 'react-i18next';
import FeedScreen from '@/screens/FeedScreen/FeedScreen';
import { DailyPromptStaticScreen } from '@/screens/PromptLandingScreen/PromptLandingScree';
import ProfileUserNotMe from '@/screens/ProfileUserNotMe/ProfileUserNotMe';

// Importa qui le tue pagine

export type FeedAuthParamList = {
    FeedScreen: undefined;
    ProfileUserNotMe: undefined
};

const Stack = createNativeStackNavigator<FeedAuthParamList>();

const FeedStackScreensNavigation: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator initialRouteName="FeedScreen" screenOptions={{ headerShown: true }}>
                <Stack.Screen name="FeedScreen"
                    component={FeedScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="ProfileUserNotMe"
                    component={ProfileUserNotMe}
                    options={{ headerShown: true,headerTitle: '', headerBackTitle: t('back') || 'Back' }}
                />
        </Stack.Navigator>
    );
};

export default FeedStackScreensNavigation;
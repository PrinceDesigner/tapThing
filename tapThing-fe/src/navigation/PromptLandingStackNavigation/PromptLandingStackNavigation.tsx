import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { DailyPromptStaticScreen } from '@/screens/PromptLandingScreen/PromptLandingScree';
import { InsertPhotoScreen } from '@/screens/InsertPhotoScreen/InsertPhotoScreen';


// Importa qui le tue pagine

export type PromptLandingParamList = {
    InsertPhotoScreen: undefined;
    DailyPromptStaticScreen: undefined;

};

const Stack = createNativeStackNavigator<PromptLandingParamList>();

const PromptLandingStackNavigation: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator initialRouteName="DailyPromptStaticScreen" screenOptions={{ headerShown: true }}>
            <Stack.Screen
            name="DailyPromptStaticScreen"
            component={DailyPromptStaticScreen}
            options={{ headerShown: false }}
            />
            <Stack.Screen
            name="InsertPhotoScreen"
            component={InsertPhotoScreen}
            options={{
                title: t('insert_photo'),
                headerBackTitle: t('back'), // Cambia il titolo del pulsante indietro
            }}
            />
        </Stack.Navigator>
    );
};

export default PromptLandingStackNavigation;
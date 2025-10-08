import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import ProfiloScreen from '@/screens/ProfiloStackScreen/ProfiloScreen';
import ProfiloUpdateScreen from '@/screens/ProfiloStackScreen/ProfiloUpdateScreen';

// Importa qui le tue pagine

export type ProfiloStackParamList = {
    ProfiloScreen: { fromFeed?: boolean } | undefined;
    ProfiloUpdateScreen: undefined;
};

const Stack = createNativeStackNavigator<ProfiloStackParamList>();

const ProfiloStackScreensNavigation: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator initialRouteName="ProfiloScreen" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="ProfiloScreen"
                component={ProfiloScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="ProfiloUpdateScreen"
                component={ProfiloUpdateScreen}
                options={{ headerShown: true, headerTitle: '', headerBackTitle: t('back') || 'Back' }}
            />
        </Stack.Navigator>
    );
};

export default ProfiloStackScreensNavigation;
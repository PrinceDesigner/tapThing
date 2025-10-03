import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TapThingLandingScreen from '@/screens/AuthStackScreen/LandingScreen';
import { Text } from 'react-native';
import PhoneAuthScreen from '@/screens/AuthStackScreen/InsertPhoneNumber';
import { useTranslation } from 'react-i18next';

// Importa qui le tue pagine

export type AuthStackParamList = {
    OnLanding: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigation: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator initialRouteName="OnLanding" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="OnLanding"
                component={TapThingLandingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={PhoneAuthScreen} options={{ title: t('register') }} />
        </Stack.Navigator>
    );
};

    export default AuthStackNavigation;
import React, { use } from 'react';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StatusBar, Switch, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import { useThemeContext } from '@/context/themeContext';
import { useTranslation } from 'react-i18next';
import { useLoadingStore } from '@/store/loaderStore/loaderGlobalStore';
import { useSnackbarStore } from '@/store/snackbar/snackbar.store';
import { logout } from '@/api/supabase/supabase.api';
import LoadFeedOrInsertScreen from '@/screens/LoadFeedOrInsert/LoadFeedOrInsertScreen';

const Drawer = createDrawerNavigator();

const PlaceholderScreen = ({ title }: { title: string }) => (

  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{title} Placeholder</Text>
  </View>
);

const CustomHeader: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const theme = useTheme();
  const isDark = theme.dark;
  const { t } = useTranslation();

  return (
    <SafeAreaView

      edges={['top']}
      style={{ backgroundColor: theme.colors.surface }}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background as string}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outline,
        backgroundColor: theme.colors.surface
      }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>TapThing</Text>
          <Text variant='labelSmall'>{t('unlock_world')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" color={theme.colors.onBackground} size={28} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  );
};


function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const { toggleTheme } = useThemeContext();
  const { t } = useTranslation();
  const { setLoading } = useLoadingStore();
  const { show } = useSnackbarStore();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      show(t('logout_error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.surface }}
      edges={['top', 'bottom']}
    >
      {/* Lista voci del drawer */}
      <View style={{ flex: 1, paddingTop: 25, paddingHorizontal: 10 }}>
        <DrawerItemList {...props} />
      </View>

      {/* Footer con toggle fisso e logout */}
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outline,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text variant="bodyMedium">{!isDark ? t('dark_theme') : t('light_theme')}</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: theme.colors.error,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.onError, fontWeight: 'bold' }}>
            {t('logout') || 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const DrawerStackNavigation = () => (
  // <NavigationContainer>
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      header: () => <CustomHeader />
    }}
  >
    <Drawer.Screen
      name="Home"
      options={{ title: 'Home' }}
      children={() => <LoadFeedOrInsertScreen  />}
    />
    <Drawer.Screen
      name="Profile"
      options={{ title: 'Profile' }}
      children={() => <PlaceholderScreen title="Profile" />}
    />
    <Drawer.Screen
      name="Settings"
      options={{ title: 'Settings' }}
      children={() => <PlaceholderScreen title="Settings" />}
    />
  </Drawer.Navigator>
  // </NavigationContainer>
);

export default DrawerStackNavigation;
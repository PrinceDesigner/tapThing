// screens/LoadAppReady/LoadAppReady.tsx
import { AuthListenerCliente } from "@/hook/supabase/AuthListnerSupabase";
import AuthStackNavigation from "@/navigation/AuthStackNavigation/AuthStackNavigation";
import DrawerStackNavigation from "@/navigation/DrawerStackNavigation/DrawerStackNavigation";
import { useUserStore } from "@/store/user/user.store";
import { useBootstrapUser } from "@/hook/user/BootstrapUser";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, useTheme, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

export function LoadAppReady() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { isAuthenticated, loading: authLoading } = AuthListenerCliente();
    const isProfileReady = useUserStore((s) => s.isProfileReady);
    const error = useUserStore((s) => s.error);

    useBootstrapUser();

    // todo mettere traduzioni
    if (error) {
        return (
            <View style={[styles.overlay, { backgroundColor: "#fff" }]}>
                <View style={{ alignItems: "center" }}>
                    <View style={{ paddingHorizontal: 24 }}>
                        <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.error, textAlign: "center" }}>
                            {t("errore")}
                        </Text>
                        <View style={{ height: 16 }} />
                        <Text style={{ fontSize: 18, color: "#333", textAlign: "center" }}>
                            {t("error_fetch_app")}
                        </Text>
                        <View style={{ height: 8 }} />
                    </View>
                </View>
            </View>
        );
    }


    // Autenticato: bootstrap profilo
    // Auth in corso
    if (authLoading) {
        // alert("Loading...");
        return (
            <View style={[styles.overlay]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // Non autenticato
    if (!isAuthenticated) return <AuthStackNavigation />;


    // Profilo non ancora pronto -> splash/loader
    if (!isProfileReady) {
        return (
            <View style={[styles.overlay]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    // Tutto pronto
    return <DrawerStackNavigation />;
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
});

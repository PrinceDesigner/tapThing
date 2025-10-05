// screens/LoadAppReady/LoadAppReady.tsx
import { AuthListenerCliente } from "@/hook/supabase/AuthListnerSupabase";
import AuthStackNavigation from "@/navigation/AuthStackNavigation/AuthStackNavigation";
import DrawerStackNavigation from "@/navigation/DrawerStackNavigation/DrawerStackNavigation";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { useUserStore } from "@/store/user/user.store";
import { useBootstrapUser } from "@/hook/user/BootstrapUser";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, useTheme, Text } from "react-native-paper";

export function LoadAppReady() {
    const { colors } = useTheme();
    const { isAuthenticated, loading: authLoading } = AuthListenerCliente();
    const isProfileReady = useUserStore((s) => s.isProfileReady);
    const error = useUserStore((s) => s.error);

    useBootstrapUser();

    if (error) {
        return (
            <View style={[styles.overlay, { backgroundColor: "#fff" }]}>
                <View style={{ alignItems: "center" }}>
                    <ActivityIndicator size="large" color={colors.error} />
                    <View style={{ height: 32 }} />
                    <View style={{ paddingHorizontal: 24 }}>
                        <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.error, textAlign: "center" }}>
                            Errore
                        </Text>
                        <View style={{ height: 16 }} />
                        <Text style={{ fontSize: 18, color: "#333", textAlign: "center" }}>
                            Si è verificato un errore durante il caricamento dell'applicazione.
                        </Text>
                        <View style={{ height: 8 }} />
                        <Text style={{ fontSize: 14, color: "#888", textAlign: "center" }}>
                            Errore sconosciuto
                        </Text>
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

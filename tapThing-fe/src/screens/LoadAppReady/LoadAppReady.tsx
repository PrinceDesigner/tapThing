import { AuthListenerCliente } from "@/hook/supabase/AuthListnerSupabase";
import AuthStackNavigation from "@/navigation/AuthStackNavigation/AuthStackNavigation";
import DrawerStackNavigation from "@/navigation/DrawerStackNavigation/DrawerStackNavigation";
export function LoadAppReady() {
    const { isAuthenticated, loading } = AuthListenerCliente();
    
    if (loading) return null;

    return isAuthenticated ? <DrawerStackNavigation /> : <AuthStackNavigation />;
}
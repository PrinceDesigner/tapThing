import AuthStackNavigation from "@/navigation/AuthStackNavigation/AuthStackNavigation";
import DrawerStackNavigation from "@/navigation/DrawerStackNavigation/DrawerStackNavigation";
export function LoadAppReady() {
    // return <AuthStackNavigation />;
    return <DrawerStackNavigation />;
}
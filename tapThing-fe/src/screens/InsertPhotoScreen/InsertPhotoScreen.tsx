import { apiClient } from "@/api/apiClient";
import { setAppLanguage } from "@/i18n";
import { useLoadingStore } from "@/store/loaderStore/loaderGlobalStore";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export const InsertPhotoScreen = () => {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ marginTop: 20, padding: 10, backgroundColor: '#007bff', color: '#fff', borderRadius: 5 }}>Check API Health</Text>
        </View>
    )
};

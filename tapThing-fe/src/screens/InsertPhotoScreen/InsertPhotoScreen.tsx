import { apiClient } from "@/api/apiClient";
import { setAppLanguage } from "@/i18n";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export const InsertPhotoScreen = () => {

    const healthCheck = async () => {
        // chiamata API di esempio
        try {
            await apiClient.get('/health');
        } catch (error) {
            console.error('Health check failed:', error);
        }


    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={healthCheck} style={{ marginTop: 20, padding: 10, backgroundColor: '#007bff', color: '#fff', borderRadius: 5 }}>Check API Health</Text>
            <Button
                compact
                mode="text"
                onPress={() => setAppLanguage('en')}
            >
                English
            </Button>
            <Button
                compact
                mode="text"
                onPress={() => setAppLanguage('it')}
            >
                Italiano
            </Button>
        </View>
    )
};

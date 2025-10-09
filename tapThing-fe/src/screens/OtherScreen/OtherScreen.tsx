import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";

export function OtherScreen() {
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const { t } = useTranslation();
    const theme = useTheme();

    const containerStyle = { backgroundColor: theme.colors.surface, padding: 20, marginHorizontal: 20, borderRadius: 12 };

    return (
        <View style={{ flex: 1, marginTop: 20, paddingHorizontal: 16 }}>
            <Button

                mode="outlined"
                onPress={showModal}
                buttonColor="red"
            >
                {t("Delete_user")}
            </Button>


            <Portal>
                <Modal visible={visible}

                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}>
                    <Text>{t("Are_you_sure_delete_post")}</Text>

                    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20 }}>
                        <Button onPress={hideModal}
                            mode="outlined"
                        style={{ marginRight: 10 }}>
                            {t("not_delete")}
                        </Button>
                        <Button mode="outlined" buttonColor="red" onPress={() => {
                            // Handle delete action
                            hideModal();
                        }}>
                            {t("Delete_user")}
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}
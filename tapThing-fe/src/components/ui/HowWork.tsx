import React from "react";
import { View } from "react-native";
import { Text, List, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

const HowWork: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <View style={{ marginHorizontal: 16, marginTop: 18 }}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: "700" }}>
                {t("how_it_works")}
            </Text>
            <List.Section>
                <List.Item
                    title={t("one_prompt_per_day")}
                    description={t("daily_prompt_description")}
                    left={(p) => <List.Icon {...p} icon="calendar-today" />}
                />
                <List.Item
                    title={t("post_to_unlock_feed")}
                    description={t("post_to_unlock_feed_description")}
                    left={(p) => <List.Icon {...p} icon="lock-open-variant" />}
                />
                <List.Item
                    title={t("no_filters_more_authenticity")}
                    description={t("no_filters_more_authenticity_description")}
                    left={(p) => <List.Icon {...p} icon="image-outline" />}
                />
            </List.Section>
        </View>
    );
};

export default HowWork;
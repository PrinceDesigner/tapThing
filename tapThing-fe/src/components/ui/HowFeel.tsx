import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text, List, useTheme, Banner } from "react-native-paper";

const HowItFeels: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      {/* Regola chiave in evidenza */}
      <Banner
        visible
        icon="lock-open-variant"
        style={{
          marginTop: 10,
          borderRadius: 12,
          backgroundColor: theme.colors.surfaceVariant,
        }}
      >
        <Text style={{ color: theme.colors.onSurface }}>
          <Text style={{ fontWeight: "800" }}>{t("banner_title")}</Text>{" "}
          {t("banner_text")}
        </Text>
      </Banner>

      {/* Intro breve e intensa */}
      <Text
        style={{
          marginTop: 10,
          color: theme.colors.onSurfaceVariant,
          fontStyle: "italic",
          lineHeight: 20,
        }}
      >
        {t("intro")}
      </Text>

      <List.Section>
        <List.Item
          title={t("eyes_meet_title")}
          description={t("eyes_meet_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="eye-outline" />}
        />

        <List.Item
          title={t("not_a_task_title")}
          description={t("not_a_task_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="lightbulb-on-outline" />}
        />

        <List.Item
          title={t("present_title")}
          description={t("present_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="clock-time-three-outline" />}
        />

        <List.Item
          title={t("authenticity_title")}
          description={t("authenticity_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="camera-outline" />}
        />

        <List.Item
          title={t("freedom_title")}
          description={t("freedom_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="hand-peace" />}
        />

        <List.Item
          title={t("clarity_title")}
          description={t("clarity_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="diamond-stone" />}
        />

        <List.Item
          title={t("live_title")}
          description={t("live_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="camera-burst" />}
        />

        <List.Item
          title={t("free_title")}
          description={t("free_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="lightbulb-on-outline" />}
        />

        <List.Item
          title={t("feel_title")}
          description={t("feel_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="camera-outline" />}
        />

        <List.Item
          title={t("no_obligation_title")}
          description={t("no_obligation_desc")}
          descriptionNumberOfLines={5}
          left={(p) => <List.Icon {...p} icon="hand-peace" />}
        />
      </List.Section>
    </View>
  );
};

export default HowItFeels;

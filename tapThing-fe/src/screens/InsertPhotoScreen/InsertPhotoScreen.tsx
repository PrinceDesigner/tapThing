import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ScrollView, Pressable, TouchableOpacity } from "react-native";
import {
    Text,
    useTheme,
    Button,
    IconButton,
    Banner,
    Card,
    List,
} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "react-native"
import HowWork from "@/components/ui/HowWork";
import { uploadImageAndGetUrl } from "@/api/supabase/uploadphoto";
import { useAuthClienteStore } from "@/store/auth/AuthClienteStore";
import { useLoadingStore } from "@/store/loaderStore/loaderGlobalStore";
import { insertPost } from "@/api/posts/post.service";
import { useSnackbarStore } from "@/store/snackbar/snackbar.store";
import { useActivePrompt, useUpdatePromptCache } from "@/hook/prompt/useHookPrompts";
import { useCurrentLocation } from "@/hook/location/useCurrentLocation";
import { PromptCountdown } from "@/components/promptCountDown/PromptCountDown";


/**
 * InsertPhotoScreen (Prompt-first)
 *
 * Obiettivo del refactor
 * - Mettere in evidenza lo "Stimolo di oggi" (il core dell'app).
 * - Spiegare chiaramente che il feed è sbloccato solo dopo aver pubblicato.
 * - Offrire CTA primarie chiare (scatta / seleziona) e una call-to-action finale coerente.
 * - Struttura componibile con proprietà per integrarsi facilmente nel flusso reale.
 */
export const InsertPhotoScreen: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [asset, setAsset] = useState<null | { uri: string; width?: number; height?: number }>(null);

    const { prompt } = useActivePrompt();
    const { setHasPostedOnPrompt, setPostedAtOnPrompt, setPostedIdOnPrompt } =
        useUpdatePromptCache();

    const { show } = useSnackbarStore();

    const userId = useAuthClienteStore((s) => s.userId); // { id: string } 
    const setLoading = useLoadingStore((s) => s.setLoading);

    const { coords, address, loading, error } = useCurrentLocation();

    const requestPermissions = async () => {
        // Galleria
        const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // Fotocamera
        const cam = await ImagePicker.requestCameraPermissionsAsync();
        return lib.status === "granted" && cam.status === "granted";
    };


    const onTakePhoto = async () => {
        const ok = await requestPermissions();
        if (!ok) return;

        const res = await ImagePicker.launchCameraAsync({
            allowsMultipleSelection: false,
            quality: 0.9,
            aspect: [4, 5],
            mediaTypes: ['images']
        });

        if (!res.canceled) {
            const img = res.assets[0];
            setAsset({ uri: img.uri, width: img.width, height: img.height });
        }
    };


    const onPublish = async () => {
        if (!asset?.uri) return;
        if (!userId) {
            // mostra errore UI se serve
            return;
        }
        setLoading(true);
        try {
            // cartella logica: userId/promptId (così è facile trovare i file)
            const folder = `${userId}/${prompt?.prompt_id ?? "no-prompt"}`;

            // scegli se vuoi public o signed URL
            const { url, path } = await uploadImageAndGetUrl(asset.uri, {
                bucket: "images",
                folder,
                makePublic: false,         // true se il bucket è pubblico e vuoi URL permanente
            });

            const post = await insertPost(url, prompt?.prompt_id ?? "",
                coords?.latitude ?? null,
                coords?.longitude ?? null,
                address?.country ?? null,
                address?.city ?? null);

            const postId = post.id;
            const postCreatedAt = post.created_at;

            // Aggiornamenti optimistici della cache del prompt attivo
            setHasPostedOnPrompt(true);
            setPostedIdOnPrompt(postId);
            setPostedAtOnPrompt(postCreatedAt);

        } catch (e: any) {
            // todo traduzioni
            show((t(e.code) || t('UNKNOWN_ERROR')), 'error');
            // show(e.message || t("error_generic"), type: "error" });
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header: Stimolo di oggi + countdown */}
            <View
                style={{
                    backgroundColor: theme.colors.primary,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.outline,
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 14,
                }}
            >
                {/* Riga informativa: Stimolo di oggi + countdown (solo UI) */}
                <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Titolo + sottotitolo (core message del social) */}
                    <View style={{ alignItems: "center" }}>
                        <Text
                            variant='titleMedium'
                            style={{ color: theme.colors.onPrimary, fontWeight: "900", letterSpacing: 0.2, textAlign: "center" }}
                            numberOfLines={5}
                        >
                            {prompt?.title || ''}
                        </Text>
                        <PromptCountdown
                            endsAt={prompt?.ends_at || new Date().toISOString()}
                            totalMs={23 * 60 * 60 * 1000}
                            expiredText={t('EXPIRED_AT')}
                            labelPrefix={t('EXPIRES_IN')}
                            variant='labelSmall'
                        />
                    </View>

                </View>

            </View>


            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                {/* Banner: regola del feed bloccato/sbloccato */}
                <Banner
                    icon={"lock"}
                    visible
                    style={{
                        marginHorizontal: 16,
                        marginTop: 12,
                        borderRadius: 14,
                        backgroundColor: theme.colors.surfaceVariant,
                    }}
                >

                    <Text style={{ color: theme.colors.onSurfaceVariant }}>
                        {t("feed_lock")}
                    </Text>

                </Banner>

                {/* Drop / Tap area */}
                <Card
                    style={{
                        marginHorizontal: 16,
                        marginTop: 16,
                        borderRadius: 16,
                        // overflow: "hidden",
                        backgroundColor: theme.colors.background,
                    }}
                    mode="outlined"
                >


                    {asset ? (
                        <Image
                            source={{ uri: asset.uri }}
                            style={{ width: '100%', aspectRatio: asset.width && asset.height ? asset.width / asset.height : 4 / 5, backgroundColor: theme.colors.onSurfaceVariant }}
                            resizeMode="contain"
                        />
                    ) : (
                        // ...il tuo box “dashed” con l’icona Plus

                        <TouchableOpacity onPress={onTakePhoto} accessibilityRole="button" accessibilityLabel="Carica o fai foto">
                            <View
                                style={{
                                    borderWidth: 2,
                                    borderStyle: "dashed",
                                    borderColor: theme.colors.outline,
                                    borderRadius: 16,
                                    height: 240,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <View style={{ alignItems: "center" }}>
                                    <IconButton icon="plus" size={40} />
                                    <Text style={{ fontWeight: "bold", fontSize: 18, color: theme.colors.onSurface }}>{t("upload_or_take_photo")}</Text>
                                    <Text style={{ marginTop: 6, color: theme.colors.onSurfaceVariant }}>Mostra un pezzetto vero della tua giornata</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    )}
                    {/* CTA primarie */}
                    <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
                        <Button mode="contained" onPress={onTakePhoto} icon="camera" style={{ flex: 1 }}>
                            {t("take_photo")}
                        </Button>
                    </View>
                </Card>

                {/* Azione finale (sempre visiva) */}
                <View style={{ marginHorizontal: 16, marginTop: 8 }}>
                    <Button mode="contained-tonal" onPress={onPublish} icon={"send"}>
                        {t("publish_now")}
                    </Button>
                </View>

                {/* Spiegazione breve del concept */}
                <HowWork />

            </ScrollView>
        </View>
    );
};

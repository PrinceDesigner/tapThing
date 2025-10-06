// services/uploadToSupabase.ts
import * as Crypto from "expo-crypto";
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from "@/libs/supabase/supabase.client";

type UploadOpts = {
  bucket?: string;
  folder?: string;
  makePublic?: boolean;
  signedSeconds?: number;
};

/**
 * Carica un'immagine su Supabase Storage usando Expo SDK 54+
 * @param localUri - URI locale dell'immagine (es. da ImagePicker)
 * @param options - Opzioni di upload
 * @returns Promise con path e url dell'immagine caricata
 */
export async function uploadImageAndGetUrl(
  localUri: string,
  {
    bucket = "images",
    folder = "",
    makePublic = false,
    signedSeconds = 60 * 60 * 24 * 7,
  }: UploadOpts = {}
): Promise<{ path: string; url: string }> {
  try {
    // 1) Verifica che il file esista
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
      throw new Error("File non trovato");
    }

    // 2) Leggi il file come base64
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: "base64",
    });

    // 3) Converti base64 in Uint8Array per Supabase
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 4) Determina il content-type dall'estensione
    const ext = localUri.split(".").pop()?.toLowerCase() || "jpg";
    const contentType = getContentType(ext);

    // 5) Genera path univoco
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");
    const random = Crypto.randomUUID();
    const base = folder ? `${folder}/` : "";
    const filename = `${yyyy}_${mm}_${dd}/${random}.${ext}`;
    const path = `${base}${filename}`;

    // 6) Upload usando Uint8Array
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, byteArray, {
        contentType,
        upsert: false,
      });

    if (upErr) throw upErr;

    // 7) Ottieni URL (pubblico o firmato)
    if (makePublic) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      if (!data?.publicUrl) throw new Error("Public URL non ottenuto");
      return { path, url: data.publicUrl };
    } else {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, signedSeconds);
      if (error || !data?.signedUrl) {
        throw error ?? new Error("Signed URL non ottenuto");
      }
      return { path, url: data.signedUrl };
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Mappa estensioni file a content-type
 */
function getContentType(ext: string): string {
  const types: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
  };
  return types[ext] || "image/jpeg";
}
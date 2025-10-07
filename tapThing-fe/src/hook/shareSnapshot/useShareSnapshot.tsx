import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, ViewStyle, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

type Options = {
  format?: "png" | "jpg";
  quality?: number;
  width?: number;
  height?: number;
  dialogTitle?: string;
  style?: ViewStyle;
  onBeforeShare?: () => Promise<void> | void; // attiva overlay, ecc.
  onAfterShare?: () => void;                  // ripristina stato
};

type UseShareSnapshotReturn = {
  SnapTarget: React.FC<React.PropsWithChildren<{ style?: ViewStyle }>>;
  capture: () => Promise<string>;
  share: () => Promise<void>;
  busy: boolean;
};

const awaitFrame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => r()));

export function useShareSnapshot(opts: Options = {}): UseShareSnapshotReturn {
  const {
    format = "png",
    quality = 1,
    width,
    height,
    dialogTitle = "Condividi",
    style,
    onBeforeShare,
    onAfterShare,
  } = opts;

  const targetRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);

  const capture = useCallback(async () => {
    if (!targetRef.current) throw new Error("SnapTarget non montato.");
    setBusy(true);
    try {
      const uri = await captureRef(targetRef, {
        format,
        quality,
        result: "tmpfile",
        width,
        height,
      });
      if (!uri) throw new Error("Cattura fallita.");
      return uri;
    } finally {
      setBusy(false);
    }
  }, [format, quality, width, height]);

  const share = useCallback(async () => {
    try {
      setBusy(true);
      if (onBeforeShare) await onBeforeShare();
      await awaitFrame(); // assicura layout aggiornato
    
      if (onBeforeShare) await onBeforeShare();

      const uri = await capture();

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) throw new Error("La condivisione non è disponibile su questo dispositivo.");

      await Sharing.shareAsync(uri, {
        dialogTitle,
        mimeType: Platform.OS === "android" ? "image/*" : undefined,
        UTI: Platform.OS === "ios" ? "public.jpeg" : undefined,
      });
    } finally {
      onAfterShare?.();
      setBusy(false);
    }
  }, [capture, dialogTitle, onBeforeShare, onAfterShare]);

  const SnapTarget = useMemo(() => {
    const C: UseShareSnapshotReturn["SnapTarget"] = ({ children, style: s }) => (
      <View ref={targetRef} collapsable={false} style={[{ alignSelf: "stretch" }, style, s]}>
        {children}
      </View>
    );
    return C;
  }, [style]);

  return { SnapTarget, capture, share, busy };
}

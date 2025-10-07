import { Gesture } from "react-native-gesture-handler";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export function usePinchPan() {
    // --- Shared values ---
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // Pinch: consenti solo >= 1, e al rilascio resetta tutto
    const pinchGesture = Gesture.Pinch()              // ⬅️ importante
        .onBegin(() => {
            // fotografa lo stato corrente di scala per il pinch corrente
            savedScale.value = scale.value;
        })
        .onUpdate((e) => {
            // blocca lo zoom minimo a 1
            const next = Math.max(1, savedScale.value * e.scale);
            scale.value = next;
        })
        .onFinalize(() => {
            // appena "lascio lo zoom": torna tutto iniziale
            scale.value = withTiming(1, { duration: 180 });
            savedScale.value = 1;

            translateX.value = withTiming(0, { duration: 180 });
            translateY.value = withTiming(0, { duration: 180 });
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
        });

    // Pan: attivo solo quando zoom > 1; si muove finché il pinch è attivo
    const panGesture = Gesture.Pan()
        .onBegin(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        })
        .minPointers(2)
        .onUpdate((e) => {
            if (scale.value > 1) {
                translateX.value = savedTranslateX.value + e.translationX;
                translateY.value = savedTranslateY.value + e.translationY;
            }
        });

    const composed = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],

    }));


    return { composed, animatedStyle };
}
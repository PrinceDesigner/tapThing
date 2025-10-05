import React from 'react';
import { Image } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const ZoomableInlineImage = ({ uri }: { uri: string }) => {
  const scale = useSharedValue(1);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={pinch}>
      <Animated.View>
        <Image
          source={{ uri }}
          style={{ width: '100%', aspectRatio: 1.2, borderRadius: 12 }}
          resizeMode="cover"
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default ZoomableInlineImage;

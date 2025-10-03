import { TextBold, TextRegular } from "@/components/ui/customText";
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Sostituisci con il tuo asset locale
// import heroImage from "@/assets/hero-dark.jpg";
const heroImage = { uri: "https://picsum.photos/1200/2000" }; // segnaposto

const TapThingLandingScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>


        <View style={styles.contentWrapper}>
          <TextBold style={styles.title}>tapThing</TextBold>
          <TextRegular style={[styles.subtitle, {margin: 0}]}>Post to unlock the world.</TextRegular>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default TapThingLandingScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000", // fallback sotto l’immagine
  },
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)", // simile a opacity-30 del web
  },
  contentWrapper: {
    flex: 1,
    maxWidth: 720,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 48, // ~ text-6xl
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.5,
    // marginBottom: 12,
  },
  subtitle: {
    fontSize: 20, // ~ text-xl
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  description: {
    fontSize: 16, // ~ text-base
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 28,
  },
});

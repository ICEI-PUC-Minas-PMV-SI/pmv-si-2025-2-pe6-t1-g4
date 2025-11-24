import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen({ onPressRegister, onPressLogin }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/Home.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <StatusBar style="light" />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/LogoTrainer.png")}
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonLight]}
              onPress={onPressLogin}
            >
              <Text style={[styles.buttonText, styles.buttonTextDark]}>
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonDark]}
              onPress={onPressRegister}
            >
              <Text style={[styles.buttonText, styles.buttonTextLight]}>
                Registrar
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const BUTTON_HEIGHT = 40;
const BUTTON_RADIUS = 6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    width: 380,
    height: 380,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  button: {
    flex: 1,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLight: {
    backgroundColor: "#FFFFFF",
  },
  buttonDark: {
    backgroundColor: "#000000",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  buttonTextDark: {
    color: "#000000",
  },
  buttonTextLight: {
    color: "#FFFFFF",
  },
});

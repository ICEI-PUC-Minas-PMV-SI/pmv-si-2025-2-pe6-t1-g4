import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
    const router = useRouter();
    const backgroundImage = require("../assets/images/welcome-bg.jpg");


    return (
        <ImageBackground source={backgroundImage} style={styles.background}>

            {/* Logo + nome do app */}
            <View style={styles.centerContent}>
                <View style={styles.logoContainer}>
                    <Ionicons name="barbell" color="white" size={60} />
                </View>
                <Text style={styles.title}>TRAINERHUB</Text>
            </View>

            {/* Botões */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => router.push("/(auth)/login")}
                    style={[styles.button, styles.loginButton]}
                >
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/(auth)/register")}
                    style={[styles.button, styles.registerButton]}
                >
                    <Text style={styles.registerText}>REGISTRAR</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "space-between",
    },


    statusIcons: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconGap: {
        marginLeft: 10,
    },

    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: height * 0.05,
    },

    logoContainer: {
        marginBottom: 15,
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 18,
        borderRadius: 18,
    },

    title: {
        color: "white",
        fontSize: 45,
        fontWeight: "900",
        letterSpacing: 1.5,
        textShadowColor: "rgba(0,0,0,0.6)",
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 6,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 25,
        paddingBottom: 50,
    },

    button: {
        width: "48%",
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: "center",
    },

    loginButton: {
        backgroundColor: "white",
    },

    registerButton: {
        backgroundColor: "black",
        opacity: 0.85,
    },

    loginText: {
        color: "black",
        fontWeight: "800",
        fontSize: 16,
    },

    registerText: {
        color: "white",
        fontWeight: "800",
        fontSize: 16,
    },
});

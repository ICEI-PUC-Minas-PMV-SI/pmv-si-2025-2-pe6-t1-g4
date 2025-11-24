
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";

export default function LoginScreen({ onSubmit, onBack }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    onSubmit && onSubmit({ email, senha });
  }

  return (
    <ImageBackground
      source={require("../assets/Home.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Log in</Text>

          <View style={styles.form}>
            {/* Inputs em glass (como já está) */}
            <View style={styles.glassInput}>
              <TextInput
                style={styles.input}
                placeholder="jane@example.com"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.glassInput}>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            {/* BOTÃO GLASS */}
           <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>LOG IN</Text>
           </TouchableOpacity>
           {onBack && (
  <TouchableOpacity
    style={styles.backButton}
    onPress={onBack}
  >
    <Text style={styles.backText}>Voltar</Text>
  </TouchableOpacity>

            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 24,
    color: "#FFFFFF",
  },
  form: {
    gap: 16,
  },

  /* Inputs glass */
  glassInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    height: 48,
    fontSize: 16,
    color: "#FFFFFF",
  },

  /* BOTÃO GLASS*/
button: {
  marginTop: 32,
  height: 54,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 14,
  borderWidth: 2,
  borderColor: "rgba(255,255,255,0.8)", // borda branca brilhante
  backgroundColor: "rgba(0,0,0,0.35)", // leve transparência — premium
  shadowColor: "#FFFFFF",
  shadowOpacity: 0.25,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 4,
},
buttonText: {
  color: "#FFFFFF",
  fontWeight: "700",
  fontSize: 18,
  letterSpacing: 1.2,
},

backButton: {
  marginTop: 16,
  alignItems: "center",
},

backText: {
  color: "rgba(255,255,255,0.8)",
  fontSize: 14,
  fontWeight: "500",
},


});

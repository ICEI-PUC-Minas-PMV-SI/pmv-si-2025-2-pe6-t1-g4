// src/RegisterStep2.js
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

// ==== FUNÇÕES DE MÁSCARA ====
function maskCpf(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function maskData(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

export default function RegisterStep2({ onNext, onBack }) {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  function handleNext() {
    if (!nomeCompleto || !cpf || !dataNascimento) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    onNext &&
      onNext({
        nomeCompleto,
        cpf,
        dataNascimento,
      });
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
          <Text style={styles.title}>Registrar</Text>

          <View style={styles.form}>
            {/* NOME COMPLETO */}
            <View style={styles.glassInput}>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
              />
            </View>

            {/* CPF */}
            <View style={styles.glassInput}>
              <TextInput
                style={styles.input}
                placeholder="CPF"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={cpf}
                onChangeText={(text) => setCpf(maskCpf(text))}
                keyboardType="numeric"
              />
            </View>

            {/* DATA DE NASCIMENTO */}
            <View style={styles.glassInput}>
              <TextInput
                style={styles.input}
                placeholder="Data de nascimento"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={dataNascimento}
                onChangeText={(text) => setDataNascimento(maskData(text))}
                keyboardType="numeric"
              />
            </View>

            {/* BOTÃO NEXT */}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>NEXT</Text>
            </TouchableOpacity>

            {/* VOLTAR */}
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
  button: {
    marginTop: 32,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(0,0,0,0.35)",
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

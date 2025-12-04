// Trainerhubmobile1/src/RegisterStep3.js
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
function maskTelefone(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

function maskAltura(value) {
  let v = value.replace(/\D/g, "").slice(0, 3); // até 3 dígitos
  if (v.length <= 1) return v;
  return v.replace(/(\d)(\d{1,2})/, "$1,$2"); // 175 -> 1,75
}

function maskPeso(value) {
  let v = value.replace(/\D/g, "").slice(0, 5); // até 5 dígitos
  if (v.length <= 2) return v;
  return v.replace(/(\d+)(\d{2})$/, "$1,$2"); // 7500 -> 75,00
}

/**
 * props:
 * - onFinish(dadosStep3)  => chamado quando o usuário termina
 * - onBack()              => voltar para a etapa anterior
 */
export default function RegisterStep3({ onFinish, onBack }) {
  const [genero, setGenero] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [telefone, setTelefone] = useState("");

  function handleFinish() {
    if (!genero || !altura || !peso || !telefone) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    // devolve os dados para o componente pai
    onFinish &&
      onFinish({
        genero,
        altura,
        peso,
        telefone,
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
            {/* GÊNERO */}
            <View style={styles.glassInput}>
              <TextInput
                style={styles.input}
                placeholder="Gênero"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={genero}
                onChangeText={setGenero}
              />
            </View>

            {/* ALTURA */}
            <View style={styles.glassInput}>
              <TextInput
                style={styles.input}
                placeholder="Altura (m)"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={altura}
                onChangeText={(text) => setAltura(maskAltura(text))}
                keyboardType="numeric"
              />
            </View>

            {/* PESO */}
            <View style={styles.glassInput}>
              <TextInput
                style={styles.input}
                placeholder="Peso (kg)"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={peso}
                onChangeText={(text) => setPeso(maskPeso(text))}
                keyboardType="numeric"
              />
            </View>

            {/* TELEFONE */}
            <View style={styles.glassInput}>
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={telefone}
                onChangeText={(text) => setTelefone(maskTelefone(text))}
                keyboardType="phone-pad"
              />
            </View>

            {/* BOTÃO FINALIZAR */}
            <TouchableOpacity style={styles.button} onPress={handleFinish}>
              <Text style={styles.buttonText}>FINALIZAR</Text>
            </TouchableOpacity>

            {/* VOLTAR */}
            {onBack && (
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
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

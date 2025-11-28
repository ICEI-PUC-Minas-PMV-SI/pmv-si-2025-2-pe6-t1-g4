import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";

export default function RescheduleScreen({ onBack, classData }) {
  const [date, setDate] = useState(classData.date); // ex: "12/12"
  const [hour, setHour] = useState(classData.hour); // ex: "08:00"

  return (
    <ImageBackground
      source={require("../assets/Home.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        
        {/* TÍTULO */}
        <Text style={styles.title}>Aulas</Text>
        <Text style={styles.subtitle}>Remarcar aula de {classData.type}</Text>

        {/* CAIXA DE DATA E HORA */}
        <View style={styles.calendarBox}>
          
          {/* DATA */}
          <View style={styles.selector}>
            <Text style={styles.selectorLabel}>Data</Text>

            <TextInput
              style={styles.selectorValue}
              value={date}
              onChangeText={setDate}
              placeholder="DD/MM"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          {/* HORA */}
          <View style={[styles.selector, { marginTop: 16 }]}>
            <Text style={styles.selectorLabel}>Horário</Text>

            <TextInput
              style={styles.selectorValue}
              value={hour}
              onChangeText={setHour}
              placeholder="HH:MM"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

        </View>

        {/* BOTÕES */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={onBack}>
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnConfirm}
            onPress={() => {
              console.log("Novo horário:", date, hour);
              onBack();
            }}
          >
            <Text style={styles.btnConfirmText}>Confirmar</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 36,
    color: "#FFF",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 20,
    color: "#FF5A7A",
    marginBottom: 20,
    marginTop: 4,
  },

  calendarBox: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    padding: 16,
  },

  selector: {
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 14,
    borderRadius: 12,
  },

  selectorLabel: {
    color: "#FFF",
    opacity: 0.7,
    marginBottom: 4,
  },

  selectorValue: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  btnCancel: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  btnCancelText: {
    color: "#FF5A7A",
    fontSize: 16,
    fontWeight: "700",
  },

  btnConfirm: {
    width: "48%",
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  btnConfirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

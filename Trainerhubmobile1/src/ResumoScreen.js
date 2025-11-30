import React, { useEffect, useState } from "react";
import BottomTab from "./BottomTab";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_URL } from "./config/api";

const ALUNO_ID = "2f492373-50f4-48a8-930a-e12f30197a25";

export default function ResumoScreen({
  onPressProfile,
  onChangeTab,
  activeTab = "resumo",
  nextClassTitle = "Próxima\nAula:",
  nextClassDate = "12/12",
}) {
  // estado do perfil vindo da API
  const [aluno, setAluno] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  const agora = new Date();
  const dia = agora.getDate().toString().padStart(2, "0");
  const mes = agora.toLocaleString("pt-BR", { month: "short" });
  const ano = agora.getFullYear();
  const horas = agora.getHours().toString().padStart(2, "0");
  const minutos = agora.getMinutes().toString().padStart(2, "0");

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setLoadingPerfil(true);
        const resp = await fetch(`${API_URL}/api/profiles/${ALUNO_ID}`);

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }

        const json = await resp.json();
        setAluno(json);
      } catch (e) {
        console.log("Erro ao carregar perfil:", e);
        Alert.alert(
          "Erro",
          "Não foi possível carregar os dados do aluno. Verifique a API."
        );
      } finally {
        setLoadingPerfil(false);
      }
    }

    carregarPerfil();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/Home.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Resumo</Text>
            {loadingPerfil ? (
              <Text style={styles.subtitle}>Carregando aluno...</Text>
            ) : aluno ? (
              <Text style={styles.subtitle}>{aluno.full_name}</Text>
            ) : (
              <Text style={styles.subtitle}>Aluno</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={onPressProfile}
            activeOpacity={0.8}
          >
            <Image
              source={require("../assets/profile.png")}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* LINHA COM DOIS CARDS MENORES */}
          <View style={styles.row}>
            {/* NÍVEL */}
            <View style={[styles.card, styles.cardSmall]}>
              <Text style={styles.cardSmallTitle}>Nível</Text>
              <Text style={styles.cardLevelValue}>1</Text>
              <Text style={styles.cardSmallSubtitle}>
                {aluno
                  ? `${aluno.peso_kg ?? "--"} kg • ${
                      aluno.altura_cm
                        ? (aluno.altura_cm / 100).toFixed(2)
                        : "--"
                    } m`
                  : loadingPerfil
                  ? "Carregando..."
                  : "--"}
              </Text>
            </View>

            {/* PRÓXIMA AULA */}
            <View style={[styles.card, styles.cardSmall]}>
              <Text style={styles.cardNextTitle}>{nextClassTitle}</Text>
              <Text style={styles.cardNextDate}>{nextClassDate}</Text>
            </View>
          </View>

          {/* CARD BATIMENTOS */}
          <View style={[styles.card, styles.cardLarge]}>
            <View style={styles.heartRow}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={60}
                color="#FF4B4B"
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.heartBpmValue}>130</Text>
                <Text style={styles.heartBpmLabel}>BPM</Text>
              </View>
            </View>
            <View style={styles.heartInfo}>
              <Text style={styles.heartDate}>{`${dia} ${mes} ${ano}`}</Text>
              <Text style={styles.heartDate}>{`${horas}:${minutos}`}</Text>
            </View>
          </View>

          {/* CARD ACADEMIA */}
          <View style={[styles.card, styles.cardLarge]}>
            <View style={styles.gymRow}>
              <View style={styles.gymIconWrapper}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={20}
                  color="#000"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.gymName}>FitClub Anchieta</Text>
                <Text style={styles.gymAddress}>
                  Rua Esplendor, 767{"\n"}(31) 3044-0090
                </Text>
              </View>

              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>MAPA</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* TAB BAR INFERIOR */}
        <BottomTab activeTab={activeTab} onChangeTab={onChangeTab} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  avatarWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  cardSmall: {
    width: "48%",
    minHeight: 140,
    justifyContent: "center",
  },
  cardLarge: {
    width: "100%",
    minHeight: 140,
    marginBottom: 16,
  },

  cardSmallTitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  cardSmallSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  cardLevelValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#6366F1", // indigo
  },

  cardNextTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(255,90,122,0.95)",
    lineHeight: 22,
  },
  cardNextDate: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "800",
    color: "rgba(255,255,255,0.95)",
  },

  heartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  heartBpmValue: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heartBpmLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  heartInfo: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  heartDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },

  gymRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  gymIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  gymName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  gymAddress: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  mapPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  mapText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
});

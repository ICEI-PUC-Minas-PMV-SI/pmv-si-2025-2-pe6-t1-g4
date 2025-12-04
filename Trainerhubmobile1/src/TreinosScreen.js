// Trainerhubmobile1/src/TreinosScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // ⬅️ IMPORTANTE
import BottomTab from "./BottomTab";
import { API_URL, getAlunoId, getLoggedUser } from "./config/api";

export default function TreinosScreen({
  onPressProfile,
  onChangeTab,
  activeTab = "treinos",
}) {
  const [treinos, setTreinos] = useState([]);
  const [loadingTreinos, setLoadingTreinos] = useState(true);
  const [selectedTreinoId, setSelectedTreinoId] = useState(null);
  const [detalhe, setDetalhe] = useState(null); // { treino, exercicios }
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);

  // --------- INFO DO USUÁRIO (avatar) ----------
  const loggedUser = getLoggedUser();
  const avatarUrl = loggedUser?.avatar_url || null;
  const avatarLetter =
    (loggedUser?.full_name &&
      loggedUser.full_name.trim().charAt(0).toUpperCase()) ||
    (loggedUser?.email && loggedUser.email.trim().charAt(0).toUpperCase()) ||
    "A";

  // ---------------- GRADIENTE PREMIUM POR NOME DO TREINO ----------------
  // ---------------- GRADIENTE PREMIUM + GLASS POR NOME DO TREINO ----------------
  function getMuscleGradientFromName(name) {
    // fallback bem discreto
    if (!name) {
      return ["rgba(15,23,42,0.65)", "rgba(15,23,42,0.25)"];
    }

    const n = name.toLowerCase();

    // Peito / tríceps -> indigo roxo com transparência
    if (n.includes("peito")) {
      return ["rgba(79,70,229,0.85)", "rgba(129,140,248,0.25)"];
    }

    // Pernas -> vinho / laranja queimado transparente
    if (n.includes("perna")) {
      return ["rgba(127,29,29,0.85)", "rgba(248,113,113,0.25)"];
    }

    // Ombros -> verde petróleo / verde lima transparente
    if (n.includes("ombro")) {
      return ["rgba(6,95,70,0.85)", "rgba(45,212,191,0.25)"];
    }

    // Full body -> roxo / magenta transparente
    if (n.includes("full")) {
      return ["rgba(76,29,149,0.85)", "rgba(236,72,153,0.25)"];
    }

    // Resistência -> cinza aço
    if (n.includes("resistência") || n.includes("resistencia")) {
      return ["rgba(31,41,55,0.9)", "rgba(148,163,184,0.25)"];
    }

    // default escuro translúcido
    return ["rgba(15,23,42,0.7)", "rgba(15,23,42,0.25)"];
  }

  // continua pra fundo dos cards de exercício
  function getMuscleColor(muscleGroup) {
    if (!muscleGroup) return "rgba(15,23,42,0.95)";
    const mg = muscleGroup.toLowerCase();

    if (mg.includes("peito")) return "rgba(79,70,229,0.95)";
    if (mg.includes("ombro")) return "rgba(34,197,94,0.95)";
    if (mg.includes("perna")) return "rgba(239,68,68,0.95)";
    return "rgba(15,23,42,0.95)";
  }

  // ---------------- CARREGAR LISTA DE TREINOS ----------------
  useEffect(() => {
    async function carregarTreinos() {
      try {
        const alunoId = getAlunoId();
        if (!alunoId) {
          console.log("Nenhum aluno logado em getAlunoId()");
          setLoadingTreinos(false);
          return;
        }

        setLoadingTreinos(true);
        console.log("Buscando treinos de:", alunoId);

        const user = getLoggedUser();
        const token = user?.token;

        const resp = await fetch(`${API_URL}/api/alunos/${alunoId}/treinos`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        console.log("Status HTTP /treinos:", resp.status);

        if (!resp.ok) {
          const txt = await resp.text();
          console.log("Erro ao buscar treinos:", txt);
          throw new Error(`HTTP ${resp.status}`);
        }

        const data = await resp.json();
        console.log("Treinos recebidos:", data);
        setTreinos(data);
      } catch (err) {
        console.log("Erro carregar treinos:", err);
        Alert.alert(
          "Erro",
          "Não foi possível carregar seus treinos. Verifique a API."
        );
      } finally {
        setLoadingTreinos(false);
      }
    }

    carregarTreinos();
  }, []);

  // ---------------- CARREGAR DETALHE DE UM TREINO ----------------
  async function handleOpenTreino(treinoId) {
    try {
      if (selectedTreinoId === treinoId && detalhe) {
        setSelectedTreinoId(null);
        setDetalhe(null);
        return;
      }

      setSelectedTreinoId(treinoId);
      setLoadingDetalhe(true);
      setDetalhe(null);

      const user = getLoggedUser();
      const token = user?.token;

      const resp = await fetch(`${API_URL}/api/treinos/${treinoId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      console.log("Status HTTP /treinos/{id}:", resp.status);

      if (!resp.ok) {
        const txt = await resp.text();
        console.log("Erro ao buscar detalhe do treino:", txt);
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      console.log("Detalhe treino:", data);
      setDetalhe(data);
    } catch (err) {
      console.log("Erro detalhe treino:", err);
      Alert.alert("Erro", "Não foi possível carregar o detalhe do treino.");
    } finally {
      setLoadingDetalhe(false);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/Home.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* CONTEÚDO PRINCIPAL */}
        <View style={styles.content}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Treinos</Text>

            <TouchableOpacity
              style={styles.headerAvatarWrapper}
              onPress={onPressProfile}
              activeOpacity={0.8}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.headerAvatar}
                />
              ) : (
                <View style={styles.headerAvatarCircle}>
                  <Text style={styles.headerAvatarLetter}>{avatarLetter}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* LISTA DE TREINOS */}
          {loadingTreinos ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Carregando treinos...</Text>
            </View>
          ) : treinos.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.emptyText}>
                Você ainda não possui treinos cadastrados.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              {treinos.map((t) => {
                const isOpen = selectedTreinoId === t.id;
                const gradientColors = getMuscleGradientFromName(
                  t.workout_name
                );

                return (
                  <View key={t.id} style={styles.treinoWrapper}>
                    {/* CARD PRINCIPAL COM GRADIENTE */}
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleOpenTreino(t.id)}
                    >
                      <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                      >
                        <View style={styles.cardRow}>
                          <View style={styles.imageBox}>
                            {t.workout_cover_url ? (
                              <Image
                                source={{ uri: t.workout_cover_url }}
                                style={styles.imageBoxImage}
                                resizeMode="cover"
                              />
                            ) : null}
                          </View>

                          <View style={styles.cardTextBox}>
                            <Text style={styles.cardTitle}>
                              {t.workout_name || "Treino"}
                            </Text>

                            <Text
                              style={styles.cardDescription}
                              numberOfLines={3}
                              ellipsizeMode="tail"
                            >
                              {t.workout_description ||
                                "Toque para ver os exercícios desse treino."}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* DETALHE (lista de exercícios) */}
                    {isOpen && (
                      <View style={styles.detailBox}>
                        {loadingDetalhe && (
                          <View style={styles.centerBox}>
                            <ActivityIndicator size="small" color="#FFFFFF" />
                            <Text style={styles.loadingText}>
                              Carregando exercícios...
                            </Text>
                          </View>
                        )}

                        {!loadingDetalhe && detalhe && detalhe.exercicios && (
                          <>
                            {detalhe.exercicios.map((ex) => (
                              <View
                                key={ex.id}
                                style={[
                                  styles.exerciseCard,
                                  {
                                    backgroundColor: getMuscleColor(
                                      ex.exercise_muscle_group
                                    ),
                                  },
                                ]}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 8,
                                  }}
                                >
                                  {ex.image_url ? (
                                    <Image
                                      source={{ uri: ex.image_url }}
                                      style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 12,
                                        marginRight: 10,
                                      }}
                                    />
                                  ) : (
                                    <MaterialCommunityIcons
                                      name="arm-flex"
                                      size={32}
                                      color="#fff"
                                      style={{ marginRight: 10 }}
                                    />
                                  )}

                                  <View style={{ flex: 1 }}>
                                    <Text style={styles.exerciseName}>
                                      {ex.exercise_name}
                                    </Text>
                                    {ex.exercise_description && (
                                      <Text
                                        style={styles.exerciseDesc}
                                        numberOfLines={3}
                                        ellipsizeMode="tail"
                                      >
                                        {ex.exercise_description}
                                      </Text>
                                    )}
                                  </View>
                                </View>

                                <Text style={styles.exerciseInfo}>
                                  Séries:{" "}
                                  <Text style={styles.bold}>
                                    {ex.series ?? "—"}
                                  </Text>{" "}
                                  • Reps:{" "}
                                  <Text style={styles.bold}>
                                    {ex.repeticoes ?? "—"}
                                  </Text>
                                </Text>

                                <Text style={styles.exerciseInfo}>
                                  Carga:{" "}
                                  <Text style={styles.bold}>
                                    {ex.carga != null ? `${ex.carga} kg` : "—"}
                                  </Text>{" "}
                                  • Descanso:{" "}
                                  <Text style={styles.bold}>
                                    {ex.descanso_segundos != null
                                      ? `${ex.descanso_segundos}s`
                                      : "—"}
                                  </Text>
                                </Text>
                              </View>
                            ))}
                          </>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* TAB BAR FIXA NO RODAPÉ */}
        <View style={styles.tabWrapper}>
          <BottomTab activeTab={activeTab} onChangeTab={onChangeTab} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerAvatarWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 27,
  },
  headerAvatarCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarLetter: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  treinoWrapper: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 28,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 6,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.9)",
    marginRight: 16,
  },
  cardTextBox: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.95)",
  },

  detailBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  exerciseCard: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  exerciseInfo: {
    fontSize: 13,
    color: "#FFFFFF",
  },
  exerciseDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  bold: { fontWeight: "700" },

  centerBox: {
    marginTop: 32,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 14,
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },

  tabWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)", // leve glass se não tiver imagem
    marginRight: 16,
    overflow: "hidden",
  },

  imageBoxImage: {
    width: "100%",
    height: "100%",
  },
});

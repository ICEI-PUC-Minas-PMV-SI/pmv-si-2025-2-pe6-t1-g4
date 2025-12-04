// Trainerhubmobile1/src/ResumoScreen.js
import React, { useEffect, useState } from "react";
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
import MapView, { Marker } from "react-native-maps";

import BottomTab from "./BottomTab";
import { API_URL, getAlunoId, getLoggedUser } from "./config/api";

// formata "2025-12-05 16:40:00+00" -> { diaMes: "05/12", hora: "16:40" }
function formatarDataProximaAula(timestamp) {
  if (!timestamp || typeof timestamp !== "string") {
    return { diaMes: "--/--", hora: "--:--" };
  }

  const [dataParte, horaParte] = timestamp.split(" ");
  if (!dataParte || !horaParte) {
    return { diaMes: "--/--", hora: "--:--" };
  }

  const [ano, mes, dia] = dataParte.split("-");
  const [hora, minuto] = horaParte.split(":");

  if (!ano || !mes || !dia || !hora || !minuto) {
    return { diaMes: "--/--", hora: "--:--" };
  }

  return {
    diaMes: `${dia}/${mes}`,
    hora: `${hora}:${minuto}`,
  };
}

export default function ResumoScreen({
  onPressProfile,
  onChangeTab,
  activeTab = "resumo",
}) {
  const [aluno, setAluno] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  // estado da próxima aula
  const [nextLesson, setNextLesson] = useState(null);
  const [loadingNextLesson, setLoadingNextLesson] = useState(true);

  // usuário logado (do login / perfil)
  const loggedUser = getLoggedUser();
  const fullNameFromUser = loggedUser?.full_name || null;
  const avatarUrlFromUser = loggedUser?.avatar_url || null;

  // data/hora atual (para o card de batimentos)
  const agora = new Date();
  const dia = agora.getDate().toString().padStart(2, "0");
  const mes = agora.toLocaleString("pt-BR", { month: "short" });
  const ano = agora.getFullYear();
  const horas = agora.getHours().toString().padStart(2, "0");
  const minutos = agora.getMinutes().toString().padStart(2, "0");

  // -------- PERFIL --------
  useEffect(() => {
    async function carregarPerfil() {
      try {
        setLoadingPerfil(true);

        const alunoId = getAlunoId();
        console.log("ResumoScreen -> alunoId:", alunoId);

        if (!alunoId) {
          console.log("Nenhum alunoId retornado por getAlunoId()");
          setLoadingPerfil(false);
          return;
        }

        const resp = await fetch(`${API_URL}/api/profiles/${alunoId}`);
        console.log("Status HTTP perfil (Resumo):", resp.status);

        if (!resp.ok) {
          const txt = await resp.text();
          console.log("Erro ao carregar perfil (Resumo):", txt);
          throw new Error(`HTTP ${resp.status}`);
        }

        const json = await resp.json();
        console.log("Perfil recebido (Resumo):", json);
        setAluno(json);
      } catch (e) {
        console.log("Erro ao carregar perfil (Resumo):", e);
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

  // -------- PRÓXIMA AULA --------
  useEffect(() => {
    async function carregarProximaAula() {
      try {
        setLoadingNextLesson(true);

        const alunoId = getAlunoId();
        if (!alunoId) {
          console.log("ResumoScreen -> sem alunoId para próxima aula");
          setLoadingNextLesson(false);
          return;
        }

        const user = getLoggedUser();
        const token = user?.token;

        const resp = await fetch(`${API_URL}/api/alunos/${alunoId}/aulas`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        console.log("Status HTTP aulas (Resumo):", resp.status);

        if (!resp.ok) {
          const txt = await resp.text();
          console.log("Erro ao carregar aulas (Resumo):", txt);
          throw new Error(`HTTP ${resp.status}`);
        }

        const data = await resp.json();
        console.log("Aulas recebidas (Resumo):", data);

        if (!Array.isArray(data) || data.length === 0) {
          setNextLesson(null);
          return;
        }

        // A API já devolve order by c.inicio asc,
        // então a primeira posição é a "próxima aula".
        setNextLesson(data[0]);
      } catch (e) {
        console.log("Erro ao carregar próxima aula (Resumo):", e);
        setNextLesson(null);
      } finally {
        setLoadingNextLesson(false);
      }
    }

    if (activeTab === "resumo") {
      carregarProximaAula();
    }
  }, [activeTab]);

  // Nome exibido em destaque (prioriza o que vem da API de perfil)
  const displayName = aluno?.full_name || fullNameFromUser || "Aluno";

  // Avatar: prioriza o que está em loggedUser, depois o que vier do profile
  const avatarUrl = avatarUrlFromUser || aluno?.avatar_url || null;

  // texto do card de próxima aula
  let proxDataTexto = "--/--";
  let proxNomeAula = "";

  if (loadingNextLesson) {
    proxDataTexto = "...";
  } else if (nextLesson && nextLesson.inicio) {
    const { diaMes, hora } = formatarDataProximaAula(nextLesson.inicio);
    proxDataTexto = `${diaMes} · ${hora}`;
    proxNomeAula = nextLesson.titulo || "";
  } else {
    proxDataTexto = "Sem aula";
  }

  return (
    <ImageBackground
      source={require("../assets/Home.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* CONTEÚDO PRINCIPAL (deixa espaço pra TAB fixa) */}
        <View style={styles.content}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Resumo</Text>

              {loadingPerfil ? (
                <Text style={styles.subtitle}>Carregando aluno...</Text>
              ) : (
                <Text style={styles.nameHighlight}>{displayName}</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={onPressProfile}
              style={styles.avatarWrapper}
              activeOpacity={0.8}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarLetter}>
                    {displayName?.[0]?.toUpperCase() || "A"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* CONTEÚDO SCROLLÁVEL */}
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

              {/* PRÓXIMA AULA (REAL) */}
              <View style={[styles.card, styles.cardSmall]}>
                <Text style={styles.cardNextTitle}>Próxima Aula</Text>
                <Text style={styles.cardNextDate}>{proxDataTexto}</Text>
                {proxNomeAula ? (
                  <Text style={styles.cardNextSubtitle}>{proxNomeAula}</Text>
                ) : null}
              </View>
            </View>

            {/* CARD BATIMENTOS (mock) */}
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

            {/* CARD ACADEMIA COM MAPA REAL */}
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
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: -19.9585,
                      longitude: -43.9222,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: -19.9585,
                        longitude: -43.9222,
                      }}
                      title="FitClub Anchieta"
                      description="Rua Esplendor, 767"
                    />
                  </MapView>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* TAB BAR INFERIOR PADRONIZADA */}
        <View style={styles.tabWrapper}>
          <BottomTab activeTab={activeTab} onChangeTab={onChangeTab} />
        </View>
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

  content: {
    flex: 1,
    paddingBottom: 80, // espaço pra tab fixa
  },

  // HEADER
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
  nameHighlight: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    color: "#FF383C",
  },

  // AVATAR HEADER
  avatarWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  // CARDS
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
    color: "#6366F1",
  },

  cardNextTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(255,90,122,0.95)",
    lineHeight: 22,
  },
  cardNextDate: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "800",
    color: "rgba(255,255,255,0.95)",
  },
  cardNextSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,90,122,0.95)",
  },

  // CARD BATIMENTOS
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

  // CARD ACADEMIA
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
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  map: {
    width: "100%",
    height: "100%",
  },

  // TAB FIXA
  tabWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },
});


import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
import BottomTab from "./BottomTab";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEMS_PER_PAGE = 3;

// MOCK DE EXERCÍCIOS – depois você troca pelo resultado da API
const TREINOS = [
  {
    id: "1",
    title: "Supino Reto",
    group: "Peito",
    description: "Barra no peitoral, controle na descida.",
    image: require("../assets/supino_reto_peito.png"),
  },
  {
    id: "2",
    title: "Desenvolvimento com Halteres",
    group: "Ombros",
    description: "Empurre acima da cabeça.",
    image: require("../assets/alteres_ombros.png"),
  },
  {
    id: "3",
    title: "Agachamento Livre",
    group: "Pernas",
    description: "Mantenha a coluna neutra e desça até 90º.",
    image: require("../assets/agachamento_livre_pernas.png"),
  },
  {
    id: "4",
    title: "Supino Inclinado",
    group: "Peito",
    description: "Banco inclinado a 45º, controle na descida.",
    image: require("../assets/icon.png"),
  },
];

// cor do card de acordo com o grupo
function getGroupColor(group) {
  switch (group) {
    case "Peito":
      // Indigo #6366F1 com 30% opacidade
      return "rgba(99, 102, 241, 0.3)";
    case "Ombros":
      // Verde #22C55E com 30% opacidade
      return "rgba(34, 197, 94, 0.3)";
    case "Pernas":
      // #FF2D55 com 30% opacidade
      return "rgba(255, 45, 85, 0.3)";
    default:
      // fallback: cinza glass
      return "rgba(110, 107, 107, 0.5)";
  }
}

export default function TreinosScreen({
  onPressProfile,
  onChangeTab,
  activeTab = "treinos",
}) {
  const flatListRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);

  // agrupa exercícios em páginas com até 3 por página
  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < TREINOS.length; i += ITEMS_PER_PAGE) {
      chunks.push(TREINOS.slice(i, i + ITEMS_PER_PAGE));
    }
    return chunks;
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
          <Text style={styles.title}>Treinos</Text>

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

        {/* CARROSSEL DE PÁGINAS (CADA UMA COM ATÉ 3 CARDS) */}
        <FlatList
          ref={flatListRef}
          data={pages}
          keyExtractor={(_, index) => `page-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const pos = Math.round(
              e.nativeEvent.contentOffset.x / SCREEN_WIDTH
            );
            setPageIndex(pos);
          }}
          renderItem={({ item: pageExercises }) => (
            <View style={styles.pageContainer}>
              {pageExercises.map((exercise) => (
                <View key={exercise.id} style={styles.cardContainer}>
                  <View
                    style={[
                      styles.card,
                      { backgroundColor: getGroupColor(exercise.group) },
                    ]}
                  >
                    <View style={styles.cardRow}>
                      <View style={styles.cardInfo}>
                        <Text style={styles.exerciseTitle}>
                          {exercise.title}
                        </Text>
                        <Text style={styles.exerciseGroup}>
                          {exercise.group}
                        </Text>
                        <Text style={styles.exerciseDescription}>
                          {exercise.description}
                        </Text>
                      </View>

                      <View style={styles.cardImageWrapper}>
                        <Image
                          source={exercise.image}
                          style={styles.exerciseImage}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        />

        {/* DOTS (carrossel de páginas) */}
        <View style={styles.dotsWrapper}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === pageIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* TAB BAR INFERIOR – componente padronizado */}
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

  // PÁGINAS DO CARROSSEL
  pageContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 4,
  },

  // CARDS DE TREINO
  cardContainer: {
    marginBottom: 12,
    alignItems: "center",
  },
  card: {
    width: "96%",
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    paddingRight: 8,
  },
  cardImageWrapper: {
    width: "40%",
    alignItems: "center",
  },
  exerciseImage: {
    width: "100%",
    height: 110,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  exerciseGroup: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
  },
  exerciseDescription: {
    marginTop: 8,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },

  // DOTS
  dotsWrapper: {
    marginTop: 12,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
});

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ResumoScreen({
  onPressProfile,
  onChangeTab,
  activeTab = "resumo",
  nextClassTitle = "Próxima\nAula:",
  nextClassDate = "12/12",
}) {
  return (
    <ImageBackground
      source={require("../assets/Home.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Resumo</Text>

          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={onPressProfile}
            activeOpacity={0.8}
          >
            {/* Troque essa imagem pelo avatar do aluno depois */}
            <Image
              source={require("../assets/profile.png")}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO SCROLLÁVEL */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* LINHA DOS 2 CARDS MENORES */}
          <View style={styles.row}>
            {/* CARD NÍVEL (ESTÁTICO) */}
            <View style={[styles.card, styles.cardSmall]}>
              <Text style={styles.cardSmallTitle}>Nível</Text>
              <Text style={styles.cardLevelValue}>1</Text>
            </View>

            {/* CARD PRÓXIMA AULA (DINÂMICO) */}
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
              <Text style={styles.heartDate}>16 Nov 2025</Text>
              <Text style={styles.heartDate}>16:15</Text>
            </View>
          </View>

          {/* CARD ACADEMIA / LOCALIZAÇÃO */}
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

              {/* “MAPA” ESTÁTICO – troque por MapView depois */}
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>MAPA</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* MENU INFERIOR (TABS) */}
        <View style={styles.tabBar}>
          <TabItem
            label="Resumo"
            icon="rhombus"
            isActive={activeTab === "resumo"}
            onPress={() => onChangeTab && onChangeTab("resumo")}
          />
          <TabItem
            label="Aulas"
            icon="calendar"
            isActive={activeTab === "aulas"}
            onPress={() => onChangeTab && onChangeTab("aulas")}
          />
          <TabItem
            label="Treinos"
            icon="dumbbell"
            isActive={activeTab === "treinos"}
            onPress={() => onChangeTab && onChangeTab("treinos")}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function TabItem({ label, icon, isActive, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.tabItem, isActive && styles.tabItemActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons
  name={icon}
  size={22}
  color={isActive ? "#FFFFFF" : "#1E1E1E"} 
/>


      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
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
    borderRadius: 20,              // antes 24
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
    minHeight: 140,                // antes 120
    justifyContent: "center",
  },
  cardLarge: {
    width: "100%",
    minHeight: 140,                // novo: ocupa mais tela
    marginBottom: 16,
  },

  cardSmallTitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  cardLevelValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#6366F1", // indigo
  },

  cardNextTitle: {
  fontSize: 18,
  fontWeight: "700",              // antes 600
  color: "rgba(255,90,122,0.95)", // mais forte
  lineHeight: 22,
},

  cardNextDate: {
  marginTop: 8,
  fontSize: 24,
  fontWeight: "800",     // mais grosso
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

  tabBar: {
  flexDirection: "row",
  backgroundColor: "rgba(255, 255, 255, 0.50)", // Figma: 50%
  borderRadius: 32,
  padding: 8,
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.30)", // suave
  width: "85%",
  alignSelf: "center",
},
tabItem: {
  flex: 1,
  borderRadius: 22,
  paddingVertical: 10,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: 4,
},
tabItemActive: {
  backgroundColor: "#6366F1",               // Indigo principal da sua marca
  shadowColor: "rgba(0,0,0,0.40)",          // Cinza com 40% de opacidade
  shadowOpacity: 0.4,                        // Mantém coerência com o shadowColor
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  elevation: 8,                              // Dá mais profundidade no Android
},


tabLabel: {
  fontSize: 13,
  color: "#1E1E1E", // 40% mais escuro
  fontWeight: "600",
},
tabLabelActive: {
  color: "#FFFFFF",
  fontWeight: "700",
},

});

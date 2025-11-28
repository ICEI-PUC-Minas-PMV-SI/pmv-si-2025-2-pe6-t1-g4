
import React from "react";
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
              <Text style={styles.heartDate}>16 Nov 2025</Text>
              <Text style={styles.heartDate}>16:15</Text>
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

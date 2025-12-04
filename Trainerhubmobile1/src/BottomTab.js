// src/BottomTab.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BottomTab({ activeTab = "resumo", onChangeTab }) {
  return (
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
        icon="triangle"
        isActive={activeTab === "treinos"}
        onPress={() => onChangeTab && onChangeTab("treinos")}
      />
    </View>
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
        color={isActive ? "rgba(29, 25, 43, 1)" : "#1E1E1E"}
      />
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    marginTop: 34,
    marginBottom: 12,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    borderRadius: 32,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.30)",
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
    backgroundColor: "#3434387f",
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 13,
    color: "#1E1E1E",
    fontWeight: "600",
  },
  tabLabelActive: {
    color: "rgba(29, 25, 43, 1)",
    fontWeight: "700",
  },
});

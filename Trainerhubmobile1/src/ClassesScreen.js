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

export default function AulasScreen({ onPressProfile, onChangeTab, onRemarcar }) {
    return (
        <ImageBackground
            source={require("../assets/Home.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                {/* HEADER */}
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Aulas</Text>

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

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* CARD DE AULA */}
                    <View style={styles.classCard}>
                        <View style={styles.classInfoLeft}>
                            <Text style={styles.classDate}>12/12</Text>
                            <Text style={styles.classHour}>08:00</Text>
                            <Text style={styles.classType}>Spinning</Text>
                        </View>

                        <View style={styles.classImageBox}>
                            <Image
                                source={require("../assets/Home.png")}
                                style={styles.exerciseImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* BOTÕES */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.btnRemarcar}
                            onPress={() =>
                                onRemarcar &&
                                onRemarcar({
                                    nome: "Spinning",
                                    date: "12/12",
                                    hour: "08:00",
                                })
                            }
                        >
                            <Text style={styles.btnRemarcarText}>Remarcar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnConfirmar}>
                            <Text style={styles.btnConfirmarText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* MENU INFERIOR */}
                <View style={styles.tabBar}>
                    <TabItem
                        label="Resumo"
                        icon="rhombus"
                        isActive={false}
                        onPress={() => onChangeTab && onChangeTab("resumo")}
                    />
                    <TabItem
                        label="Aulas"
                        icon="calendar"
                        isActive={true}
                        onPress={() => onChangeTab && onChangeTab("aulas")}
                    />
                    <TabItem
                        label="Treinos"
                        icon="dumbbell"
                        isActive={false}
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
    background: { flex: 1 },
    safeArea: { flex: 1, paddingHorizontal: 16, paddingBottom: 16 },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 8,
        marginBottom: 24,
    },
    title: { fontSize: 36, fontWeight: "600", color: "#FFFFFF" },
    avatarWrapper: {
        width: 54,
        height: 54,
        borderRadius: 27,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.8)",
    },
    avatar: { width: "100%", height: "100%" },

    classCard: {
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    classInfoLeft: { flexDirection: "column" },
    classDate: {
        fontSize: 22,
        fontWeight: "900",
        color: "#FF5A7A",
    },
    classHour: {
        fontSize: 18,
        marginTop: 4,
        color: "#FFFFFF",
        fontWeight: "700",
    },
    classType: {
        fontSize: 18,
        marginTop: 6,
        color: "rgba(255,255,255,0.85)",
        fontWeight: "600",
    },

    classImageBox: {
        width: 120,
        height: 120,
        justifyContent: "center",
        alignItems: "center",
    },
    exerciseImage: { width: "100%", height: "100%" },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    btnRemarcar: {
        width: "48%",
        paddingVertical: 14,
        backgroundColor: "rgba(255,255,255,0.25)",
        borderRadius: 16,
        alignItems: "center",
    },
    btnRemarcarText: { color: "#FF5A7A", fontWeight: "700", fontSize: 16 },

    btnConfirmar: {
        width: "48%",
        paddingVertical: 14,
        backgroundColor: "#007BFF",
        borderRadius: 16,
        alignItems: "center",
    },
    btnConfirmarText: { color: "#FFF", fontWeight: "700", fontSize: 16 },

    tabBar: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.50)",
        borderRadius: 32,
        padding: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.30)",
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
        backgroundColor: "#6366F1",
        shadowColor: "rgba(0,0,0,0.40)",
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
        color: "#FFFFFF",
        fontWeight: "700",
    },
});

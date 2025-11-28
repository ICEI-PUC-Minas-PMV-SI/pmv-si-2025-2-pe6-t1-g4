import React, { useRef, useState } from "react";
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
  Dimensions,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AulasScreen({
  onPressProfile,
  onChangeTab,
  activeTab = "aulas",
  lessons = [],
}) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasLessons = lessons && lessons.length > 0;
  const currentLesson = hasLessons ? lessons[currentIndex] : null;

  function handleMomentumEnd(event) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  }

  function handleConfirm() {
    if (!currentLesson) return;
    Alert.alert(
      "Confirmado",
      `Você confirmou a aula de ${currentLesson.title} em ${currentLesson.date} às ${currentLesson.time}.`
    );
  }

  function handleReschedule() {
    if (!currentLesson) return;
    Alert.alert(
      "Remarcar",
      `Aqui você poderia remarcar a aula de ${currentLesson.title}.`
    );
  }

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

        {hasLessons ? (
          <>
            {/* CARROSSEL DE CARDS */}
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleMomentumEnd}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {lessons.map((lesson, index) => (
                <View
                  key={lesson.id ?? index}
                  style={[styles.lessonCardWrapper, { width: SCREEN_WIDTH }]}
                >
                  <View style={styles.lessonCard}>
                    {/* LINHA SUPERIOR: TEXTO À ESQUERDA / IMAGEM À DIREITA */}
                    <View style={styles.lessonTopRow}>
                      <View style={styles.lessonInfoLeft}>
                        <Text style={styles.lessonDate}>{lesson.date}</Text>
                        <Text style={styles.lessonTime}>{lesson.time}</Text>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      </View>

                      <View style={styles.lessonImageWrapper}>
                        <Image
                          source={
                            lesson.image
                              ? lesson.image
                              : require("../assets/icon.png") // placeholder
                          }
                          style={styles.lessonImage}
                          resizeMode="contain"
                        />
                      </View>
                    </View>

                    {/* DESCRIÇÃO EMBAIXO, LARGURA TOTAL */}
                    <View style={styles.lessonDescriptionWrapper}>
                      <Text style={styles.lessonDescription}>
                        {lesson.description}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* BOTÕES REMARCAR / CONFIRMAR – LOGO APÓS O CARD */}
            <View style={styles.actionsWrapper}>
              <View style={styles.actionsBackground}>
                <TouchableOpacity
                  style={styles.remarcarButton}
                  onPress={handleReschedule}
                  activeOpacity={0.85}
                >
                  <Text style={styles.remarcarText}>Remarcar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmarButton}
                  onPress={handleConfirm}
                  activeOpacity={0.9}
                >
                  <Text style={styles.confirmarText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* DOTS DO CARROSSEL – LOGO ABAIXO DOS BOTÕES */}
            <View style={styles.dotsWrapper}>
              {lessons.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.noLessonsWrapper}>
            <Text style={styles.noLessonsText}>
              Você não tem aulas agendadas.
            </Text>
          </View>
        )}

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

  // CARD / CARROSSEL
  lessonCardWrapper: {
    alignItems: "center",
  },
  lessonCard: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    backgroundColor: "rgba(110, 107, 107, 0.81)", // CINZA GLASS
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
    width: SCREEN_WIDTH * 0.9,
  },

  // LINHA SUPERIOR DO CARD
  lessonTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonInfoLeft: {
    width: "42%", // mais espaço para texto à esquerda
  },
  lessonDate: {
    fontSize: 22,
    fontWeight: "800",
    color: "rgba(255,90,122,0.98)",
  },
  lessonTime: {
    fontSize: 22,
    fontWeight: "800",
    color: "rgba(255,90,122,0.98)",
  },
  lessonTitle: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "800",
    color: "rgba(255,90,122,0.98)",
  },

  lessonImageWrapper: {
    width: "58%", // puxa a imagem mais para a direita
    alignItems: "center",
  },
  lessonImage: {
    width: "100%",
    height: 140,
  },

  // DESCRIÇÃO
  lessonDescriptionWrapper: {
    width: "100%",
    marginTop: 16,
  },
  lessonDescription: {
    fontSize: 15,
    color: "#111111",
    fontWeight: "500",
  },

  // SEM AULAS
  noLessonsWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noLessonsText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  // BOTÕES REMARCAR / CONFIRMAR
  actionsWrapper: {
    marginTop: -20,
    alignItems: "center",
  },
  actionsBackground: {
    flexDirection: "row",
    backgroundColor: "rgba(110, 107, 107, 0.81)", // CINZA GLASS
    borderRadius: 32,
    padding: 6,
    width: "80%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)", // CINZA GLASS,
    shadowColor: "rgba(0,0,0,0.25)",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  remarcarButton: {
    flex: 1,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#C62828",
  },
  remarcarText: {
    color: "#ffffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  confirmarButton: {
    flex: 1,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginLeft: 8,
    backgroundColor: "#1D4ED8",
  },
  confirmarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  // DOTS DO CARROSSEL – LOGO ABAIXO DOS BOTÕES
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

// Trainerhubmobile1/src/AulasScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import BottomTab from "./BottomTab";
import { API_URL, getAlunoId, getLoggedUser } from "./config/api";

const SCREEN_WIDTH = Dimensions.get("window").width;

// formata "2025-12-05 16:40:00+00" -> { data: "05/12", hora: "16:40" }
function formatarDataHoraBR(timestamp) {
  if (!timestamp || typeof timestamp !== "string") {
    return { data: "--/--", hora: "--:--" };
  }

  const [dataParte, horaParte] = timestamp.split(" ");
  if (!dataParte || !horaParte) {
    return { data: "--/--", hora: "--:--" };
  }

  const [ano, mes, dia] = dataParte.split("-");
  const [hora, minuto] = horaParte.split(":");

  if (!ano || !mes || !dia || !hora || !minuto) {
    return { data: "--/--", hora: "--:--" };
  }

  return {
    data: `${dia}/${mes}`,
    hora: `${hora}:${minuto}`,
  };
}

// formata "2025-12-20" para "20/12/2025"
function formatarDataSimplesBR(isoDate) {
  if (!isoDate) return "";
  const [ano, mes, dia] = isoDate.split("-");
  if (!ano || !mes || !dia) return isoDate;
  return `${dia}/${mes}/${ano}`;
}

export default function AulasScreen({
  activeTab = "aulas",
  onChangeTab,
  onPressProfile,
}) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  // --------- ESTADO REMARCAÇÃO ----------
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // avatar
  const loggedUser = getLoggedUser();
  const avatarUrl = loggedUser?.avatar_url || null;
  const avatarLetter =
    (loggedUser?.full_name &&
      loggedUser.full_name.trim().charAt(0).toUpperCase()) ||
    (loggedUser?.email && loggedUser.email.trim().charAt(0).toUpperCase()) ||
    "A";

  // --------- CARREGAR AULAS ----------
  useEffect(() => {
    async function carregarAulas() {
      try {
        setLoading(true);

        const alunoId = getAlunoId();
        if (!alunoId) {
          console.log("Nenhum alunoId retornado por getAlunoId()");
          setLoading(false);
          return;
        }

        const user = getLoggedUser();
        const token = user?.token;

        console.log("Carregando aulas do aluno:", alunoId);
        const inicio = Date.now();

        const resp = await fetch(`${API_URL}/api/alunos/${alunoId}/aulas`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const fim = Date.now();
        console.log("Tempo aulas (ms):", fim - inicio);
        console.log("Status HTTP aulas:", resp.status);

        if (!resp.ok) {
          const txt = await resp.text();
          console.log("Resposta de erro do backend (aulas):", txt);
          throw new Error(`HTTP ${resp.status}`);
        }

        const data = await resp.json();
        console.log("Aulas recebidas:", data);

        setLessons(data || []);
        setCurrentIndex(0);
      } catch (err) {
        console.log("Erro ao carregar aulas:", err);
        Alert.alert(
          "Erro",
          "Não foi possível carregar suas aulas. Verifique a API."
        );
      } finally {
        setLoading(false);
      }
    }

    carregarAulas();
  }, []);

  // aula atual do carrossel (usada para remarcar)
  const currentLesson =
    lessons.length > 0
      ? lessons[Math.min(currentIndex, lessons.length - 1)]
      : null;

  // --------- CONFIRMAR AULA ----------
  function handleConfirmLesson(lesson) {
    if (!lesson) return;
    Alert.alert("Aulas", "Aula confirmada com sucesso! ✅");
  }

  // --------- ABRIR MODAL DE REMARCAR ----------
  async function handleOpenReschedule() {
    const lesson = currentLesson;
    if (!lesson) return;

    setSelectedLesson(lesson);
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
    setRescheduleVisible(true);

    try {
      setLoadingSlots(true);

      const user = getLoggedUser();
      const token = user?.token;

      const bookingId = lesson.booking_id;

      const resp = await fetch(`${API_URL}/api/aulas/${bookingId}/slots`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      console.log("Status HTTP /aulas/{bookingId}/slots:", resp.status);

      if (!resp.ok) {
        const txt = await resp.text();
        console.log("Erro ao buscar slots:", txt);
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      console.log("Slots recebidos:", data);
      setAvailableSlots(data.slots || []);
    } catch (err) {
      console.log("Erro slots:", err);
      Alert.alert(
        "Remarcar",
        "Não foi possível carregar as datas disponíveis da aula."
      );
    } finally {
      setLoadingSlots(false);
    }
  }

  // --------- CONFIRMAR REMARCAÇÃO ----------
  async function handleConfirmReschedule() {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Remarcar", "Selecione uma data e horário disponíveis.");
      return;
    }

    if (!selectedLesson) {
      Alert.alert(
        "Remarcar",
        "Nenhuma aula selecionada para remarcar. Tente novamente."
      );
      return;
    }

    const slot = availableSlots.find(
      (s) => s.date === selectedDate && s.time === selectedTime
    );

    if (!slot) {
      Alert.alert(
        "Remarcar",
        "Não foi possível encontrar o horário selecionado. Tente novamente."
      );
      return;
    }

    try {
      const user = getLoggedUser();
      const token = user?.token;
      const bookingId = selectedLesson.booking_id;

      const resp = await fetch(`${API_URL}/api/aulas/${bookingId}/remarcar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          class_id: slot.class_id,
        }),
      });

      console.log("Status HTTP POST /aulas/{bookingId}/remarcar:", resp.status);

      if (!resp.ok) {
        const txt = await resp.text();
        console.log("Erro ao remarcar aula:", txt);
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      console.log("Resposta remarcação:", data);

      // Atualiza lista local
      setLessons((prev) =>
        prev.map((lesson) => {
          if (lesson.booking_id === selectedLesson.booking_id) {
            return {
              ...lesson,
              class_id: slot.class_id,
              inicio: slot.inicio,
              fim: slot.fim,
              cover_url: slot.cover_url || lesson.cover_url,
            };
          }
          return lesson;
        })
      );

      const dataBR = formatarDataSimplesBR(selectedDate);
      Alert.alert(
        "Remarcar",
        `Aula remarcada para ${dataBR} às ${selectedTime}. ✅`
      );

      setRescheduleVisible(false);
    } catch (err) {
      console.log("Erro ao confirmar remarcação:", err);
      Alert.alert(
        "Remarcar",
        "Erro ao remarcar aula. Tente novamente em instantes."
      );
    }
  }

  // datas marcadas no calendário
  const markedDates = availableSlots.reduce((acc, slot) => {
    if (!slot.date) return acc;
    acc[slot.date] = {
      selected: slot.date === selectedDate,
      marked: true,
      selectedColor: "#111827",
      dotColor: "#111827",
    };
    return acc;
  }, {});

  const timesForSelectedDate = selectedDate
    ? availableSlots.filter((s) => s.date === selectedDate)
    : [];

  return (
    <ImageBackground
      source={require("../assets/Home.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Aulas</Text>

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

          {/* CONTEÚDO */}
          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Carregando aulas...</Text>
            </View>
          ) : lessons.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.emptyText}>
                Você ainda não tem aulas agendadas.
              </Text>
            </View>
          ) : (
            <>
              {/* CARROSSEL HORIZONTAL DE AULAS */}
              <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const { contentOffset, layoutMeasurement } =
                    event.nativeEvent;
                  const index = Math.round(
                    contentOffset.x / layoutMeasurement.width
                  );
                  setCurrentIndex(index);
                }}
              >
                {lessons.map((lesson, index) => {
                  const { data, hora } = formatarDataHoraBR(lesson.inicio);

                  return (
                    <View
                      key={lesson.booking_id || lesson.class_id || index}
                      style={styles.page}
                    >
                      <View style={styles.lessonCard}>
                        <View style={styles.lessonTopRow}>
                          {/* Coluna esquerda: data / hora / título */}
                          <View style={styles.lessonLeft}>
                            <Text style={styles.lessonDate}>{data}</Text>
                            <Text style={styles.lessonTime}>{hora}</Text>
                            <Text style={styles.lessonTitle}>
                                   {lesson.titulo || "Aula"} 
                                   </Text>
                          </View>

                          {/* Imagem */}
                          <View style={styles.lessonImageBox}>
                            {lesson.cover_url ? (
                              <Image
                                source={{ uri: lesson.cover_url }}
                                style={styles.lessonImage}
                              />
                            ) : (
                              <View style={styles.lessonImagePlaceholder} />
                            )}
                          </View>
                        </View>

                        {/* Descrição */}
                        {lesson.descricao ? (
                          <Text style={styles.lessonDescription}>
                            {lesson.descricao}
                          </Text>
                        ) : null}
                      </View>

                      {/* BOTÕES + BOLINHAS COLADAS */}
                      <View style={styles.actionsWrapper}>
                        <View style={styles.actionsRow}>
                          <TouchableOpacity
                            style={styles.remarcarButton}
                            onPress={handleOpenReschedule}
                          >
                            <Text style={styles.remarcarText}>Remarcar</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.confirmarButton}
                            onPress={() => handleConfirmLesson(lesson)}
                          >
                            <Text style={styles.confirmarText}>Confirmar</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.dotsRow}>
                          {lessons.map((_, dotIndex) => (
                            <TouchableOpacity
                              key={dotIndex}
                              style={[
                                styles.dot,
                                dotIndex === currentIndex && styles.dotActive,
                              ]}
                              onPress={() => {
                                setCurrentIndex(dotIndex);
                                if (scrollRef.current) {
                                  scrollRef.current.scrollTo({
                                    x: dotIndex * SCREEN_WIDTH,
                                    animated: true,
                                  });
                                }
                              }}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </>
          )}
        </View>

        {/* TAB BAR INFERIOR */}
        <View style={styles.tabWrapper}>
          <BottomTab activeTab={activeTab} onChangeTab={onChangeTab} />
        </View>

        {/* MODAL REMARCAR */}
        <Modal
          visible={rescheduleVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setRescheduleVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Remarcar aula</Text>
              {selectedLesson && (
                <Text style={styles.modalSubtitle}>
                  {selectedLesson.titulo || "Aula"}
                </Text>
              )}

              {loadingSlots ? (
                <View style={styles.centerBox}>
                  <ActivityIndicator size="large" color="#111827" />
                  <Text style={[styles.loadingText, { color: "#111827" }]}>
                    Carregando datas disponíveis...
                  </Text>
                </View>
              ) : (
                <>
                  <Calendar
                    markingType="simple"
                    markedDates={markedDates}
                    onDayPress={(day) => {
                      const dateStr = day.dateString;
                      const temSlot = availableSlots.some(
                        (s) => s.date === dateStr
                      );
                      if (!temSlot) {
                        return;
                      }
                      setSelectedDate(dateStr);
                      setSelectedTime(null);
                    }}
                    style={styles.calendar}
                    theme={{
                      todayTextColor: "#6366F1",
                      arrowColor: "#111827",
                    }}
                  />

                  <View style={styles.timeBox}>
                    {selectedDate ? (
                      timesForSelectedDate.length === 0 ? (
                        <Text style={styles.timeInfo}>
                          Não há horários para esta data.
                        </Text>
                      ) : (
                        timesForSelectedDate.map((slot, index) => (
                          <TouchableOpacity
                            key={`${slot.date}-${slot.time}-${index}`}
                            style={[
                              styles.timeChip,
                              selectedTime === slot.time &&
                                styles.timeChipSelected,
                            ]}
                            onPress={() => setSelectedTime(slot.time)}
                          >
                            <Text
                              style={[
                                styles.timeChipText,
                                selectedTime === slot.time &&
                                  styles.timeChipTextSelected,
                              ]}
                            >
                              {slot.time}
                            </Text>
                          </TouchableOpacity>
                        ))
                      )
                    ) : (
                      <Text style={styles.timeInfo}>
                        Toque em uma data disponível para ver o horário.
                      </Text>
                    )}
                  </View>
                </>
              )}

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setRescheduleVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleConfirmReschedule}
                >
                  <Text style={styles.modalConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingBottom: 80,
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
    color: "#FFFFFF",
    fontFamily: "Comfortaa-Bold",
  },

  headerAvatarWrapper: {
    width: 60,
    height: 60,
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

  // ESTADOS
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

  // PÁGINA DO CARROSSEL
  page: {
    width: SCREEN_WIDTH,
  },

  // CARD AULA
  lessonCard: {
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  lessonTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonLeft: {
    flex: 1,
  },
  lessonDate: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF383C",
  },
  lessonTime: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF383C",
    marginBottom: 18,
  },
  lessonTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
  },
  lessonImageBox: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginLeft: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  lessonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  lessonImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  lessonDescription: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  // BOTÕES + DOTS
  actionsWrapper: {
    marginTop: 18,
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.28)",
    width: "60%",
  },
  remarcarButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  confirmarButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  remarcarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  confirmarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // BOLINHAS DO CARROSSEL
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(156,163,175,0.7)",
    marginHorizontal: 3,
  },
  dotActive: {
    width: 8,
    borderRadius: 8,
    backgroundColor: "#ffffffff",
  },

  // TAB FIXA
  tabWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  // MODAL REMARCAR
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#F9FAFB",
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 8,
  },
  calendar: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 6,
  },
  timeBox: {
    marginTop: 12,
  },
  timeInfo: {
    fontSize: 14,
    color: "#4B5563",
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignSelf: "flex-start",
    marginRight: 8,
  },
  timeChipSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  timeChipText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  timeChipTextSelected: {
    color: "#F9FAFB",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  modalConfirmButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

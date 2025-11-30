// Trainerhubmobile1/src/PerfilScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import BottomTab from "./BottomTab";
import { API_URL, ALUNO_ID } from "./config/api"; // 👈 importante

// Habilita LayoutAnimation no Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PerfilScreen({
  onPressBack,
  onChangeTab,
  activeTab = "resumo",
}) {
  const [activeSection, setActiveSection] = useState("pessoal");
  const [avatarUri, setAvatarUri] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  const [profile, setProfile] = useState({
    nome: "Nome",
    sobrenome: "Sobrenome",
    nascimento: "dd/mm/aaaa",
    altura: "",
    peso: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  // --------- CARREGAR PERFIL DA API ----------
  useEffect(() => {
    async function carregarPerfil() {
      try {
        console.log("Carregando perfil a partir da API...");
        const inicio = Date.now();

        setLoadingPerfil(true);
        const resp = await fetch(`${API_URL}/api/profiles/${ALUNO_ID}`);

        const fim = Date.now();
        console.log("Tempo perfil (ms):", fim - inicio);
        console.log("Status HTTP perfil:", resp.status);

        if (!resp.ok) {
          const txt = await resp.text();
          console.log("Resposta de erro do backend:", txt);
          throw new Error(`HTTP ${resp.status}`);
        }

        const data = await resp.json();
        console.log("Perfil recebido:", data);

        const fullName = data.full_name || "";
        const partes = fullName.trim().split(" ");
        const nome = partes.shift() || "";
        const sobrenome = partes.join(" ");

        let nascimento = "dd/mm/aaaa";
        if (data.data_nascimento) {
          const [ano, mes, dia] = data.data_nascimento.split("-");
          if (dia && mes && ano) {
            nascimento = `${dia}/${mes}/${ano}`;
          }
        }

        const altura = data.altura_cm ? `${data.altura_cm} cm` : "";
        const peso =
          data.peso_kg != null ? `${parseFloat(data.peso_kg)} kg` : "";

        setProfile((prev) => ({
          ...prev,
          nome,
          sobrenome,
          nascimento,
          altura,
          peso,
          email: data.email || "",
          telefone: data.phone || "",
        }));
      } catch (err) {
        console.log("Erro ao carregar perfil:", err);
        Alert.alert(
          "Erro",
          "Não foi possível carregar os dados do perfil. Verifique a API."
        );
      } finally {
        setLoadingPerfil(false);
      }
    }

    carregarPerfil();
  }, []);

  function handleChange(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function handleSwitchSection(section) {
    if (section === activeSection) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(section);
  }

  // --------- PICK DE IMAGEM (TROCAR FOTO) ----------
  async function handlePickAvatar() {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso às suas fotos para trocar o avatar."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  }

  // --------- SALVAR PERFIL NA API ----------
  async function handleSave() {
    try {
      const full_name = `${profile.nome} ${profile.sobrenome}`.trim() || null;

      const alturaNum = profile.altura
        ? parseInt(profile.altura.replace(/\D/g, ""), 10)
        : null;

      const pesoNum = profile.peso
        ? parseFloat(profile.peso.replace(",", ".").replace(/[^\d.]/g, ""))
        : null;

      let dataNascimentoIso = null;
      if (profile.nascimento && profile.nascimento.includes("/")) {
        const [dia, mes, ano] = profile.nascimento.split("/");
        if (dia && mes && ano) {
          dataNascimentoIso = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(
            2,
            "0"
          )}`;
        }
      }

      const payload = {
        full_name,
        phone: profile.telefone || null,
        altura_cm: alturaNum,
        peso_kg: pesoNum,
        data_nascimento: dataNascimentoIso,
      };

      console.log("Enviando payload perfil:", payload);

      const resp = await fetch(`${API_URL}/api/profiles/${ALUNO_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Status HTTP salvar perfil:", resp.status);

      if (!resp.ok) {
        const txt = await resp.text();
        console.log("Erro ao salvar (corpo):", txt);
        throw new Error(`HTTP ${resp.status}`);
      }

      Alert.alert("Perfil", "Dados atualizados com sucesso! ✅");
    } catch (err) {
      console.log("Erro ao salvar perfil:", err);
      Alert.alert("Erro", "Não foi possível salvar os dados do perfil.");
    }
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
          <TouchableOpacity onPress={onPressBack}>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave} disabled={loadingPerfil}>
            <Text style={[styles.saveText, loadingPerfil && { opacity: 0.5 }]}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>

        {/* AVATAR (TOCA PARA TROCAR FOTO) */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8}>
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : require("../assets/profile.png")
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* NOME / SOBRENOME */}
        <View style={styles.nameBox}>
          <TextInput
            style={styles.nameInput}
            value={profile.nome}
            onChangeText={(v) => handleChange("nome", v)}
          />
          <View style={styles.divider} />
          <TextInput
            style={styles.nameInput}
            value={profile.sobrenome}
            onChangeText={(v) => handleChange("sobrenome", v)}
          />
        </View>

        {loadingPerfil && (
          <Text style={{ color: "#fff", textAlign: "center", marginTop: 8 }}>
            Carregando dados do perfil...
          </Text>
        )}

        {/* CONTEÚDO VARIÁVEL (PESSOAL / SEGURANÇA) */}
        {activeSection === "pessoal" ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Nasc</Text>
              <TextInput
                style={styles.valueInput}
                value={profile.nascimento}
                onChangeText={(v) => handleChange("nascimento", v)}
              />
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Altura</Text>
              <TextInput
                style={styles.valueInput}
                value={profile.altura}
                onChangeText={(v) => handleChange("altura", v)}
              />
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Peso</Text>
              <TextInput
                style={styles.valueInput}
                value={profile.peso}
                onChangeText={(v) => handleChange("peso", v)}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.valueInput}
                value={profile.email}
                onChangeText={(v) => handleChange("email", v)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Tel</Text>
              <TextInput
                style={styles.valueInput}
                value={profile.telefone}
                onChangeText={(v) => handleChange("telefone", v)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.passwordBox}>
              <TextInput
                style={styles.passwordInput}
                value={profile.senha}
                placeholder="*******"
                placeholderTextColor="#ccc"
                secureTextEntry
                onChangeText={(v) => handleChange("senha", v)}
              />
              <View style={styles.divider} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirmar senha"
                placeholderTextColor="#ccc"
                secureTextEntry
                value={profile.confirmarSenha}
                onChangeText={(v) => handleChange("confirmarSenha", v)}
              />
            </View>
          </>
        )}

        {/* SUBMENU: PESSOAL / SEGURANÇA */}
        <View style={styles.submenuWrapper}>
          <TouchableOpacity
            style={[
              styles.submenuItem,
              activeSection === "pessoal" && styles.submenuActive,
            ]}
            onPress={() => handleSwitchSection("pessoal")}
          >
            <Text
              style={[
                styles.submenuText,
                activeSection === "pessoal" && styles.submenuTextActive,
              ]}
            >
              Pessoal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submenuItem,
              activeSection === "seguranca" && styles.submenuActive,
            ]}
            onPress={() => handleSwitchSection("seguranca")}
          >
            <Text
              style={[
                styles.submenuText,
                activeSection === "seguranca" && styles.submenuTextActive,
              ]}
            >
              Segurança
            </Text>
          </TouchableOpacity>
        </View>

        <BottomTab activeTab={activeTab} onChangeTab={onChangeTab} />
      </SafeAreaView>
    </ImageBackground>
  );
}

// 🔻 AQUI ESTÃO OS STYLES (o erro era justamente por não ter esse bloco)
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
    justifyContent: "space-between",
    marginTop: 8,
  },
  backText: {
    color: "#4A90E2",
    fontSize: 18,
  },
  saveText: {
    color: "#1D4ED8",
    fontSize: 18,
    fontWeight: "700",
  },

  // AVATAR
  avatarWrapper: {
    marginTop: 16,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  // NOME / SOBRENOME
  nameBox: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 24,
    marginTop: 16,
    padding: 16,
  },
  nameInput: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginVertical: 6,
  },

  // CAMPOS PESSOAIS / SEGURANÇA
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  valueInput: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "right",
    flex: 1,
  },

  passwordBox: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 24,
    padding: 16,
    marginTop: 16,
  },
  passwordInput: {
    color: "#FFF",
    fontSize: 18,
  },

  // SUBMENU
  submenuWrapper: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.35)",
    padding: 6,
    borderRadius: 32,
    marginTop: 20,
    width: "70%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  submenuItem: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 8,
    alignItems: "center",
  },
  submenuActive: {
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  submenuText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "600",
  },
  submenuTextActive: {
    color: "#1D4ED8",
    fontWeight: "700",
  },
});

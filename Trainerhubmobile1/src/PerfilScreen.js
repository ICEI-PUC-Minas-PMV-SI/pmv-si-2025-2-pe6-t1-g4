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
import {
  API_URL,
  getAlunoId,
  getLoggedUser,
  setLoggedUser,
} from "./config/api";
import { supabase } from "./supabaseClient";

// Habilita LayoutAnimation no Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 🔹 Helper para fazer upload do avatar no Supabase Storage
async function uploadAvatarToSupabase(localUri, userId) {
  try {
    if (!localUri) throw new Error("URI da imagem não informada.");
    if (!userId) throw new Error("ID do usuário não informado.");

    // Descobre extensão a partir do caminho
    const extMatch = localUri.split(".").pop();
    const ext = extMatch ? extMatch.toLowerCase() : "jpg";

    // caminho dentro do bucket "avatars"
    const filePath = `avatars/${userId}-${Date.now()}.${ext}`;

    // 🔹 Em vez de .blob(), usamos arrayBuffer no React Native
    const response = await fetch(localUri);
    const arrayBuffer = await response.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    const { error } = await supabase.storage
      .from("avatars") // nome do bucket
      .upload(filePath, fileBytes, {
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) {
      console.log("Erro upload Supabase:", error);
      throw error;
    }

    // Pega URL pública
    const { data: publicData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl;
    if (!publicUrl) {
      throw new Error("Não foi possível obter a URL pública do avatar.");
    }

    return publicUrl;
  } catch (err) {
    console.log("uploadAvatarToSupabase erro:", err);
    throw err;
  }
}


export default function PerfilScreen({
  onPressBack,
  onChangeTab,
  activeTab = "resumo",
  onLogout,
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
        const alunoId = getAlunoId();
        if (!alunoId) {
          console.log("Nenhum aluno logado encontrado em getAlunoId()");
          setLoadingPerfil(false);
          return;
        }

        const user = getLoggedUser();
        const token = user?.token;

        console.log("Carregando perfil a partir da API para aluno:", alunoId);
        const inicio = Date.now();

        setLoadingPerfil(true);
        const resp = await fetch(`${API_URL}/api/profiles/${alunoId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

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

        // foto vinda do backend (Supabase) via avatar_url
        setAvatarUri(data.avatar_url || null);
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

  // --------- PICK DE IMAGEM (TROCAR FOTO) + UPLOAD NO SUPABASE ----------
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

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const localUri = result.assets[0].uri;
      const alunoId = getAlunoId();

      if (!alunoId) {
        Alert.alert("Erro", "Nenhum aluno logado encontrado.");
        return;
      }

      Alert.alert("Avatar", "Enviando foto, aguarde alguns instantes...");

      const publicUrl = await uploadAvatarToSupabase(localUri, alunoId);

      setAvatarUri(publicUrl);

      Alert.alert("Avatar", "Foto atualizada! Não esqueça de salvar o perfil.");
    } catch (err) {
      console.log("Erro ao trocar avatar:", err);
      Alert.alert("Erro", "Não foi possível enviar a imagem de perfil.");
    }
  }

  // --------- SALVAR PERFIL NA API ----------
  async function handleSave() {
    try {
      const alunoId = getAlunoId();
      if (!alunoId) {
        Alert.alert("Erro", "Nenhum aluno logado encontrado.");
        return;
      }

      const user = getLoggedUser();
      const token = user?.token;

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

      let avatarUrlToSend = null;
      if (avatarUri && avatarUri.startsWith("http")) {
        avatarUrlToSend = avatarUri;
      }

      let payload = {
        full_name,
        email: profile.email || null,
        phone: profile.telefone || null,
        altura_cm: alturaNum,
        peso_kg: pesoNum,
        data_nascimento: dataNascimentoIso,
        avatar_url: avatarUrlToSend,
      };

      if (activeSection === "seguranca") {
        if (profile.senha || profile.confirmarSenha) {
          if (profile.senha !== profile.confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
          }
          payload.new_password = profile.senha; // se backend aceitar isso
        }
      }

      console.log("Enviando payload perfil:", payload);

      const resp = await fetch(`${API_URL}/api/profiles/${alunoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      console.log("Status HTTP salvar perfil:", resp.status);

      if (!resp.ok) {
        const txt = await resp.text();
        console.log("Erro ao salvar (corpo):", txt);
        throw new Error(`HTTP ${resp.status}`);
      }

      const currentUser = getLoggedUser() || {};
      setLoggedUser({
        ...currentUser,
        full_name,
        email: profile.email || currentUser.email,
        avatar_url: avatarUrlToSend ?? currentUser.avatar_url,
      });

      Alert.alert("Perfil", "Dados atualizados com sucesso! ✅");
    } catch (err) {
      console.log("Erro ao salvar perfil:", err);
      Alert.alert("Erro", "Não foi possível salvar os dados do perfil.");
    }
  }

  // --------- LOGOFF ----------
  function handleLogoutPress() {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          onLogout && onLogout();
        },
      },
    ]);
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
            <TouchableOpacity onPress={onPressBack}>
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave} disabled={loadingPerfil}>
              <Text
                style={[styles.saveText, loadingPerfil && { opacity: 0.5 }]}
              >
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
                  placeholder="Nova senha"
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

          {/* BOTÃO DE LOGOUT */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
          >
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>

        {/* TAB BAR FIXA NO RODAPÉ */}
        <View style={styles.tabWrapper}>
          <BottomTab activeTab={activeTab} onChangeTab={onChangeTab} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// STYLES
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  backText: {
    color: "#6366F1",
    fontSize: 18,
  },
  saveText: {
    color: "#6366F1",
    fontSize: 18,
    fontWeight: "700",
  },

  avatarWrapper: {
    marginTop: 16,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

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

  infoRow: {
    flexDirection: "row",
    justifyContent: "space_between",
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

  logoutButton: {
    marginTop: 16,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.7)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  logoutText: {
    color: "rgba(248,113,113,0.95)",
    fontSize: 14,
    fontWeight: "600",
  },

  tabWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },
});

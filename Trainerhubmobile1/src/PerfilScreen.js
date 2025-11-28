
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

  // MOCK — depois pluga na API
  const [profile, setProfile] = useState({
    nome: "José",
    sobrenome: "Mac",
    nascimento: "07/08/1999",
    altura: "190cm",
    peso: "90kg",
    email: "jose@example.com",
    telefone: "3199777-0000",
    senha: "",
    confirmarSenha: "",
  });

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

  function handleSave() {
    // aqui você depois manda pro backend
    console.log("Salvar perfil:", profile, avatarUri);
    Alert.alert("Perfil", "Dados salvos (mock).");
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

          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Salvar</Text>
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

        {/* TAB BAR INFERIOR PADRÃO */}
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

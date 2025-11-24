
import React, { useState } from "react";
import { Alert } from "react-native";

// TELAS
import HomeScreen from "./src/HomeScreen";
import LoginScreen from "./src/LoginScreen";
import RegisterStep1 from "./src/RegisterStep1";
import RegisterStep2 from "./src/RegisterStep2";
import RegisterStep3 from "./src/RegisterStep3";
import ResumoScreen from "./src/ResumoScreen";

export default function App() {
  // controla qual tela está aberta
  const [screen, setScreen] = useState("home");
  // guarda dados do cadastro entre os steps
  const [formData, setFormData] = useState({});

  // -------- LOGIN --------
  function handleLoginSubmit(data) {
    console.log("Dados de login:", data);

    Alert.alert("Sucesso", "Login realizado com sucesso!", [
      {
        text: "OK",
        onPress: () => setScreen("resumo"), // vai pro dashboard
      },
    ]);
  }

  // -------- CADASTRO STEP 1 -> 2 --------
  function handleStep1Next(data) {
    // data = { email, senha }
    setFormData(data);
    setScreen("register2");
  }

  // -------- CADASTRO STEP 2 -> 3 --------
  function handleStep2Next(data) {
    // junta com o que já tinha
    setFormData((prev) => ({ ...prev, ...data }));
    setScreen("register3");
  }

  // -------- CADASTRO STEP 3 -> FINAL --------
  function handleStep3Finish(data) {
    const allData = { ...formData, ...data };
    console.log("Cadastro completo:", allData);

    Alert.alert("Sucesso", "Cadastro efetuado com sucesso!", [
      {
        text: "OK",
        onPress: () => {
          setFormData({});
          setScreen("resumo"); // manda pro dashboard
        },
      },
    ]);
  }

  // --------- RENDERIZAÇÃO DAS TELAS ---------

  // HOME (botões Login / Registrar)
  if (screen === "home") {
    return (
      <HomeScreen
        onPressLogin={() => setScreen("login")}
        onPressRegister={() => setScreen("register1")}
      />
    );
  }

  // LOGIN
  if (screen === "login") {
    return (
      <LoginScreen
        onSubmit={handleLoginSubmit}
        onBack={() => setScreen("home")}
      />
    );
  }

  // REGISTER STEP 1
  if (screen === "register1") {
    return (
      <RegisterStep1
        onNext={handleStep1Next}
        onBack={() => setScreen("home")}
      />
    );
  }

  // REGISTER STEP 2
  if (screen === "register2") {
    return (
      <RegisterStep2
        onNext={handleStep2Next}
        onBack={() => setScreen("register1")}
      />
    );
  }

  // REGISTER STEP 3
  if (screen === "register3") {
    return (
      <RegisterStep3
        onFinish={handleStep3Finish}
        onBack={() => setScreen("register2")}
      />
    );
  }

  // RESUMO / DASHBOARD
  if (screen === "resumo") {
    return (
      <ResumoScreen
        activeTab="resumo"
        onPressProfile={() => Alert.alert("Perfil", "Tela de perfil ainda será criada.")}
        onChangeTab={(tab) => {
          if (tab === "resumo") return;
          Alert.alert("Em breve", `Tela '${tab}' ainda não foi implementada.`);
        }}
        nextClassTitle={"Próxima\nAula:"}
        nextClassDate={"12/12"}
      />
    );
  }

  // fallback (não deveria chegar aqui)
  return null;
}

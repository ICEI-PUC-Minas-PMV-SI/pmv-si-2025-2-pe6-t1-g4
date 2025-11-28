// App.js
import React, { useState } from "react";
import { Alert } from "react-native";

import HomeScreen from "./src/HomeScreen";
import LoginScreen from "./src/LoginScreen";
import RegisterStep1 from "./src/RegisterStep1";
import RegisterStep2 from "./src/RegisterStep2";
import RegisterStep3 from "./src/RegisterStep3";
import ResumoScreen from "./src/ResumoScreen";
import AulasScreen from "./src/AulasScreen";
import TreinosScreen from "./src/TreinosScreen";
import PerfilScreen from "./src/PerfilScreen";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [formData, setFormData] = useState({});
  // qual é a “tela principal” atual (Resumo, Aulas ou Treinos)?
  const [lastMainScreen, setLastMainScreen] = useState("resumo");

  // --------- LOGIN ----------
  function handleLoginSubmit(data) {
    console.log("Dados de login:", data);

    Alert.alert("Sucesso", "Login realizado com sucesso!", [
      {
        text: "OK",
        onPress: () => {
          setLastMainScreen("resumo");
          setScreen("resumo");
        },
      },
    ]);
  }

  // --------- CADASTRO STEP 1 -> 2 ----------
  function handleStep1Next(data) {
    setFormData(data); // { email, senha }
    setScreen("register2");
  }

  // --------- CADASTRO STEP 2 -> 3 ----------
  function handleStep2Next(data) {
    setFormData((prev) => ({ ...prev, ...data }));
    setScreen("register3");
  }

  // --------- CADASTRO STEP 3 -> FINAL ----------
  function handleStep3Finish(data) {
    const allData = { ...formData, ...data };
    console.log("Cadastro completo:", allData);

    Alert.alert("Sucesso", "Cadastro efetuado com sucesso!", [
      {
        text: "OK",
        onPress: () => {
          setFormData({});
          setLastMainScreen("resumo");
          setScreen("resumo");
        },
      },
    ]);
  }

  // --------- TROCA DE ABA NO MENU INFERIOR ----------
  function handleChangeTab(tab) {
    if (tab === "resumo") {
      setLastMainScreen("resumo");
      setScreen("resumo");
    } else if (tab === "aulas") {
      setLastMainScreen("aulas");
      setScreen("aulas");
    } else if (tab === "treinos") {
      setLastMainScreen("treinos");
      setScreen("treinos");
    }
  }

  // --------- RENDERIZAÇÃO DAS TELAS ----------

  if (screen === "home") {
    return (
      <HomeScreen
        onPressLogin={() => setScreen("login")}
        onPressRegister={() => setScreen("register1")}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginScreen
        onSubmit={handleLoginSubmit}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "register1") {
    return (
      <RegisterStep1
        onNext={handleStep1Next}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "register2") {
    return (
      <RegisterStep2
        onNext={handleStep2Next}
        onBack={() => setScreen("register1")}
      />
    );
  }

  if (screen === "register3") {
    return (
      <RegisterStep3
        onFinish={handleStep3Finish}
        onBack={() => setScreen("register2")}
      />
    );
  }

  if (screen === "resumo") {
    return (
      <ResumoScreen
        activeTab="resumo"
        onPressProfile={() => {
          setScreen("perfil");
        }}
        onChangeTab={handleChangeTab}
        nextClassTitle={"Próxima\nAula:"}
        nextClassDate={"12/12"}
      />
    );
  }

  if (screen === "aulas") {
    return (
      <AulasScreen
        activeTab="aulas"
        onPressProfile={() => {
          setScreen("perfil");
        }}
        onChangeTab={handleChangeTab}
        lessons={[
          {
            id: 1,
            date: "12/12",
            time: "08:00",
            title: "Spinning",
            description: "Mantenha a coluna reta com o abdômen contraído.",
          },
          {
            id: 2,
            date: "13/12",
            time: "19:00",
            title: "Funcional",
            description: "Trabalhe o corpo todo com movimentos controlados.",
          },
          {
            id: 3,
            date: "15/12",
            time: "07:30",
            title: "Musculação",
            description:
              "Ajuste a carga de acordo com a orientação do instrutor.",
          },
        ]}
      />
    );
  }

  if (screen === "treinos") {
    return (
      <TreinosScreen
        activeTab="treinos"
        onPressProfile={() => {
          setScreen("perfil");
        }}
        onChangeTab={handleChangeTab}
      />
    );
  }

  if (screen === "perfil") {
    return (
      <PerfilScreen
        // botão "Voltar" leva pra última tela principal (Resumo/Aulas/Treinos)
        onPressBack={() => setScreen(lastMainScreen)}
        activeTab={lastMainScreen}
        onChangeTab={handleChangeTab}
      />
    );
  }

  // fallback
  return null;
}

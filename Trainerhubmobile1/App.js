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
import { useFonts, Comfortaa_400Regular, Comfortaa_700Bold } from "@expo-google-fonts/comfortaa";


import { API_URL, setLoggedUser, clearAuth } from "./src/config/api";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [formData, setFormData] = useState({});
  const [lastMainScreen, setLastMainScreen] = useState("resumo");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [fontsLoaded] = useFonts({
    "Comfortaa-Regular": Comfortaa_400Regular,
    "Comfortaa-Bold": Comfortaa_700Bold,
  });

if (!fontsLoaded) {
  // enquanto a fonte carrega, não renderiza nada
  return null;
  
}

  // --------- LOGIN REAL ----------
async function handleLoginSubmit(payload) {
  console.log("handleLoginSubmit payload:", payload);
  const { email, password } = payload;

  if (loadingLogin) return;

  try {
    setLoadingLogin(true);
    console.log("Tentando login na API...", email);

    const resp = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });


      console.log("Status HTTP /api/login:", resp.status);

      const data = await resp.json().catch(() => null);
      console.log("Resposta /api/login:", data);

      if (!resp.ok) {
        const msg =
          data?.message ||
          data?.error ||
          "Não foi possível fazer login. Verifique suas credenciais.";
        Alert.alert("Erro de login", msg);
        return;
      }

      // API pode responder:
      // { user: { id, full_name, email, ... }, token: "..." }
      const apiUser = data.user || data;
      const token = data.token || apiUser.token;

      const user = {
        id: apiUser.id,
        full_name: apiUser.full_name,
        email: apiUser.email,
        token: token,
        ...apiUser,
      };

      // guarda usuário logado para o resto do app (getAlunoId)
      setLoggedUser(user);

      Alert.alert(
        "Bem-vindo",
        `Olá, ${user.full_name || user.email || "aluno"}!`,
        [
          {
            text: "OK",
            onPress: () => {
              setLastMainScreen("resumo");
              setScreen("resumo");
            },
          },
        ]
      );
    } catch (err) {
      console.log("Erro ao chamar /api/login:", err);
      Alert.alert(
        "Erro",
        "Não foi possível conectar ao servidor. Verifique se a API está rodando e o IP no api.js."
      );
    } finally {
      setLoadingLogin(false);
    }
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

  // --------- CADASTRO STEP 3 -> FINAL (AGORA REAL) ----------
  async function handleStep3Finish(data) {
    const allData = { ...formData, ...data };
    console.log("Dados de cadastro (form):", allData);

    try {
      // altura: "1,70" -> 170
      const alturaNum = allData.altura
        ? parseInt(String(allData.altura).replace(/\D/g, ""), 10)
        : null;

      // peso: "70" -> 70
      const pesoNum = allData.peso
        ? parseFloat(
            String(allData.peso)
              .replace(",", ".")
              .replace(/[^\d.]/g, "")
          )
        : null;

      // dataNascimento: "06/05/1998" -> "1998-05-06"
      let dataNascimentoIso = null;
      if (
        allData.dataNascimento &&
        String(allData.dataNascimento).includes("/")
      ) {
        const [dia, mes, ano] = String(allData.dataNascimento).split("/");
        if (dia && mes && ano) {
          dataNascimentoIso = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(
            2,
            "0"
          )}`;
        }
      }

      const payload = {
        email: allData.email,
        password: allData.senha, // mesmo campo que você usa no login
        full_name: allData.nomeCompleto || allData.full_name || null,
        cpf: allData.cpf || null,
        phone: allData.telefone || null,
        gender: allData.genero || null,
        altura_cm: alturaNum,
        peso_kg: pesoNum,
        data_nascimento: dataNascimentoIso,
      };

      console.log("Enviando payload de cadastro:", payload);

      const resp = await fetch(`${API_URL}/api/auth/register`, {
        // 👆 TROQUEI de /api/register para /api/auth/register
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Status HTTP /api/auth/register:", resp.status);
      const respBodyText = await resp.text();
      console.log("Corpo /api/auth/register:", respBodyText);

      if (!resp.ok) {
        let msg = "Não foi possível concluir o cadastro.";
        try {
          const parsed = JSON.parse(respBodyText);
          msg = parsed?.message || parsed?.error || msg;
        } catch (_) {
          // se não for JSON, ignora e usa msg padrão
        }

        Alert.alert("Erro no cadastro", msg);
        return;
      }

      // Se chegou aqui, o cadastro foi criado
      Alert.alert(
        "Sucesso",
        "Cadastro efetuado com sucesso! Agora é só fazer login.",
        [
          {
            text: "OK",
            onPress: () => {
              setFormData({});
              setScreen("login"); // manda direto pro login
            },
          },
        ]
      );
    } catch (err) {
      console.log("Erro ao chamar /api/auth/register:", err);
      Alert.alert(
        "Erro",
        "Não foi possível conectar ao servidor de cadastro. Verifique a API."
      );
    }
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

  // --------- LOGOUT ----------
  function handleLogout() {
    clearAuth(); // limpa usuário/alunoId na API
    setFormData({}); // limpa dados de cadastro temporários
    setLastMainScreen("resumo");
    setScreen("home"); // volta pra tela inicial
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
        onPressBack={() => setScreen(lastMainScreen)}
        activeTab={lastMainScreen}
        onChangeTab={handleChangeTab}
        onLogout={handleLogout} // botão "Sair da conta" chama isso
      />
    );
  }

  return null;
}

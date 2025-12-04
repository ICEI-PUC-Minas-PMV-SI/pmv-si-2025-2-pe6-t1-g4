// Trainerhubmobile1/src/RegisterScreen.js
import React, { useState } from "react";
import { Alert } from "react-native";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import RegisterStep3 from "./RegisterStep3";
import { API_URL } from "./config/api";

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);

  // vamos guardar o que o usuário digitou em cada etapa
  const [step1Data, setStep1Data] = useState(null);
  const [step2Data, setStep2Data] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleCancel() {
    navigation.goBack(); // volta para a tela de login
  }

  // STEP 1 -> STEP 2
  // aqui eu assumo que RegisterStep1 chama onNext({ nome, sobrenome, nascimento })
  function handleStep1Next(data) {
    setStep1Data(data);
    setStep(2);
  }

  // STEP 2 -> STEP 3
  // assumindo que RegisterStep2 chama onNext({ email, password })
  function handleStep2Next(data) {
    setStep2Data(data);
    setStep(3);
  }

  // função auxiliar para converter "dd/mm/aaaa" -> "aaaa-mm-dd"
  function toIsoDate(brDate) {
    if (!brDate || !brDate.includes("/")) return null;
    const [dia, mes, ano] = brDate.split("/");
    if (!dia || !mes || !ano) return null;
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }

  // STEP 3 -> chama backend
  // RegisterStep3 chama onFinish({ genero, altura, peso, telefone })
  async function handleStep3Finish(step3Data) {
    try {
      if (!step1Data || !step2Data) {
        Alert.alert(
          "Erro",
          "Dados incompletos do cadastro. Volte e tente novamente."
        );
        return;
      }

      setLoading(true);

      // monta full_name
      const full_name = `${step1Data.nome || ""} ${
        step1Data.sobrenome || ""
      }`.trim();

      // trata nascimento
      const data_nascimento = toIsoDate(step1Data.nascimento);

      // trata altura ex: "1,75" -> 175 cm
      let altura_cm = null;
      if (step3Data.altura) {
        const num = step3Data.altura.replace(",", ".").replace(/[^\d.]/g, "");
        const metros = parseFloat(num); // 1.75
        if (!isNaN(metros)) {
          altura_cm = Math.round(metros * 100);
        }
      }

      // trata peso ex: "75,00" -> 75.00
      let peso_kg = null;
      if (step3Data.peso) {
        const num = step3Data.peso.replace(",", ".").replace(/[^\d.]/g, ".");
        const peso = parseFloat(num);
        if (!isNaN(peso)) {
          peso_kg = peso;
        }
      }

      const telefone = step3Data.telefone || null;
      const genero = step3Data.genero || null;

      // 1) cria usuário no backend -> /api/auth/register
      const payloadRegister = {
        email: step2Data.email,
        password: step2Data.password,
        full_name,
      };

      console.log("Enviando cadastro:", payloadRegister);

      const respReg = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadRegister),
      });

      console.log("Status /api/auth/register:", respReg.status);

      if (!respReg.ok) {
        const txt = await respReg.text();
        console.log("Erro cadastro backend:", txt);
        throw new Error(`Erro no cadastro: HTTP ${respReg.status}`);
      }

      const regData = await respReg.json();
      console.log("Resposta cadastro:", regData);

      const alunoId = regData.user?.id || regData.id;
      if (!alunoId) {
        throw new Error("Backend não retornou ID do usuário.");
      }

      // 2) atualiza perfil com os detalhes físicos -> /api/profiles/{id}
      const payloadProfile = {
        full_name,
        phone: telefone,
        altura_cm,
        peso_kg,
        data_nascimento,
        genero,
      };

      console.log("Atualizando perfil:", payloadProfile);

      const respProfile = await fetch(`${API_URL}/api/profiles/${alunoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadProfile),
      });

      console.log("Status /api/profiles PUT:", respProfile.status);

      if (!respProfile.ok) {
        const txt = await respProfile.text();
        console.log("Erro ao atualizar perfil:", txt);
        // não dou throw aqui pra não travar o cadastro inteiro, só aviso
      }

      Alert.alert(
        "Cadastro concluído",
        "Conta criada com sucesso! Agora faça login para entrar.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (err) {
      console.log("Erro no fluxo de cadastro:", err);
      Alert.alert(
        "Erro",
        "Não foi possível criar a conta. Verifique conexão e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  // qual passo mostrar?
  if (step === 1) {
    return (
      <RegisterStep1
        onNext={handleStep1Next}
        onBack={handleCancel}
        initialData={step1Data}
      />
    );
  }

  if (step === 2) {
    return (
      <RegisterStep2
        onNext={handleStep2Next}
        onBack={() => setStep(1)}
        initialData={step2Data}
      />
    );
  }

  return (
    <RegisterStep3
      onFinish={handleStep3Finish}
      onBack={() => setStep(2)}
      loading={loading}
    />
  );
}

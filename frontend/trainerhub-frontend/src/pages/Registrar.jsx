import React, { useState } from "react";
import background from "../img/Entrar.png";
import logo from "../img/ef23f9fe-48a2-4fe4-9b52-7bfb8a7e51dc-removebg-preview 1.svg";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Atualiza os estados conforme o usuário digita
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (formData.senha !== formData.confirmarSenha) {
      setMensagem("⚠️ As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          cpf: formData.cpf,
          senha: formData.senha,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar usuário.");
      }

      const data = await response.json();
      setMensagem("✅ Registro realizado com sucesso!");
      console.log("Usuário cadastrado:", data);

      setFormData({
        nome: "",
        email: "",
        cpf: "",
        senha: "",
        confirmarSenha: "",
      });
    } catch (error) {
      setMensagem("❌ Ocorreu um erro ao registrar. Tente novamente.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* Overlay escurecido */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
          <img onClick={() => navigate("/")} src={logo} alt="Logo" className="w-36 md:w-36 h-auto" />
        </div>

        {/* Caixa de registro */}
        <div className="bg-[#2E2E2E] bg-opacity-90 p-8 rounded-md shadow-lg w-[90%] max-w-sm text-center">
          <h1 className="text-2xl font-bold text-white mb-6">Registrar</h1>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome completo"
              className="p-3 rounded-md bg-[#3E3E3E] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded-md bg-[#3E3E3E] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="CPF"
              className="p-3 rounded-md bg-[#3E3E3E] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              className="p-3 rounded-md bg-[#3E3E3E] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              className="p-3 rounded-md bg-[#3E3E3E] text-white placeholder-gray-400 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition"
            >
              Criar conta
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6">
            Já tem uma conta?{" "}
            <a  href="/login" className="text-white font-semibold hover:underline">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

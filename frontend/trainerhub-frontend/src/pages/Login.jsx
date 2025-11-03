import React, { useState } from "react";
import background from "../img/Entrar.png";
import logo from "../img/ef23f9fe-48a2-4fe4-9b52-7bfb8a7e51dc-removebg-preview 1.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [emailOrCpf, setEmailOrCpf] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1️⃣ Faz login
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailOrCpf,
          password: password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMsg("Credenciais inválidas. Verifique seu email e senha.");
        } else {
          setErrorMsg("Erro ao tentar fazer login. Tente novamente.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      const token = data.access_token;
      const userId = data.user?.id;

      if (!token || !userId) {
        setErrorMsg("Erro ao processar login. Dados incompletos.");
        setLoading(false);
        return;
      }

      // 2️⃣ Busca dados completos do usuário
      const userResponse = await fetch(
        `/users/${userId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!userResponse.ok) {
        console.error("Erro ao buscar usuário:", await userResponse.text());
        setErrorMsg("Erro ao carregar dados do usuário.");
        setLoading(false);
        return;
      }

      const fullUser = await userResponse.json();

      // 3️⃣ Armazena token e dados completos
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(fullUser[0]));

      // 4️⃣ Redireciona
      if(fullUser[0].role == "professor") return navigate("/ProfessorPaginaInicial");
        navigate("/PaginaInicial");
    } catch (error) {
      console.error("Erro de rede:", error);
      setErrorMsg("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <div className="flex items-center gap-3 mb-4">
          <img
            onClick={() => navigate("/")}
            src={logo}
            alt="Logo"
            className="w-36 md:w-36 h-auto cursor-pointer"
          />
        </div>

        <div className="bg-[#2E2E2E] bg-opacity-90 p-8 rounded-md shadow-lg w-[90%] max-w-sm text-center">
          <h1 className="text-2xl font-bold text-white mb-6">Entrar</h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              value={emailOrCpf}
              onChange={(e) => setEmailOrCpf(e.target.value)}
              className="p-3 rounded-md bg-[#3E3E3E] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-md bg-[#3E3E3E] text-white placeholder-gray-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-2 rounded-md transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {errorMsg && <p className="text-red-400 text-sm mt-4">{errorMsg}</p>}

          <a
            onClick={() => navigate("/RedefinirSenha")}
            href="#"
            className="text-gray-300 text-sm mt-3 inline-block hover:underline"
          >
            Esqueceu a senha?
          </a>

          <p className="text-gray-400 text-sm mt-6">
            Primeira vez aqui?{" "}
            <a
              onClick={() => navigate("/Registrar")}
              href="#"
              className="text-white font-semibold hover:underline"
            >
              Cadastre-se agora.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

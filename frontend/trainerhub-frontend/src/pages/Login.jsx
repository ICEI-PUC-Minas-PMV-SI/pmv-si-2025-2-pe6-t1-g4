import React, { useState } from "react";
import background from "../img/Entrar.png";
import logo from "../img/ef23f9fe-48a2-4fe4-9b52-7bfb8a7e51dc-removebg-preview 1.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isProfessor, setIsProfessor] = useState(false);
  const [emailOrCpf, setEmailOrCpf] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Navegação condicional:
    if (isProfessor) {
      navigate("/ProfessorPaginaInicial");
    } else {
      navigate("/PaginaInicial");
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
          <img
            onClick={() => navigate("/")}
            src={logo}
            alt="Logo"
            className="w-36 md:w-36 h-auto cursor-pointer"
          />
        </div>

        {/* Caixa de login */}
        <div className="bg-[#2E2E2E] bg-opacity-90 p-8 rounded-md shadow-lg w-[90%] max-w-sm text-center">
          <h1 className="text-2xl font-bold text-white mb-6">Entrar</h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email ou CPF"
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

            {/* Checkbox Sou Professor */}
            <label className="flex items-center gap-2 text-gray-300 text-sm mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isProfessor}
                onChange={(e) => setIsProfessor(e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              Sou professor
            </label>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition"
            >
              Entrar
            </button>
          </form>

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

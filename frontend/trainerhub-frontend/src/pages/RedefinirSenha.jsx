import React, { useState } from "react";
import background from "../img/Home.png"; 
import LogoSvg from "../img/ef23f9fe-48a2-4fe4-9b52-7bfb8a7e51dc-removebg-preview 1.svg";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Envia o e-mail para o backend
    fetch("http://localhost:8000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Se o e-mail existir, enviaremos um link de redefinição.");
      })
      .catch(() => alert("Erro ao enviar solicitação. Tente novamente."));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundColor: "rgba(0,0,0,0.9)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="flex flex-col items-center">
        <img onClick={() => navigate("/")} src={LogoSvg} alt="Logo" className="w-40 mb-4" />

        <div className="bg-[#2c2c2c] bg-opacity-90 rounded-xl shadow-lg p-10 w-[380px]">
          <h2 className="text-white text-2xl font-bold text-center mb-6">
            Redefinir Senha
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md bg-[#3d3d3d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition-colors"
            >
              Enviar link de redefinição
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Voltar para o login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

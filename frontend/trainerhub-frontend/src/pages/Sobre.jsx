import React from "react";
import { useNavigate } from "react-router-dom";

const SobreTrainerHub = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center px-6 py-10">
      {/* Cabeçalho */}
      <header className="w-full flex justify-start mb-10">
        <h1 className="text-xl font-bold tracking-wide">TRAINERHUB</h1>
      </header>

      {/* Título principal */}
      <h2 className="text-3xl font-bold text-center mb-3">
        Conheça nosso projeto
      </h2>
      <p className="text-center text-gray-300 max-w-2xl mb-10">
        Na TrainerHub, acreditamos que o fitness não é apenas um destino — é uma
        jornada rumo a uma vida mais saudável e equilibrada.
      </p>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full items-center">
        {/* Objetivo */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-red-500 mb-4">Objetivo</h3>
          <p className="text-gray-300 leading-relaxed">
            A TrainerHub é uma plataforma digital desenvolvida para conectar
            alunos, personal trainers e academias, facilitando o acompanhamento
            de treinos, a evolução física e a comunicação em tempo real. Nosso
            objetivo é tornar o fitness mais acessível, organizado e motivador
            por meio da tecnologia.
          </p>
        </div>

        {/* Equipe */}
        <div className="text-left">
          <h3 className="text-xl font-bold text-red-500 mb-4">Equipe</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Augusto Gabriel Lomba Pires</li>
            <li>Leonardo Almeida Braga</li>
            <li>Lucas de Souza Nassif Lemos</li>
            <li>Wellington dos Santos Oliveira</li>
          </ul>
        </div>

        {/* Mapa */}
        <div className="flex flex-col items-center self-start">
            <div className="relative w-64 h-64 flex justify-center items-center">
                <img
                src={require("../img/mapa-brasil.png")}
                alt="Mapa Brasil"
                className="object-contain w-64 h-64"
                />
        </div>
            <p className="text-gray-300 text-sm mt-3 text-center">
                Levando a tecnologia fitness <br /> para todas as regiões do Brasil
            </p>
        </div>
      </div>
      
      {/* Botão de voltar */}
      <button onClick={() => navigate("/")} className="mt-10 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition">
        Página Inicial
      </button>
    </div>
  );
}

export default SobreTrainerHub;

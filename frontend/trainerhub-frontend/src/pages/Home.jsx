import React from "react";
import LogoSvg from "../img/ef23f9fe-48a2-4fe4-9b52-7bfb8a7e51dc-removebg-preview 1.svg";
import background from "../img/Home.png";

const Home = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white overflow-x-hidden"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* Overlay escurecido */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center max-w-[1440px] mx-auto px-6 md:px-12 py-4">
        <div className="flex items-center gap-3">
          <img src={LogoSvg} alt="Logo" className="w-36 md:w-36 h-auto" />
        </div>

        <div className="flex gap-3">
          <button className="bg-white text-black px-4 py-1 rounded-full text-sm hover:bg-gray-200">
            Entrar
          </button>
          <button className="bg-white text-black px-4 py-1 rounded-full text-sm hover:bg-gray-200">
            Registrar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-start max-w-[1440px] mx-auto px-6 md:px-12 h-[80vh]">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-xl">
          Viva a Sua <br /> Melhor Versão
        </h1>

        <p className="text-gray-300 mb-8 max-w-lg text-base md:text-lg">
          Na TrainerHub, acreditamos que o fitness não é apenas um destino — é
          uma jornada rumo a uma vida mais saudável e equilibrada.
        </p>

        <button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200">
          Comece Agora
        </button>

        {/* Redes sociais */}
        <div className="flex gap-5 mt-8 text-gray-300 text-xl">
          <i className="fa-brands fa-twitter hover:text-white"></i>
          <i className="fa-brands fa-facebook hover:text-white"></i>
          <i className="fa-brands fa-instagram hover:text-white"></i>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 flex flex-wrap justify-around items-center bg-black/80 py-10">
        <div className="text-center m-3">
          <p className="text-red-500 font-bold text-2xl md:text-3xl">0+</p>
          <p className="text-gray-300 text-sm md:text-base">
            Anos de Experiência
          </p>
        </div>
        <div className="text-center m-3">
          <p className="text-red-500 font-bold text-2xl md:text-3xl">0+</p>
          <p className="text-gray-300 text-sm md:text-base">
            Treinadores Certificados
          </p>
        </div>
        <div className="text-center m-3">
          <p className="text-red-500 font-bold text-2xl md:text-3xl">0+</p>
          <p className="text-gray-300 text-sm md:text-base">
            Alunos Satisfeitos
          </p>
        </div>
        <div className="text-center m-3">
          <p className="text-red-500 font-bold text-2xl md:text-3xl">0%</p>
          <p className="text-gray-300 text-sm md:text-base">
            Satisfação dos Clientes
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;

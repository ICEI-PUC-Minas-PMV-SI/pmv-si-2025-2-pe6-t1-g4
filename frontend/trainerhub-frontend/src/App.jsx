import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import Sobre from "./pages/Sobre";
import RedefinirSenha from "./pages/RedefinirSenha";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Registrar" element={<Registrar />} />
        <Route path="/Sobre" element={<Sobre />} />
        <Route path="/RedefinirSenha" element={<RedefinirSenha />} />
      </Routes>
  );
}

export default App;

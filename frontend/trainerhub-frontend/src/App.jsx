import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import Sobre from "./pages/Sobre";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Registrar" element={<Registrar />} />
        <Route path="/Sobre" element={<Sobre />} />
      </Routes>
  );
}

export default App;

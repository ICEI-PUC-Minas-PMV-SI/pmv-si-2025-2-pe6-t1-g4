import React, { useState, useEffect } from "react";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

/** Componente Perfil integrado (sem overflow interno) */
function Perfil({ userProp }) {
  const storedUser = userProp || JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || storedUser.emall || "",
    cpf: storedUser.cpf || "",
    peso: storedUser.peso || "",
    altura: storedUser.altura || "",
    genero: storedUser.genero || storedUser.gender || "",
    telefone: storedUser.telefone || storedUser.phone || "",
  });

  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (userProp) {
      setForm({
        name: userProp.name || "",
        email: userProp.email || userProp.emall || "",
        cpf: userProp.cpf || "",
        peso: userProp.peso || "",
        altura: userProp.altura || "",
        genero: userProp.genero || userProp.gender || "",
        telefone: userProp.telefone || userProp.phone || "",
      });
    }
  }, [userProp]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    try {
      const userToSave = { ...(JSON.parse(localStorage.getItem("user")) || {}), ...form };
      localStorage.setItem("user", JSON.stringify(userToSave));
      setSavedMsg("Salvo com sucesso!");
      setTimeout(() => setSavedMsg(""), 2500);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      setSavedMsg("Erro ao salvar.");
      setTimeout(() => setSavedMsg(""), 2500);
    }
  }

  return (
    <div className="w-full flex justify-center items-start pt-16 pb-12 px-8 bg-transparent">
      <div className="w-full max-w-5xl">
        <h1 className="text-5xl font-bold text-white mb-10">Perfil</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">Nome Completo</label>
            <div className="col-span-12 md:col-span-8">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Digite seu nome"
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
              />
            </div>

            <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">Email</label>
            <div className="col-span-12 md:col-span-8">
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@exemplo.com"
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
                type="email"
              />
            </div>

            <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">CPF</label>
            <div className="col-span-12 md:col-span-8">
              <input
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">Peso</label>
            <div className="col-span-12 md:col-span-8">
              <input
                name="peso"
                value={form.peso}
                onChange={handleChange}
                placeholder="Ex: 72 kg"
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">Altura</label>
            <div className="col-span-12 md:col-span-8">
              <input
                name="altura"
                value={form.altura}
                onChange={handleChange}
                placeholder="Ex: 1.78 m"
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">Gênero</label>
            <div className="col-span-12 md:col-span-8">
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none appearance-none"
              >
                <option value="">Selecionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Indefinido">Indefinido</option>
              </select>
            </div>

            <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">Telefone</label>
            <div className="col-span-12 md:col-span-8">
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(00) 99999-9999"
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-sm"
            >
              Salvar
            </button>

            <button
              type="button"
              onClick={() => {
                setForm({
                  name: storedUser.name || "",
                  email: storedUser.email || storedUser.emall || "",
                  cpf: storedUser.cpf || "",
                  peso: storedUser.peso || "",
                  altura: storedUser.altura || "",
                  genero: storedUser.genero || storedUser.gender || "",
                  telefone: storedUser.telefone || storedUser.phone || "",
                });
                setSavedMsg("");
              }}
              className="px-4 py-3 rounded-2xl border border-gray-700 text-white"
            >
              Cancelar
            </button>

            {savedMsg && <span className="text-green-300 ml-2">{savedMsg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

/** PaginaInicial **/
export default function PaginaInicial() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTreinos, setShowTreinos] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [treinos, setTreinos] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (showTreinos) {
      async function carregarTreinos() {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          const response = await fetch(`http://localhost:8000/training/studentSheets/${user.id}`);
          const data = await response.json();

          const treinosConvertidos = [];

          data.forEach((ficha) => {
            ficha.series?.forEach((serie) => {
              const exercicio = serie.exercicio;
              if (exercicio) {
                treinosConvertidos.push({
                  id: exercicio.id,
                  nome: exercicio.name || exercicio.nome,
                  descricao: exercicio.description || exercicio.descricao,
                  imagem: exercicio.image_url || exercicio.imagem,
                });
              }
            });
          });

          setTreinos(treinosConvertidos);
        } catch (error) {
          console.error("Erro ao carregar treinos:", error);
        }
      }

      carregarTreinos();
    }
  }, [showTreinos]);

  function abrirAba(aba) {
    setShowPerfil(aba === "perfil");
    setShowCalendar(aba === "calendario");
    setShowTreinos(aba === "treinos");
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
          } p-4 flex flex-col justify-between`}
      >
        <div>
          <div className="flex flex-col items-center mt-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-red-900">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-red-900" />
              )}
            </div>
            {sidebarOpen && (
              <>
                <p className="mt-2 font-bold">{user.name || "Usuário"}</p>
                <p className="text-sm">Nível {user.level || 1}</p>
              </>
            )}
          </div>

          <nav className="mt-10 space-y-4">
            <button onClick={() => abrirAba("perfil")} className="w-full text-left hover:text-red-300">
              Perfil
            </button>

            <button onClick={() => abrirAba("calendario")} className="w-full text-left hover:text-red-300">
              Minhas aulas
            </button>

            <button onClick={() => abrirAba("treinos")} className="w-full text-left hover:text-red-300">
              Meus treinos
            </button>
          </nav>
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mt-4 text-center border-t border-gray-600 pt-4 hover:text-red-300">
          {sidebarOpen ? "<<" : ">>"}
        </button>
      </div>

      {/* Conteúdo principal: única área com overflow-auto */}
      <div className="flex-1 relative bg-cover bg-center overflow-auto" style={{ backgroundColor: "#7D7878" }}>
        {/* Perfil */}
        {showPerfil && <Perfil userProp={user} />}

        {/* Calendário (Minhas aulas) */}
        {showCalendar && (
          <>
            <div className="absolute top-10 left-10 text-white text-2xl font-semibold">Calendário</div>
            <div className="absolute top-20 left-10 bg-white rounded-lg shadow-lg p-6">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} />
              </LocalizationProvider>
            </div>
          </>
        )}

        {/* Aba de Meus Treinos */}
        {showTreinos && (
          <div className="w-full min-h-full flex flex-col items-center pt-16 pb-8">
            <h2 className="text-white text-3xl font-bold mb-8 text-center">Meus Treinos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-8">
              {treinos.length === 0 ? (
                <p className="text-white text-center col-span-2">Nenhum treino disponível para o seu perfil.</p>
              ) : (
                treinos.map((treino) => (
                  <div key={treino.id} className="bg-gray-900 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform">
                    <img src={treino.imagem} alt={treino.nome} className="w-40 h-40 object-contain mb-4" />
                    <h2 className="text-xl font-semibold mb-2">{treino.nome}</h2>
                    <p className="text-center text-sm text-gray-300">{treino.descricao}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
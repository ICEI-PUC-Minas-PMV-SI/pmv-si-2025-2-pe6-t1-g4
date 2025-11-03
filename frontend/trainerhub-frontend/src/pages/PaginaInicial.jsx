import React, { useState, useEffect } from "react";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function Perfil({ userProp }) {
  const storedUser = userProp || JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    name: "",
    cpf: "",
    peso: "",
    altura: "",
    genero: "",
    telefone: "",
  });

  const [savedMsg, setSavedMsg] = useState("");
  const [salvando, setSalvando] = useState(false);

  // 🔹 Carrega os dados do localStorage corretamente mapeando os campos do backend
  useEffect(() => {
    const user = userProp || JSON.parse(localStorage.getItem("user")) || {};
    setForm({
      name: user.name || user.full_name || "",
      cpf: user.cpf || "",
      peso: user.peso || user.peso_kg || "",
      altura: user.altura || user.altura_cm || "",
      genero: user.genero || user.gender || "",
      telefone: user.telefone || user.phone || "",
    });
  }, [userProp]);

  // 🔹 Atualiza localStorage conforme o usuário altera os campos
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedUser = {
      ...currentUser,
      name: form.name,
      full_name: form.name,
      cpf: form.cpf,
      phone: form.telefone,
      peso: form.peso,
      peso_kg: form.peso,
      altura: form.altura,
      altura_cm: form.altura,
      genero: form.genero,
      gender: form.genero,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  /** 🔸 Envia dados atualizados para o backend Symfony */
  async function handleSave(e) {
    e.preventDefault();
    setSalvando(true);
    setSavedMsg("");

    const user = JSON.parse(localStorage.getItem("user")) || {};

    try {
      const response = await fetch(`/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: form.name,
          cpf: form.cpf,
          phone: form.telefone,
          peso_kg: form.peso,
          altura_cm: form.altura,
          genero: form.genero,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar perfil.");

      const updated = await response.json();
      const updatedUser = { ...user, ...updated };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSavedMsg("✅ Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      setSavedMsg("❌ Erro ao salvar perfil.");
    } finally {
      setSalvando(false);
      setTimeout(() => setSavedMsg(""), 3000);
    }
  }

  return (
    <div className="w-full flex justify-center items-start pt-16 pb-12 px-8 bg-transparent">
      <div className="w-full max-w-5xl">
        <h1 className="text-5xl font-bold text-white mb-10">Perfil</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-12 gap-6 items-center">
            {[ 
              ["Nome Completo", "name", "Digite seu nome"],
              ["CPF", "cpf", "000.000.000-00"],
              ["Peso", "peso", "Ex: 72 kg"],
              ["Altura", "altura", "Ex: 1.78 m"],
              ["Telefone", "telefone", "(00) 99999-9999"],
            ].map(([label, name, placeholder, type = "text"]) => (
              <React.Fragment key={name}>
                <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">{label}</label>
                <div className="col-span-12 md:col-span-8">
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    type={type}
                    className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </React.Fragment>
            ))}

            {/* Gênero */}
            <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">Gênero</label>
            <div className="col-span-12 md:col-span-8">
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white focus:outline-none"
              >
                <option value="">Selecionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Indefinido">Indefinido</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              type="submit"
              disabled={salvando}
              className={`px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-sm ${
                salvando ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>

            {savedMsg && <span className="text-green-300 ml-2">{savedMsg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

/** 🔹 Página principal */
export default function PaginaInicial() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTreinos, setShowTreinos] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [treinos, setTreinos] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // 🔸 Função para logout
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  function abrirAba(aba) {
    setShowPerfil(aba === "perfil");
    setShowCalendar(aba === "calendario");
    setShowTreinos(aba === "treinos");
  }

  useEffect(() => {
    if (showTreinos) {
      async function carregarTreinos() {
        try {
          const response = await fetch(`/training/professor_id/${user.id}`);
          if (!response.ok) throw new Error("Erro ao buscar treinos");
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
  }, [showTreinos, user.id]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
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

        {/* Botão de sair */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
        >
          Sair
        </button>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mt-4 text-center border-t border-gray-600 pt-4 hover:text-red-300"
        >
          {sidebarOpen ? "<<" : ">>"}
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 relative bg-cover bg-center overflow-auto" style={{ backgroundColor: "#7D7878" }}>
        {showPerfil && <Perfil userProp={user} />}

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

        {showTreinos && (
          <div className="w-full min-h-full flex flex-col items-center pt-16 pb-8">
            <h2 className="text-white text-3xl font-bold mb-8 text-center">Meus Treinos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-8">
              {treinos.length === 0 ? (
                <p className="text-white text-center col-span-2">Nenhum treino disponível.</p>
              ) : (
                treinos.map((treino) => (
                  <div
                    key={treino.id}
                    className="bg-gray-900 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform"
                  >
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

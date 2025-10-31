import React, { useState, useEffect } from "react";

/** Componente Perfil */
function Perfil({ userProp }) {
  const storedUser = userProp || JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || storedUser.emall || "",
    cpf: storedUser.cpf || "",
    telefone: storedUser.telefone || storedUser.phone || "",
    genero: storedUser.genero || storedUser.gender || "",
  });

  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (userProp) {
      setForm({
        name: userProp.name || "",
        email: userProp.email || userProp.emall || "",
        cpf: userProp.cpf || "",
        telefone: userProp.telefone || userProp.phone || "",
        genero: userProp.genero || userProp.gender || "",
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
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
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

            <label className="col-span-12 md:col-span-4 text-xl text-white font-medium">Gênero</label>
            <div className="col-span-12 md:col-span-8">
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className="w-full rounded-2xl px-5 py-4 bg-gray-900/60 border border-gray-700 text-white focus:outline-none appearance-none"
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
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-sm"
            >
              Salvar
            </button>

            <button
              type="button"
              onClick={() => setForm({
                name: storedUser.name || "",
                email: storedUser.email || storedUser.emall || "",
                cpf: storedUser.cpf || "",
                telefone: storedUser.telefone || storedUser.phone || "",
                genero: storedUser.genero || storedUser.gender || "",
              })}
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

/** PaginaInicial Professor */
export default function PaginaInicial() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPerfil, setShowPerfil] = useState(true);
  const [showAlunos, setShowAlunos] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const response = await fetch(`http://localhost:8000/professor/${user.id}/students`);
        const data = await response.json();
        setAlunos(data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      } finally {
        setCarregando(false);
      }
    }

    if (showAlunos) carregarAlunos();
  }, [showAlunos, user.id]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} p-4 flex flex-col justify-between`}
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
            <button onClick={() => { setShowPerfil(true); setShowAlunos(false); }} className="w-full text-left hover:text-red-300">
              Perfil
            </button>
            <button onClick={() => { setShowAlunos(true); setShowPerfil(false); }} className="w-full text-left hover:text-red-300">
              Alunos
            </button>
          </nav>
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mt-4 text-center border-t border-gray-600 pt-4 hover:text-red-300">
          {sidebarOpen ? "<<" : ">>"}
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 relative bg-cover bg-center overflow-auto" style={{ backgroundColor: "#7D7878" }}>
        {showPerfil && <Perfil userProp={user} />}

        {showAlunos && (
          <div className="w-full flex flex-col items-center pt-16 pb-12 px-8">
            <h1 className="text-5xl font-bold text-white mb-10">Alunos</h1>
            {carregando ? (
              <p className="text-white">Carregando alunos...</p>
            ) : alunos.length === 0 ? (
              <p className="text-gray-300 text-center">Nenhum aluno vinculado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                {alunos.map((aluno) => (
                  <div key={aluno.id} className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">{aluno.name}</h3>
                    <p><strong>Email:</strong> {aluno.email}</p>
                    <p><strong>CPF:</strong> {aluno.cpf}</p>
                    <p><strong>Telefone:</strong> {aluno.telefone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

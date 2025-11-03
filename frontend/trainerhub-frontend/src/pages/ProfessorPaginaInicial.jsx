import React, { useState, useEffect } from "react";

/** Componente Perfil */
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

/** Componente AddSerieForm */
function AddSerieForm({ modalFicha, setModalFicha, professorId }) {
  const [exercises, setExercises] = useState([]);
  const [newSerie, setNewSerie] = useState({
    exercise_id: "",
    ordem: 1,
    series: 3,
    repeticoes: 12,
    carga: 30,
    descanso_segundos: 60,
  });

  useEffect(() => {
    async function carregarExercicios() {
      try {
        const res = await fetch("/exercises");
        const data = await res.json();
        setExercises(data);
      } catch (err) {
        console.error("Erro ao carregar exercícios:", err);
      }
    }
    carregarExercicios();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setNewSerie((prev) => ({ ...prev, [name]: value }));
  }

  async function adicionarSerie() {
    if (!newSerie.exercise_id) {
      alert("Selecione um exercício");
      return;
    }

    try {
      const response = await fetch("/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aluno_id: modalFicha.aluno_id,
          professor_id: professorId,
          workout_id: modalFicha.workout_id,
          status: modalFicha.status || "1",
          created_at: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Erro ao criar treinamento");

      const resFind = await fetch(`/training/professor_id/${professorId}`);
      const allTrainings = await resFind.json();
      const ultimo = allTrainings[allTrainings.length - 1];

      await fetch("/sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet_id: ultimo.id,
          exercise_id: newSerie.exercise_id,
          ordem: Number(newSerie.ordem),
          series: Number(newSerie.series),
          repeticoes: Number(newSerie.repeticoes),
          carga: Number(newSerie.carga),
          descanso_segundos: Number(newSerie.descanso_segundos),
        }),
      });

      const exercicioSelecionado = exercises.find((ex) => ex.id === newSerie.exercise_id);
      setModalFicha((prev) => ({
        ...prev,
        series: [
          ...prev.series,
          {
            id: crypto.randomUUID(),
            sheet_id: ultimo.id,
            exercise_id: newSerie.exercise_id,
            ordem: Number(newSerie.ordem),
            series: Number(newSerie.series),
            repeticoes: Number(newSerie.repeticoes),
            carga: Number(newSerie.carga),
            descanso_segundos: Number(newSerie.descanso_segundos),
            exercicio: exercicioSelecionado,
          },
        ],
      }));

      setNewSerie({
        exercise_id: "",
        ordem: 1,
        series: 3,
        repeticoes: 12,
        carga: 30,
        descanso_segundos: 60,
      });
    } catch (err) {
      console.error("Erro ao adicionar série:", err);
      alert("Falha ao adicionar série.");
    }
  }

  async function deletarSerie(serieId) {
    try {
      await fetch(`/sheet/${serieId}`, { method: "DELETE" });
      setModalFicha((prev) => ({
        ...prev,
        series: prev.series.filter((s) => s.id !== serieId),
      }));
    } catch (err) {
      console.error("Erro ao deletar série:", err);
      alert("Falha ao deletar série.");
    }
  }

  return (
    <div className="mb-4">
      <div className="grid grid-cols-12 gap-4 items-end">
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1">Exercício</label>
          <select
            name="exercise_id"
            value={newSerie.exercise_id}
            onChange={handleChange}
            className="w-full rounded-xl px-3 py-2 bg-gray-900 border border-gray-700 text-white"
          >
            <option value="">Selecionar</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.muscle_group})
              </option>
            ))}
          </select>
        </div>

        {["ordem", "series", "repeticoes", "carga", "descanso_segundos"].map((field) => (
          <div key={field} className="col-span-6 md:col-span-2">
            <label className="block mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="number"
              name={field}
              value={newSerie[field]}
              onChange={handleChange}
              className="w-full rounded-xl px-3 py-2 bg-gray-900 border border-gray-700 text-white"
            />
          </div>
        ))}

        <div className="col-span-12 mt-2 flex gap-2">
          <button onClick={adicionarSerie} type="button" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">
            Adicionar Série
          </button>
        </div>
      </div>

      <ul className="mt-4 list-disc list-inside">
        {modalFicha.series?.map((s) => (
          <li key={s.id} className="flex justify-between items-center">
            {s.exercicio?.name} — {s.series}x{s.repeticoes} — {s.carga}kg
            <button onClick={() => deletarSerie(s.id)} className="ml-2 text-red-500 hover:underline">
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Componente AddExerciseModal */
function AddExerciseModal({ isOpen, setIsOpen, atualizarLista }) {
  const [exercise, setExercise] = useState({ name: "", muscle_group: "" });

  async function salvarExercicio() {
    if (!exercise.name || !exercise.muscle_group) return alert("Preencha todos os campos");

    try {
      const res = await fetch("/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar exercício");

      setExercise({ name: "", muscle_group: "" });
      setIsOpen(false);
      if (atualizarLista) atualizarLista();
    } catch (err) {
      console.error(err);
      alert("Falha ao cadastrar exercício");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Cadastrar Exercício</h2>
        <input
          placeholder="Nome do exercício"
          value={exercise.name}
          onChange={(e) => setExercise((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full mb-3 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          placeholder="Grupo muscular"
          value={exercise.muscle_group}
          onChange={(e) => setExercise((prev) => ({ ...prev, muscle_group: e.target.value }))}
          className="w-full mb-3 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700"
        />
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-700">Cancelar</button>
          <button onClick={salvarExercicio} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">Salvar</button>
        </div>
      </div>
    </div>
  );
}

/** Componente AddWorkoutModal */
function AddWorkoutModal({ isOpen, setIsOpen, professorId, atualizarLista }) {
  const [workout, setWorkout] = useState({ name: "", level: "" });
  const [modalFicha, setModalFicha] = useState({ series: [], aluno_id: "" });

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    async function carregarExercicios() {
      try {
        const res = await fetch("/exercises");
        const data = await res.json();
        setExercises(data);
      } catch (err) {
        console.error("Erro ao carregar exercícios:", err);
      }
    }
    carregarExercicios();
  }, []);

  async function salvarWorkout() {
    if (!workout.name || !workout.level) return alert("Preencha todos os campos do workout");

    try {
      const response = await fetch("/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout),
      });
      if (!response.ok) throw new Error("Erro ao cadastrar workout");

      const createdWorkout = await response.json();

      // Vincula series
      for (const serie of modalFicha.series) {
        await fetch("/sheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheet_id: createdWorkout.id,
            exercise_id: serie.exercise_id,
            ordem: Number(serie.ordem),
            series: Number(serie.series),
            repeticoes: Number(serie.repeticoes),
            carga: Number(serie.carga),
            descanso_segundos: Number(serie.descanso_segundos),
          }),
        });
      }

      setWorkout({ name: "", level: "" });
      setModalFicha({ series: [], aluno_id: "" });
      setIsOpen(false);
      if (atualizarLista) atualizarLista();
    } catch (err) {
      console.error(err);
      alert("Falha ao cadastrar workout");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white rounded-2xl p-8 w-full max-w-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Cadastrar Workout</h2>
        <input
          placeholder="Nome do Workout"
          value={workout.name}
          onChange={(e) => setWorkout((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full mb-3 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          placeholder="Nível"
          value={workout.level}
          onChange={(e) => setWorkout((prev) => ({ ...prev, level: e.target.value }))}
          className="w-full mb-3 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700"
        />

        <label className="block mt-3 mb-1">Aluno</label>
        <select
          value={modalFicha.aluno_id}
          onChange={(e) => setModalFicha((prev) => ({ ...prev, aluno_id: e.target.value }))}
          className="w-full rounded-xl px-3 py-2 bg-gray-900 border border-gray-700 text-white mb-4"
        >
          <option value="">Selecionar aluno</option>
          {/* Carregar alunos como no modal original */}
        </select>

        <AddSerieForm modalFicha={modalFicha} setModalFicha={setModalFicha} professorId={professorId} />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-700">Cancelar</button>
          <button onClick={salvarWorkout} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">Salvar</button>
        </div>
      </div>
    </div>
  );
}

/** PaginaInicial Professor */
export default function PaginaInicial() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPerfil, setShowPerfil] = useState(true);
  const [showAlunos, setShowAlunos] = useState(false);
  const [showFichas, setShowFichas] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalFicha, setModalFicha] = useState(null);
  const [alunosSelect, setAlunosSelect] = useState([]);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const response = await fetch(`/professor/${user.id}/students`);
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

  useEffect(() => {
    if (showFichas) carregarFichas();
  }, [showFichas, user.id]);

  async function carregarFichas() {
    setCarregando(true);
    try {
      const response = await fetch(`/training/professor_id/${user.id}`);
      const data = await response.json();

      const agrupadoPorWorkout = Object.values(
        data.reduce((acc, ficha) => {
          if (!acc[ficha.workout_id]) acc[ficha.workout_id] = { ...ficha, series: [...ficha.series] };
          else acc[ficha.workout_id].series.push(...ficha.series);
          return acc;
        }, {})
      );

      const fichasComWorkout = await Promise.all(
        agrupadoPorWorkout.map(async (ficha) => {
          try {
            const res = await fetch(`/workouts/${ficha.workout_id}`);
            const workout = await res.json();
            return { ...ficha, workout_name: workout[0].name, workout_level: workout[0].level };
          } catch {
            return { ...ficha, workout_name: "Desconhecido", workout_level: null };
          }
        })
      );

      setFichas(fichasComWorkout);
    } catch (err) {
      console.error("Erro ao carregar fichas:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function abrirModalFicha(ficha) {
    setModalFicha(ficha);
    try {
      const res = await fetch("/users");
      const users = await res.json();
      setAlunosSelect(users);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
    }
  }

  function fecharModal() {
    carregarFichas();
    setModalFicha(null);
  }

  async function salvarFicha() {
    if (!modalFicha?.aluno_id) {
      alert("Selecione um aluno antes de salvar.");
      return;
    }

    try {
      for (const serie of modalFicha.series) {
        const response = await fetch(`/training/${serie.sheet_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aluno_id: modalFicha.aluno_id }),
        });
        if (!response.ok) throw new Error(`Erro ao salvar série ${serie.sheet_id}`);
      }
      alert("Aluno vinculado a todas as séries do workout com sucesso!");
      fecharModal();
    } catch (err) {
      console.error("Erro ao salvar séries:", err);
      alert("Falha ao vincular aluno a algumas séries.");
    }
  }

  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} p-4 flex flex-col justify-between`}>
        <div>
          <div className="flex flex-col items-center mt-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-red-900">
              {user.avatar_url ? <img src={user.avatar_url} alt="Foto" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-red-900" />}
            </div>
            {sidebarOpen && (
              <>
                <p className="mt-2 font-bold">{user.full_name || "Usuário"}</p>
                <p className="text-sm">Nível {user.level || 1}</p>
              </>
            )}
          </div>

          <nav className="mt-10 space-y-4">
            <button onClick={() => { setShowPerfil(true); setShowAlunos(false); setShowFichas(false); }} className="w-full text-left hover:text-red-300">Perfil</button>
            <button onClick={() => { setShowAlunos(true); setShowPerfil(false); setShowFichas(false); }} className="w-full text-left hover:text-red-300">Alunos</button>
            <button onClick={() => { setShowFichas(true); setShowAlunos(false); setShowPerfil(false); }} className="w-full text-left hover:text-red-300">Fichas</button>
            <button onClick={() => setExerciseModalOpen(true)} className="w-full text-left hover:text-blue-300">Cadastrar Exercício</button>
            {/* <button onClick={() => setAddWorkoutModalOpen(true)} className="w-full text-left hover:text-green-300">Adicionar Workout</button> */}
            <button onClick={logout} className="w-full text-left hover:text-red-500">Sair</button>
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
            {carregando ? <p className="text-white">Carregando alunos...</p> :
              alunos.length === 0 ? <p className="text-gray-300 text-center">Nenhum aluno vinculado.</p> :
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
            }
          </div>
        )}

        {showFichas && (
          <div className="w-full flex flex-col items-center pt-16 pb-12 px-8">
            <h1 className="text-5xl font-bold text-white mb-10">Workouts</h1>
            {carregando ? (
              <p className="text-white">Carregando workouts...</p>
            ) : fichas.length === 0 ? (
              <p className="text-gray-300 text-center">Nenhum workout encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                {fichas.map((ficha) => (
                  <div key={ficha.workout_id} className="bg-gray-900 rounded-2xl p-6 shadow-lg text-white">
                    <h3 className="text-xl font-semibold mb-2">Workout {ficha.workout_name}</h3>
                    <p><strong>Status:</strong> {ficha.status}</p>
                    <p className="mt-1 font-semibold">Dificuldade: {ficha.workout_level}</p>
                    <p className="mt-4 font-semibold">Séries:</p>
                    <ul className="list-disc list-inside">
                      {ficha.series?.map((serie) => (
                        <li key={serie.id}>
                          {serie.exercicio?.name} — {serie.series}x{serie.repeticoes} — {serie.carga}kg
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => abrirModalFicha(ficha)}
                      className="mt-4 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500"
                    >
                      Alterar aluno / Adicionar série
                    </button>
                  </div>
                ))}
                <div className="bg-gray-900 rounded-2xl p-6 shadow-lg text-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800" onClick={() => setAddWorkoutModalOpen(true)} >
                  {/* Ícone de + */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="text-xl font-semibold">Adicionar</h3>
                </div>
              </div>
            )}
          </div>
        )}

        {modalFicha && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 text-white rounded-2xl p-8 w-full max-w-3xl shadow-lg relative">
              <h2 className="text-3xl font-bold mb-6">Detalhes do Workout</h2>
              <p><strong>ID:</strong> {modalFicha.workout_id}</p>
              <p><strong>Status:</strong> {modalFicha.status}</p>

              <label className="block mt-4 mb-1">Aluno</label>
              <select
                value={modalFicha.aluno_id || ""}
                onChange={(e) => setModalFicha((prev) => ({ ...prev, aluno_id: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 bg-gray-900 border border-gray-700 text-white mb-4"
              >
                <option value="">Selecionar aluno</option>
                {alunosSelect.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.full_name}
                  </option>
                ))}
              </select>

              <AddSerieForm modalFicha={modalFicha} setModalFicha={setModalFicha} professorId={user.id} />

              <div className="flex justify-end gap-4 mt-6">
                <button onClick={fecharModal} className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-700">Fechar</button>
                <button onClick={salvarFicha} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">Salvar</button>
              </div>
            </div>
          </div>
        )}

        {exerciseModalOpen && <AddExerciseModal isOpen={exerciseModalOpen} setIsOpen={setExerciseModalOpen} atualizarLista={carregarFichas} />}

        {/* Modal Add Workout */}
        {addWorkoutModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 text-white rounded-2xl p-8 w-full max-w-md shadow-lg relative" style={{maxWidth:"44rem"}}>
              <h2 className="text-2xl font-bold mb-4">Adicionar Workout</h2>
              <input
                placeholder="Nome do Workout"
                className="w-full mb-3 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700"
              />
              <input
                placeholder="Level do Workout"
                className="w-full mb-3 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700"
              />
              <AddSerieForm modalFicha={{ series: [] }} setModalFicha={() => {}} professorId={user.id} />
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setAddWorkoutModalOpen(false)} className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-700">Cancelar</button>
                <button className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function PaginaInicial() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showTreinos, setShowTreinos] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [treinos, setTreinos] = useState([]);

    const user = JSON.parse(localStorage.getItem("user")) || {};

    // Buscar treinos do backend quando o usuário clicar
    useEffect(() => {
        if (showTreinos) {
            async function carregarTreinos() {
                try {
                    const user = JSON.parse(localStorage.getItem("user"));
                    const response = await fetch(`http://localhost:8000/training/studentSheets/${user.id}`);
                    const data = await response.json();

                    // 🔹 Converter o formato do backend em um array de exercícios simples
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


    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <div
                className={`bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
                    } p-4 flex flex-col justify-between`}
            >
                <div>
                    {/* Foto e Nome */}
                    <div className="flex flex-col items-center mt-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-red-900">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="Foto"
                                    className="w-full h-full object-cover"
                                />
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

                    {/* Menu */}
                    <nav className="mt-10 space-y-4">
                        <button className="w-full text-left hover:text-red-300">
                            Perfil
                        </button>

                        <button
                            onClick={() => {
                                setShowCalendar(!showCalendar);
                                setShowTreinos(false);
                            }}
                            className="w-full text-left hover:text-red-300"
                        >
                            Minhas aulas
                        </button>

                        <button
                            onClick={() => {
                                setShowTreinos(!showTreinos);
                                setShowCalendar(false);
                            }}
                            className="w-full text-left hover:text-red-300"
                        >
                            Meus treinos
                        </button>
                    </nav>
                </div>

                {/* Botão de abrir/fechar */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="mt-4 text-center border-t border-gray-600 pt-4 hover:text-red-300"
                >
                    {sidebarOpen ? "<<" : ">>"}
                </button>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 relative bg-cover bg-center" style={{ backgroundColor: "#7D7878" }}>
                {showCalendar && (<> <div className="absolute top-10 left-10 text-white text-2xl font-semibold">
                    Calendário
                </div>
                    <div className="absolute top-20 left-10 bg-white rounded-lg shadow-lg p-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} />
                        </LocalizationProvider>
                    </div>
                </>
                )}

                {/* Aba de Meus Treinos */}
                {showTreinos && (
                    <div className="w-full min-h-screen flex flex-col items-center pt-16">
                        <h2 className="text-white text-3xl font-bold mb-8 text-center">
                            Meus Treinos
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {treinos.length === 0 ? (
                                <p className="text-white text-center col-span-2">
                                    Nenhum treino disponível para o seu perfil.
                                </p>
                            ) : (
                                treinos.map((treino) => (
                                    <div
                                        key={treino.id}
                                        className="bg-gray-900 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform"
                                    >
                                        <img
                                            src={treino.imagem}
                                            alt={treino.nome}
                                            className="w-40 h-40 object-contain mb-4"
                                        />
                                        <h2 className="text-xl font-semibold mb-2">{treino.nome}</h2>
                                        <p className="text-center text-sm text-gray-300">
                                            {treino.descricao}
                                        </p>
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

import { useState } from "react";
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function PaginaInicial() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());

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

                    {/* Menu */}
                    <nav className="mt-10 space-y-4">
                        <button className="w-full text-left hover:text-red-300">
                            Perfil
                        </button>

                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="w-full text-left hover:text-red-300"
                        >
                            Minhas aulas
                        </button>

                        <button className="w-full text-left hover:text-red-300">
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

            {/* Conteúdo */}
            <div className="flex-1 relative bg-cover bg-center" style={{ backgroundColor: "#7D7878" }}>
                {showCalendar && (
                    <>
                        <div className="absolute top-10 left-10 text-white text-2xl font-semibold">
                            Calendário
                        </div>

                        <div className="absolute top-20 left-10 bg-white rounded-lg shadow-lg p-6">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={selectedDate}
                                    onChange={(newDate) => setSelectedDate(newDate)}
                                />
                            </LocalizationProvider>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

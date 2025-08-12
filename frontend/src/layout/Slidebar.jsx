import { Link, useLocation } from 'react-router';
import storeProfile from '../context/storeProfile';
import { FaChalkboardTeacher, FaCalendarAlt, FaList, FaUserFriends, FaRegClock, FaPlusCircle } from 'react-icons/fa';

const Slidebar = ({ setSidebarVisible }) => {
    const location = useLocation();
    const { user } = storeProfile();
    const rol = user?.rol;
    
    const nombreUsuario = user?.nombre || "";

    const menuItems = {
        'Administrador': [
            { to: '/dashboard/crear', text: 'Agregar Docentes', icon: <FaPlusCircle /> },
            { to: '/dashboard/listar', text: 'Ver Docentes', icon: <FaList /> },
            { to: '/dashboard/chat', text: 'Chat', icon: <FaUserFriends /> }
        ],
        'Docente': [
            { to: '/dashboard/agendar-disponibilidad', text: 'Agendar Disponibilidad', icon: <FaRegClock /> },
            { to: '/dashboard/ver-disponibilidad-docente/:docenteId', text: 'Ver Disponibilidad', icon: <FaCalendarAlt /> },
            { to: '/dashboard/tutorias-semana', text: 'Tutorías Programadas', icon: <FaChalkboardTeacher /> },
            { to: '/dashboard/chat', text: 'Chat', icon: <FaUserFriends /> }
        ],
        'Estudiante': [
            { to: '/dashboard/agendar-tutorias', text: 'Agendar Tutoría', icon: <FaRegClock /> },
            { to: '/dashboard/ver-tutorias', text: 'Mis Tutorías', icon: <FaList /> },
            { to: '/dashboard/chat', text: 'Chat', icon: <FaUserFriends /> }
        ],
    };

    const currentMenuItems = menuItems[rol] || [];

    return (
        <div className={`fixed top-0 left-0 w-72 h-full bg-gray-800 px-5 py-4 shadow-xl z-50 transform transition-transform duration-300 ease-in-out`}>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-slate-200">Tutorías ESFOT</h2>
                {/* <button 
                    onClick={() => setSidebarVisible(false)} 
                    className="text-white text-xl p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                    <FaTimes />
                </button> */}
            </div>
            <div className="flex flex-col items-center">
                <p className="text-slate-400 text-center text-sm mb-1">
                    <span className="bg-green-500 w-3 h-3 inline-block rounded-full mr-2 animate-pulse"></span>
                    {nombreUsuario}
                </p>
                <p className="text-slate-500 text-center text-sm mb-4">Rol: {rol}</p>
            </div>
            
            <hr className="mt-5 border-slate-700" />

            <ul className="mt-5 space-y-2">
                {currentMenuItems.map(({ to, text, icon }) => (
                    <li key={to}>
                        <Link
                            to={to}
                            onClick={() => setSidebarVisible(false)}
                            className={`
                                flex items-center p-3 rounded-lg text-lg font-medium transition-colors duration-200
                                ${location.pathname === to 
                                    ? 'bg-red-800 text-white shadow-inner' 
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }
                            `}
                        >
                            <span className="mr-3 text-xl">{icon}</span>
                            {text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Slidebar;

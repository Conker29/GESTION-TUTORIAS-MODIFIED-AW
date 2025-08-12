import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router'; 
import storeAuth from '../context/storeAuth';
import storeProfile from '../context/storeProfile';
import Slidebar from './Slidebar';
import { FaCog, FaSignOutAlt, FaUser, FaHome, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { MdOutlineClose, MdMenu } from 'react-icons/md';

const Dashboard = () => {
    const location = useLocation();
    const { clearToken } = storeAuth();
    const { user } = storeProfile();
    
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuRef]);

    const fotoPerfil = user?.fotoPerfil || user?.avatarDocente || user?.fotoPerfilAdmin;
    const nombreUsuario = user?.nombreAdministrador || user?.nombreDocente || user?.nombreEstudiante;
    const defaultPhotoUrl = "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

    return (
        <div className="relative min-h-screen bg-gray-100 overflow-x-hidden">

            {/* Overlay para cerrar el menú al hacer clic fuera */}
            {sidebarVisible && (
                <div 
                    onClick={() => setSidebarVisible(false)} 
                    className="fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-300"
                ></div>
            )}

            {/* Sidebar con animación de deslizamiento */}
            <div className={`fixed top-0 left-0 w-72 h-full z-50 transform transition-transform duration-300 ease-in-out ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
                <Slidebar setSidebarVisible={setSidebarVisible} />
            </div>

            {/* Contenedor del contenido principal que se desliza */}
            <div 
                className={`transition-transform duration-300 ease-in-out ${sidebarVisible ? 'transform translate-x-72' : ''}`}
            >
                {/* Barra superior */}
                <div className="bg-gray-900 py-2 px-4 flex justify-between items-center z-50 relative">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarVisible(!sidebarVisible)}
                            className="text-white text-2xl focus:outline-none"
                            title={sidebarVisible ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            {sidebarVisible ? <MdOutlineClose /> : <MdMenu />}
                        </button>
                        
                        {/* ENLACE DE NAVEGACIÓN A DASHBOARD HOME */}
                        {location.pathname !== '/dashboard' && (
                            <Link 
                                to="/dashboard" 
                                className="flex items-center text-white text-md font-semibold hover:text-gray-400 transition-colors"
                            >
                                <FaHome className="mr-2 text-2xl" />
                                <span className="hidden md:block">Inicio</span>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4 relative" ref={userMenuRef}>
                        <button
                            onClick={() => setUserMenuVisible(!userMenuVisible)}
                            className="flex items-center gap-2 focus:outline-none"
                        >
                            <img
                                src={fotoPerfil || defaultPhotoUrl}
                                alt="img-profile"
                                className="border-2 border-green-600 rounded-full object-cover w-12 h-12"
                            />
                            <span className="text-md font-semibold text-slate-100 hidden md:block">
                                {nombreUsuario}
                            </span>
                            {/* Cejita o ícono de caret */}
                            {userMenuVisible ? (
                                <FaCaretUp className="text-slate-100" />
                            ) : (
                                <FaCaretDown className="text-slate-100" />
                            )}
                        </button>

                        {/* Menú desplegable */}
                        {userMenuVisible && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <ul className="py-2">
                                    <li>
                                        <Link to="/dashboard/perfil" onClick={() => setUserMenuVisible(false)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            <FaUser className="mr-2" />
                                            Perfil
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/configuracion" onClick={() => setUserMenuVisible(false)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            <FaCog className="mr-2" />
                                            Configuración
                                        </Link>
                                    </li>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <li>
                                        <button
                                            onClick={clearToken}
                                            className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-100"
                                        >
                                            <FaSignOutAlt className="mr-2" />
                                            Cerrar sesión
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contenido principal */}
                <div className={`p-8 overflow-y-auto h-[calc(100vh-96px)]`}>
                    <Outlet />
                </div>

                {/* Footer */}
                <div className="bg-gray-800 h-12">
                    <p className="text-center text-slate-100 leading-[2.9rem] underline">
                        ESFOT 2025 - Todos los derechos reservados
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
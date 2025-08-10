import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import storeAuth from '../context/storeAuth'
import storeProfile from '../context/storeProfile'
import Slidebar from './Slidebar'

const Dashboard = () => {
  const location = useLocation()
  const urlActual = location.pathname
  const { clearToken } = storeAuth()
  const { user } = storeProfile()

  const [menuVisible, setMenuVisible] = useState(false)

  return (
    <div className="relative min-h-screen bg-gray-100">

      {menuVisible && <Slidebar setMenuVisible={setMenuVisible} />}

      {/* Barra superior */}
      <div className="bg-gray-900 py-2 px-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMenuVisible(!menuVisible)}
          className="text-white text-2xl"
          title={menuVisible ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuVisible ? '✖' : '☰'}
        </button>
      </div>

    <div className="flex items-center gap-4">
      <span className="text-md font-semibold text-slate-100">
        Usuario - {user?.nombreAdministrador || user?.nombreDocente || user?.nombreEstudiante}
      </span>
      <img
        src={
          user?.fotoPerfil || 
          "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
        }
        alt="img-client"
        className="border-2 border-green-600 rounded-full object-cover"
        width={50}
        height={50}
      />
      <button
        className="text-white text-md hover:bg-red-900 bg-red-800 px-4 py-1 rounded-lg"
        onClick={clearToken}
      >
        Cerrar sesión
      </button>
    </div>
  </div>

      {/* Contenido principal */}
      <div
        className={`p-8 overflow-y-auto h-[calc(100vh-96px)] transition-all duration-300 ${
            menuVisible ? 'ml-4' : ''
        }`}
        >
        <Outlet />
        </div>
      {/* Footer */}
      <div className="bg-gray-800 h-12">
        <p className="text-center text-slate-100 leading-[2.9rem] underline">
          ESFOT 2025 - Todos los derechos reservados
        </p>
      </div>
    </div>
  )
}

export default Dashboard


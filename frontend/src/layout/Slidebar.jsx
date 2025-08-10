import { Link, useLocation } from 'react-router'
import storeProfile from '../context/storeProfile'

const Slidebar = ({ setMenuVisible }) => {
  const location = useLocation()
  const urlActual = location.pathname
  const { user } = storeProfile()
  const nombreUsuario = user?.nombreAdministrador || user?.nombreDocente || user?.nombreEstudiante;

  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 px-5 py-4 shadow-lg z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-200">Tutorías ESFOT</h2>
        <button onClick={() => setMenuVisible(false)} className="text-white text-xl">✖</button>
      </div>
      <img
        src="https://static.vecteezy.com/system/resources/previews/007/036/608/non_2x/male-working-on-laptop-with-mask-cartoon-icon-illustration-people-technology-icon-concept-isolated-premium-flat-cartoon-style-vector.jpg"
        alt="img-client"
        className="m-auto mt-4 p-1 border-2 border-slate-500 rounded-full"
        width={120}
        height={120}
      />
      <p className="text-slate-400 text-center my-4 text-sm">
        <span className="bg-green-600 w-3 h-3 inline-block rounded-full"></span> Bienvenido - {nombreUsuario}
      </p>
      <p className="text-slate-400 text-center my-4 text-sm">Rol - {user?.rol}</p>
      <hr className="mt-5 border-slate-500" />

      <ul className="mt-5">
        {[
          { to: '/dashboard', text: 'Perfil' },
          { to: '/dashboard/listar', text: 'Listar' },
          { to: '/dashboard/crear', text: 'Crear' },
          { to: '/dashboard/chat', text: 'Chat' },
        ].map(({ to, text }) => (
          <li key={to} className="text-center">
            <Link
              to={to}
              className={`${
                urlActual === to
                  ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center'
                  : 'text-slate-600'
              } text-xl block mt-2 hover:text-slate-600`}
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Slidebar

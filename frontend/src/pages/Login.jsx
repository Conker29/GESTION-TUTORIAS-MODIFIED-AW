import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useFetch from '../hooks/useFetch';
import { ToastContainer } from 'react-toastify';
import estudiantesLogin from '../assets/estudiantesFont.webp';
import storeAuth from '../context/storeAuth';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { fetchDataBackend } = useFetch();
  const { setToken, setRol } = storeAuth();

  const loginUser = async (data) => {
    const url = data.password.includes("ESFOT")
      ? `${import.meta.env.VITE_BACKEND_URL}/docente/login`
      : `${import.meta.env.VITE_BACKEND_URL}/login`
    const response = await fetchDataBackend(url, data, 'POST', null)
    if (response) {
      setToken(response.token);
      setRol(response.rol);
      navigate('/dashboard');
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.86), rgba(0, 0, 0, 0.87)), url(${estudiantesLogin})`
        }}
    >

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center z-20 text-white rounded-full px-4 py-2 shadow-md bg-red-900 hover:bg-red-800 transition-colors duration-200 font-semibold"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Regresar
      </button>

      {/* Contenedor formulario */}
      <div className="relative z-10 bg-white bg-opacity-95 p-10 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <ToastContainer />

        <h1 className="text-3xl font-semibold mb-2 text-center text-amber-900">
          Bienvenido al sistema
        </h1>
        <small className="text-gray-600 block mb-6 text-sm text-center">
          Ingrese sus datos para el inicio de sesión
        </small>

        <form onSubmit={handleSubmit(loginUser)} className="space-y-5">
          {/* Correo electrónico */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Correo electrónico</label>
            <input
              type="email"
              placeholder="Ingrese su correo electrónico..."
              className={`block w-full rounded-md border py-2 px-3 text-gray-700 
                focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700
                ${errors.email ? 'border-red-600' : 'border-gray-300'}`}
              {...register("email", { required: "El correo es obligatorio" })}
            />
            {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingrese su contraseña..."
              className={`block w-full rounded-md border py-2 px-3 pr-10 text-gray-700
                focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700
                ${errors.password ? 'border-red-600' : 'border-gray-300'}`}
              {...register("password", { required: "La contraseña es obligatoria" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 0 9.956 9.956 0 01-1.845 3.35M9.9 14.32a3 3 0 114.2-4.2m.5 3.5l3.8 3.8m-3.8-3.8L5.5 5.5" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.95 0a9.96 9.96 0 0119.9 0m-19.9 0a9.96 9.96 0 0119.9 0M3 3l18 18" />
                </svg>
              )}
            </button>
            {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>}
          </div>

          {/* Botón iniciar sesión */}
          <button
            type="submit"
            className="w-full py-2 bg-red-900 text-white rounded-xl hover:bg-red-800 transition-colors duration-300 transform hover:scale-105"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Separador */}
        <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
          <hr className="border-gray-400" />
          <p className="text-center text-sm">O</p>
          <hr className="border-gray-400" />
        </div>

        {/* Google */}
        <button className="bg-red-50 border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-black hover:text-white">
          <img
            className="w-5 mr-2"
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="Google icon"
          />
          Iniciar sesión con Google
        </button>

        {/* Olvidaste contraseña */}
        <div className="mt-5 text-xs border-b-2 py-4 text-center">
          <Link
            to="/forgot/id"
            className="text-sm text-black hover:text-gray-900"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p className="text-center sm:text-left">
            ¿No tienes una cuenta todavía? Haz clic aquí para registrarte
          </p>
          <Link to="/register" className="py-2 px-5 bg-red-900 text-white rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white transition-transform"
          > Registrarse</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

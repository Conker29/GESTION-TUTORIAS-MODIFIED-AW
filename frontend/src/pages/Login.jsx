import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useFetch from "../hooks/useFetch";
import { ToastContainer } from "react-toastify";
import estudiantesLogin from "../assets/estudiantesFont.webp";
import storeAuth from "../context/storeAuth";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { fetchDataBackend } = useFetch();
  const { setToken, setRol } = storeAuth();

  const loginUser = async (data) => {
    const url = data.password.includes("ESFOT")
      ? `${import.meta.env.VITE_BACKEND_URL}/docente/login`
      : `${import.meta.env.VITE_BACKEND_URL}/login`;
    const response = await fetchDataBackend(url, data, "POST", null);
    if (response) {
      setToken(response.token);
      setRol(response.rol);
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-amber-950 via-red-950 to-black"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${estudiantesLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Botón regresar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center z-20 text-white rounded-full px-4 py-2 shadow-md bg-red-800/80 hover:bg-red-700 transition-all duration-200 font-semibold backdrop-blur-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Regresar
      </button>

      {/* Contenedor formulario */}
      <div className="relative z-10 bg-white/95 p-10 rounded-2xl shadow-xl w-full max-w-md mx-4 backdrop-blur-sm border border-white/40">
        <ToastContainer />

        {/* Título */}
        <h1 className="text-3xl font-bold mb-2 text-center text-red-900 tracking-tight">
          Bienvenido al sistema
        </h1>
        <p className="text-gray-600 mb-6 text-sm text-center">
          Ingrese sus credenciales para continuar
        </p>

        {/* Formulario para el inicio de sesión */}
        <form onSubmit={handleSubmit(loginUser)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Correo institucional *
            </label>
            <input
              type="email"
              placeholder="usuario@epn.edu.ec"
              className={`block w-full rounded-lg border py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-800 transition-all ${
                errors.email ? "border-red-600" : "border-gray-300"
              }`}
              {...register("email", { required: "El correo es obligatorio" })}
            />
            {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
            Contraseña *
            </label>
            <div className="relative">
             <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingrese su contraseña..."
              className={`block w-full rounded-lg border py-2 pr-10 pl-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-800 transition-all ${
                errors.password ? "border-red-600" : "border-gray-300"
              }`}
              {...register("password", { required: "La contraseña es obligatoria" })}
              />
              <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 0 9.956 9.956 0 01-1.845 3.35M9.9 14.32a3 3 0 114.2-4.2"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0m-9.95 0a9.96 9.96 0 0119.9 0"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>}
        </div>

          {/* ¿Olvidaste contraseña? */}
          <div className="text-right text-sm mb-3">
            <Link to="/forgot/id" className="text-gray-700 hover:text-red-900 transition-colors font-medium">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón iniciar sesión */}
          <button
            type="submit"
            className="w-full py-2 bg-red-900 text-white rounded-lg font-medium hover:bg-black transition-transform transform hover:scale-[1.02] shadow-lg"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlaces adicionales */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
          <p className="text-center sm:text-left">
            ¿No tienes una cuenta todavía?
          </p>
          <Link
            to="/register"
            className="py-2 px-6 bg-red-900 text-white rounded-lg hover:scale-105 duration-300 hover:bg-black transition-transform shadow-md"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import fondoEstudiantes from '../assets/estudiantes-fondo.jpg';

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, haandleSubmit, formState: { errors } } = useForm();

    const registro = async (data) => {
        data.rol = "Estudiante"
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/estudiante/registro`;
            const respuesta = await axios.post(url, data);
            toast.success(respuesta.data.msg);
        } catch (error) {
            toast.error(error.response.data.msg)
        }
    };

    return (
        <div
            className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${fondoEstudiantes})` }}
        >
            <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

            <div className="w-full relative z-10 bg-white bg-opacity-90 p-10 rounded-xl shadow-2xl max-w-3xl">
                <ToastContainer />
                <h1 className="text-3xl font-semibold mb-8 text-center uppercase text-red-900">Plataforma de Registro</h1>

                <form onSubmit={handleSubmit(registro)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ingresa tu nombre"
                            className="w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 text-gray-600"
                            {...register("nombreEstudiante", { required: "El nombre es obligatorio" })}
                        />
                        {errors.nombreEstudiante && <p className="text-red-800 text-sm mt-1">{errors.nombreEstudiante.message}</p>}
                    </div>

                    {/* Celular */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Teléfono</label>
                        <input
                            type="text"
                            placeholder="Ingresa tu celular"
                            className="w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 text-gray-600"
                            {...register("telefono", { required: "El celular es obligatorio" })}
                        />
                        {errors.telefono && <p className="text-red-800 text-sm mt-1">{errors.telefono.message}</p>}
                    </div>

                    {/* Correo electrónico */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            className="w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 text-gray-600"
                            {...register("emailEstudiante", { required: "El correo electrónico es obligatorio" })}
                        />
                        {errors.emailEstudiante && <p className="text-red-800 text-sm mt-1">{errors.emailEstudiante.message}</p>}
                    </div>

                    {/* Contraseña */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-1">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingresa una contraseña.."
                                className="w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 text-gray-600 pr-10"
                                {...register("password", { required: "La contraseña es obligatoria" })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-2.5 right-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 0 9.956 9.956 0 01-1.845 3.35M9.9 14.32a3 3 0 114.2-4.2m.5 3.5l3.8 3.8m-3.8-3.8L5.5 5.5" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.95 0a9.96 9.96 0 0119.9 0M3 3l18 18" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-800 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Botón enviar */}
                    <div className="md:col-span-2">
                        <button className="w-full bg-red-900 text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white mt-2">
                            Registrarse
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-xs border-b-2 py-3"></div>
                <div className="mt-4 text-sm flex justify-between items-center">
                    <Link to="/login" className="underline py-2 px-5 text-black hover:scale-110 duration-300">
                        ¿Ya tienes una cuenta? Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

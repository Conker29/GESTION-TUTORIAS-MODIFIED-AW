import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import estudiantesFont from "../assets/estudiantesFont.webp";

const Reset = () => {
  const { fetchDataBackend } = useFetch();
  const { token } = useParams();
  const navigate = useNavigate();
  const [tokenValid, setTokenValid] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const changePassword = async (data) => {
    if(data.password !== data.confirmpassword){
      toast.error("Las contraseñas no coinciden");
      return;
    }
    const url = `${import.meta.env.VITE_BACKEND_URL}/nuevopassword/${token}`;
    const response = await fetchDataBackend(url, data, 'POST');

    if(response?.msg){
      toast.success(response.msg);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword/${token}`;
      const response = await fetchDataBackend(url, null, 'GET');

      if(response?.msg){
        setTokenValid(true);
      } else {
        toast.error(response?.msg || 'Token inválido');
      }
    };
    verifyToken();
  }, [token, fetchDataBackend]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 -z-10">
        <img
          src={estudiantesFont}
          alt="Fondo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      <ToastContainer />

      <div className="flex flex-col items-center justify-center flex-grow px-4 py-10">
        {tokenValid ? (
          <form
            className="w-full max-w-sm bg-white bg-opacity-90 rounded-lg p-6 shadow-lg"
            onSubmit={handleSubmit(changePassword)}
          >
            <h1 className="text-3xl font-semibold mb-2 text-center text-red-900">
              Bienvenido nuevamente!
            </h1>
            <small className="text-gray-400 block my-4 text-sm text-center">
              Ingrese los datos para cambiar su contraseña
            </small>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                    message: "Debe incluir letras y números",
                  },
                })}
              />
              {errors.password && <p className="text-red-800">{errors.password.message}</p>}

              <label className="mt-4 mb-2 block text-sm font-semibold">Confirmar contraseña</label>
              <input
                type="password"
                placeholder="Repite tu contraseña"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                {...register("confirmpassword", {
                  required: "La confirmación es obligatoria",
                  minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                    message: "Debe incluir letras y números",
                  },
                })}
              />
              {errors.confirmpassword && <p className="text-red-800">{errors.confirmpassword.message}</p>}
            </div>

            <div className="mb-3">
              <button className="bg-red-900 text-white border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-black hover:text-white">
                Enviar
              </button>
            </div>
          </form>
        ) : (
          <p className="text-white text-center text-xl">Validando token...</p>
        )}
      </div>
    </div>
  );
};

export default Reset;

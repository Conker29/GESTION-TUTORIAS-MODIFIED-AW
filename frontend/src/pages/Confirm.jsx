import { Link, useParams } from 'react-router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export const Confirm = () => {
  const { token } = useParams();

  // Estado para saber si confirmación fue exitosa
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const verifyToken = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/confirmar/${token}`;
      const respuesta = await axios.get(url);
      toast.success(respuesta?.data?.msg);
      setConfirmado(true);
    } catch (error) {
      const msgError = error?.response?.data?.msg || 'Error al confirmar cuenta';
      toast.error(msgError);
      setErrorMsg(msgError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700">Verificando cuenta...</p>
      </div>
    );
  }

  if (!confirmado) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-bold">{errorMsg}</p>
      </div>
    );
  }

  // Si confirmado es true, muestra la pantalla de éxito
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <ToastContainer />

      <div className="bg-white p-10 md:p-16 rounded-xl shadow-lg text-center max-w-lg">
        <div className="flex flex-col items-center">
          <p className="text-3xl md:text-4xl text-red-900 font-bold mb-4">
            ¡Gracias por confirmar tu cuenta!
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Tu cuenta ha sido activada con éxito. Ahora puedes iniciar sesión en la plataforma.
          </p>

          <Link
            to="/login"
            className="w-full md:w-2/3 p-3 text-center bg-red-900 text-white rounded-xl font-semibold hover:bg-black transition-all duration-300"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

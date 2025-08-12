import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaUser, FaClock } from "react-icons/fa"; // Importamos los iconos

const VerTutorias = () => {
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorias = async () => {
      try {
        const token =
          JSON.parse(localStorage.getItem("auth-token"))?.state?.token ||
          localStorage.getItem("token");

        if (!token) {
          toast.error("Token de autenticación no disponible.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tutorias`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTutorias(data || []);
      } catch (error) {
        toast.error("Error al cargar las tutorías.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorias();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-lg text-gray-600 animate-pulse">Cargando tus tutorías...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Título de la página */}
      <div className="flex items-center justify-between border-b-2 border-gray-200 pb-4 mb-6">
        <h2 className="text-3xl font-extrabold text-red-900">Mis Tutorías</h2>
      </div>
      <p className="mb-4 text-sm text-gray-700 italic">Estimado estudiante, estas son sus tutorías agendadas en el día.</p>
      {tutorias.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-500">
            No tienes ninguna tutoría agendada en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorias.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              {/* Contenido de la tarjeta */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Tutoría Agendada</h3>
              </div>

              {/* Fecha */}
              <div className="flex items-center text-gray-600 mb-2">
                <FaCalendarAlt className="text-blue-500 mr-3" />
                <span className="font-medium">Fecha: </span>
                <span className="ml-2 capitalize">{t.fecha}</span>
              </div>

              {/* Horario */}
              <div className="flex items-center text-gray-600 mb-2">
                <FaClock className="text-blue-500 mr-3" />
                <span className="font-medium">Horario: </span>
                <span className="ml-2">
                  {t.horaInicio} - {t.horaFin}
                </span>
              </div>

              {/* Docente */}
              <div className="flex items-center text-gray-600">
                <FaUser className="text-blue-500 mr-3" />
                <span className="font-medium">Docente: </span>
                <span className="ml-2">{t.docente?.nombreDocente || "N/A"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerTutorias;

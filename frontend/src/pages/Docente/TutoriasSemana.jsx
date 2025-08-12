import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaUser, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";

const TutoriasSemana = () => {
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-utilizamos tu función para decodificar el token, es un buen patrón.
  const decodeTokenPayload = (token) => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const authTokenRaw = localStorage.getItem("auth-token");
    const token = authTokenRaw ? JSON.parse(authTokenRaw)?.state?.token : null;

    if (!token) {
      toast.error("Token de autenticación no disponible.");
      setLoading(false);
      return;
    }

    const decoded = decodeTokenPayload(token);
    if (!decoded || !decoded.id) {
      toast.error("Token inválido o sin ID de usuario.");
      setLoading(false);
      return;
    }

    const fetchTutorias = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tutorias`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTutorias(data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.msg || "Error al cargar las tutorías programadas."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTutorias();
  }, []);

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmado":
        return "text-green-500 bg-green-100";
      case "pendiente":
        return "text-yellow-500 bg-yellow-100";
      case "cancelado":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-inner text-gray-600 min-h-[250px]">
        <FaSpinner className="text-3xl animate-spin text-blue-500 mb-4" />
        <p className="text-lg">Cargando tus tutorías programadas...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Título y descripción */}
      <div className="flex items-center mb-6 border-b-2 border-gray-200 pb-4">
        <FaCalendarAlt className="text-3xl text-blue-600 mr-4" />
        <div>
          <h2 className="text-3xl font-extrabold text-red-900">Tutorías Programadas</h2>
          <p className="text-gray-500 mt-2 italic">
            Aquí puedes ver todas tus sesiones de tutoría.
          </p>
        </div>
      </div>

      {tutorias.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-500">
            No tienes tutorías programadas en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorias.map((tutoria) => (
            <div
              key={tutoria._id}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Tutoría</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tutoria.estado)}`}>
                  {tutoria.estado || "Pendiente"}
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <FaCalendarAlt className="text-blue-500 mr-3" />
                <span className="font-medium">Fecha:</span>
                <span className="ml-2">{new Date(tutoria.fecha).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <FaClock className="text-blue-500 mr-3" />
                <span className="font-medium">Horario:</span>
                <span className="ml-2">{tutoria.horaInicio} - {tutoria.horaFin}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <FaUser className="text-blue-500 mr-3" />
                <span className="font-medium">Estudiante:</span>
                <span className="ml-2 capitalize">{tutoria.estudiante?.nombreEstudiante || "No especificado"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutoriasSemana;

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { useParams } from "react-router";
import storeProfile from "../../context/storeProfile"; // importa tu store
import CalendarioDocente from "../Docente/CalendarioDocente";

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];

const VerDisponibilidad = ({ readOnly = true }) => {
  const { docenteId: docenteIdParam } = useParams(); // id desde la URL
  const { user } = storeProfile(); // usuario actual desde el store

  // Usamos este docenteId, primero preferimos URL, sino el usuario autenticado
  const docenteId = docenteIdParam && docenteIdParam !== ":docenteId" ? docenteIdParam : user?._id;

  const [disponibilidad, setDisponibilidad] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docenteId) {
      toast.error("No se especificó el docente.");
      setLoading(false);
      return;
    }

    const fetchDisponibilidad = async () => {
      try {
        const authTokenRaw = localStorage.getItem("auth-token");
        const token = authTokenRaw ? JSON.parse(authTokenRaw)?.state?.token : null;

        if (!token) {
          toast.error("Token no disponible.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/ver-disponibilidad-docente/${docenteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Convertimos array a objeto { diaSemana: bloques }
        const disponibilidadMap = data.disponibilidad.reduce((acc, current) => {
          acc[current.diaSemana] = current.bloques;
          return acc;
        }, {});

        setDisponibilidad(disponibilidadMap);
      } catch (error) {
        toast.error(
          error.response?.data?.msg || "Error al cargar la disponibilidad."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilidad();
  }, [docenteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-600 font-medium">Cargando calendario...</p>
      </div>
    );
  }

   return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-6">
        <FaCalendarAlt className="text-indigo-600 mr-3 text-3xl" />
        <h1 className="text-3xl font-extrabold text-gray-900">
          Mi Disponibilidad Semanal
        </h1>
      </div>

      <CalendarioDocente disponibilidad={disponibilidad} readOnly={readOnly} />
    </div>
  );

};

export default VerDisponibilidad;

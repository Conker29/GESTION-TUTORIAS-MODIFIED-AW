import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import storeProfile from "../../context/storeProfile";
import CalendarioDocente from "../Docente/CalendarioDocente";

const VerDisponibilidad = ({ readOnly = true }) => {
  const { docenteId: docenteIdParam } = useParams();
  const { user } = storeProfile();
  const docenteId = docenteIdParam && docenteIdParam !== ":docenteId" ? docenteIdParam : user?._id;

  const [disponibilidad, setDisponibilidad] = useState({});
  const [bloquesOcupados, setBloquesOcupados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docenteId) {
      toast.error("No se especificó el docente.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const authTokenRaw = localStorage.getItem("auth-token");
        const token = authTokenRaw ? JSON.parse(authTokenRaw)?.state?.token : null;

        if (!token) {
          toast.error("Token no disponible.");
          setLoading(false);
          return;
        }

        //Obtener disponibilidad
        const { data: dataDisp } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/ver-disponibilidad-docente/${docenteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const disponibilidadMap = dataDisp.disponibilidad.reduce((acc, current) => {
          acc[current.diaSemana] = current.bloques;
          return acc;
        }, {});
        setDisponibilidad(disponibilidadMap);

        //Obtener bloques ocupados
        const { data: dataOcupados } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tutorias-ocupadas/${docenteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBloquesOcupados(dataOcupados);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Error al cargar datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-red-900 mb-4">
          Calendario Semanal
        </h1>
         <p className="text-sm text-gray-500 italic">
          Estimado docente, este es su calendario semanal. En estos horarios, los estudiantes pueden agendar tutorías.
        </p>
      </div>

      <CalendarioDocente
        disponibilidad={disponibilidad}
        bloquesOcupados={bloquesOcupados} 
        readOnly={readOnly}
      />
    </div>
  );
};

export default VerDisponibilidad;

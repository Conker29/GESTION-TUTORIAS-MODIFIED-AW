import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TutoriasSemana = () => {
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para decodificar payload del JWT sin librerías externas
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
      toast.error("Token no disponible.");
      setLoading(false);
      return;
    }

    const decoded = decodeTokenPayload(token);
    if (!decoded || !decoded.id) {
      toast.error("Token inválido o sin ID de usuario.");
      setLoading(false);
      return;
    }

    const docenteId = decoded.id;

    const fetchTutorias = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tutorias/tutorias-programadas/${docenteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTutorias(data.tutorias || []);
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

  if (loading) return <p>Cargando tutorías programadas...</p>;

  if (tutorias.length === 0) return <p>No tienes tutorías programadas esta semana.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tutorías Programadas</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Fecha</th>
            <th className="px-4 py-2 border">Hora</th>
            <th className="px-4 py-2 border">Estudiante</th>
            <th className="px-4 py-2 border">Materia</th>
            <th className="px-4 py-2 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          {tutorias.map((tutoria) => (
            <tr key={tutoria._id}>
              <td className="border px-4 py-2">{new Date(tutoria.fecha).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{tutoria.hora}</td>
              <td className="border px-4 py-2 capitalize">{tutoria.estudianteNombre}</td>
              <td className="border px-4 py-2">{tutoria.materia || "No especificada"}</td>
              <td className="border px-4 py-2">{tutoria.estado || "Pendiente"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TutoriasSemana;

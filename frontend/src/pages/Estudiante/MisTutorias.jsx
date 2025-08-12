import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VerTutorias = () => {
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorias = async () => {
      try {
        const { data } = await axios.get("/api/tutorias", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTutorias(data.tutorias || []);
      } catch (error) {
        toast.error("Error al cargar tutorías.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorias();
  }, []);

  if (loading) return <p>Cargando tutorías...</p>;

  if (tutorias.length === 0) return <p>No tienes tutorías agendadas.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mis Tutorías</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Día</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Horario</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Docente</th>
          </tr>
        </thead>
        <tbody>
          {tutorias.map((t) => (
            <tr key={t._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 capitalize">{t.diaSemana}</td>
              <td className="border border-gray-300 px-4 py-2">
                {t.horaInicio} - {t.horaFin}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {t.docente?.nombre} {t.docente?.apellido}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerTutorias;

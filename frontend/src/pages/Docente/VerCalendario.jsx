import { useEffect, useState } from "react";
import axios from "axios";
import storeProfile from "../../context/storeProfile";
import { toast } from "react-toastify";

const VerCalendario = () => {
  const { user } = storeProfile(); // tu store con datos del usuario
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No intentar cargar si todavía no hay usuario
    if (!user || !user._id) return;

    const fetchDisponibilidad = async () => {
      try {
        const { data } = await axios.get(
          `/api/disponibilidad/${user._id}`
        );
        setDisponibilidad(data.disponibilidad || []);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.msg ||
            "Error al cargar la disponibilidad"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilidad();
  }, [user]);

  if (loading) {
    return <p>Cargando calendario...</p>;
  }

  if (disponibilidad.length === 0) {
    return <p>No tienes disponibilidad registrada.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Mi disponibilidad semanal
      </h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Día</th>
            <th className="px-4 py-2 border">Bloques</th>
          </tr>
        </thead>
        <tbody>
          {disponibilidad.map((dia) => (
            <tr key={dia._id}>
              <td className="border px-4 py-2">{dia.diaSemana}</td>
              <td className="border px-4 py-2">
                {dia.bloques.map((b, i) => (
                  <span key={i} className="block">
                    {b.horaInicio} - {b.horaFin}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerCalendario;

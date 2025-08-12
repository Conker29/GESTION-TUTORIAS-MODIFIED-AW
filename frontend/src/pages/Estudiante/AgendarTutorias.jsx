import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CalendarioDocente from "../Docente/CalendarioDocente";
import "react-toastify/dist/ReactToastify.css";

// Modal básico
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
        aria-label="Cerrar modal"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

const AgendarTutorias = () => {
  const navigate = useNavigate();
  const [docentes, setDocentes] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState({});
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  const [bloquesOcupados, setBloquesOcupados] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    try {
      const item = localStorage.getItem("auth-token");
      if (!item) return null;
      const parsed = JSON.parse(item);
      return parsed?.state?.token || null;
    } catch {
      return null;
    }
  };

  // Solo carga lista de docentes al montar
  useEffect(() => {
    const fetchDocentes = async () => {
      const token = getToken();
      if (!token) {
        toast.error("No estás autenticado. Por favor inicia sesión.");
        return;
      }
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/docentes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocentes(data.docentes || []);
      } catch {
        toast.error("Error al cargar la lista de docentes.");
      }
    };
    fetchDocentes();
  }, []);

  // Filtra bloques ocupados solo del docente seleccionado
  const bloquesOcupadosDocente = bloquesOcupados.filter(
    bloque => bloque.docenteId === docenteSeleccionado?._id
  );

  console.log("Bloques ocupados del docente seleccionado:", bloquesOcupadosDocente);
  console.log("Disponibilidad:", disponibilidad);

  // Cuando se selecciona un docente:
  const manejarAgendarClick = async (docente) => {
    setBloqueSeleccionado(null);
    setDisponibilidad({});
    setDocenteSeleccionado(docente);

    const token = getToken();
    if (!token) {
      toast.error("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    try {
      // Trae disponibilidad
      const { data: dataDisp } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ver-disponibilidad-docente/${docente._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const disponibilidadMap = dataDisp.disponibilidad.reduce((acc, current) => {
        acc[current.diaSemana] = current.bloques;
        return acc;
      }, {});
      setDisponibilidad(disponibilidadMap);

      // Trae tutorías ocupadas para ese docente
      const { data: dataOcupados } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/tutorias-ocupadas/${docente._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Tutorías ocupadas recibidas del backend:", dataOcupados);
      const bloques = dataOcupados.map(t => ({
        diaSemana: new Date(t.fecha).toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase(),
        fecha: t.fecha,
        horaInicio: t.horaInicio,
        horaFin: t.horaFin,
        docenteId: t.docente,
      }));

      setBloquesOcupados(bloques);
      setMostrarCalendario(true);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar la disponibilidad o tutorías ocupadas.");
    }
  };

  // Enviar formulario para agendar tutoría
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!docenteSeleccionado || !bloqueSeleccionado) {
      toast.error("Seleccione un bloque horario.");
      return;
    }

    setLoading(true);
    const token = getToken();

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tutoria/registro`,
        {
          docente: docenteSeleccionado._id,
          fecha: bloqueSeleccionado.fecha,
          horaInicio: bloqueSeleccionado.horaInicio,
          horaFin: bloqueSeleccionado.horaFin,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Tutoría registrada con éxito.");

      // Añade bloque seleccionado a bloques ocupados para que se vea tachado
      setBloquesOcupados(prev => [
        ...prev,
        {
          ...bloqueSeleccionado,
          docenteId: docenteSeleccionado._id,
        },
      ]);

      setTimeout(() => {
        setMostrarCalendario(false);
        setDocenteSeleccionado(null);
        setBloqueSeleccionado(null);
        setDisponibilidad({});
        navigate("/dashboard");
      }, 4000);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al agendar tutoría.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-extrabold text-red-900 mb-4">Agendar Tutoría</h2>
      <p className="text-sm text-gray-700 mb-4">Por favor selecciona un docente de la lista para agendar tu tutoría</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {docentes.length === 0 && <p>No hay docentes disponibles.</p>}
        {docentes.map((docente) => (
          <div key={docente._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{docente.nombreDocente}</h3>
            <p className="text-sm text-gray-500 mb-2">{docente.oficinaDocente}</p>
            <button
              onClick={() => manejarAgendarClick(docente)}
              className="mt-2 w-full py-2 bg-amber-700 text-white rounded hover:bg-black"
            >
              Agendar Tutoría
            </button>
          </div>
        ))}
      </div>

      {mostrarCalendario && (
        <Modal onClose={() => setMostrarCalendario(false)}>
          <h3 className="text-xl font-semibold mb-4">
            Disponibilidad de {docenteSeleccionado?.nombreDocente}
          </h3>
          <form onSubmit={handleSubmit}>
            <CalendarioDocente
              disponibilidad={disponibilidad}
              readOnly={false}
              bloqueSeleccionado={bloqueSeleccionado}
              onSelectBloque={setBloqueSeleccionado}
              bloquesOcupados={bloquesOcupadosDocente}
            />
            {bloqueSeleccionado && (
              <div className="mt-4 p-4 border rounded bg-green-50 text-green-900">
                <strong>Bloque seleccionado:</strong> {bloqueSeleccionado.diaSemana} - {bloqueSeleccionado.horaInicio} a {bloqueSeleccionado.horaFin}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !bloqueSeleccionado}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Agendando..." : "Confirmar Tutoría"}
            </button>
          </form>
        </Modal>
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AgendarTutorias;

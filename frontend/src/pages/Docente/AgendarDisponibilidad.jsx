import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaPlus, FaTrashAlt } from "react-icons/fa"; // Usamos íconos para los botones
import { useNavigate } from "react-router";  
import "react-toastify/dist/ReactToastify.css";

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];

const AgendarDisponibilidad = () => {
  const [diaSeleccionado, setDiaSeleccionado] = useState("");
  const [bloques, setBloques] = useState([{ horaInicio: "", horaFin: "" }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // <-- hook para navegación

  // Maneja cambio en horaInicio o horaFin
  const handleCambioBloque = (index, campo, valor) => {
    const nuevosBloques = bloques.map((bloque, i) =>
      i === index ? { ...bloque, [campo]: valor } : bloque
    );
    setBloques(nuevosBloques);
  };

  // Agregar nuevo bloque vacío
  const agregarBloque = () => {
    setBloques([...bloques, { horaInicio: "", horaFin: "" }]);
  };

  // Eliminar bloque por índice
  const eliminarBloque = (index) => {
    // Si solo queda un bloque, lo reseteamos en lugar de eliminarlo
    if (bloques.length === 1) {
      setBloques([{ horaInicio: "", horaFin: "" }]);
    } else {
      setBloques(bloques.filter((_, i) => i !== index));
    }
  };

  // Validar y normalizar la entrada de horas
const validar = () => {
  if (!diaSeleccionado) {
    toast.error("Seleccione un día de la semana.");
    return false;
  }

  // Función auxiliar para convertir "HH:MM" a minutos
  const toMinutes = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  const MIN_MINUTOS = toMinutes("08:00");
  const MAX_MINUTOS = toMinutes("17:00");

  for (let bloque of bloques) {
    if (!bloque.horaInicio || !bloque.horaFin) {
      toast.error("Complete todos los campos de hora.");
      return false;
    }
    const inicioMin = toMinutes(bloque.horaInicio);
    const finMin = toMinutes(bloque.horaFin);

    if (inicioMin < MIN_MINUTOS || finMin > MAX_MINUTOS) {
      toast.error("Las horas deben estar entre 08:00 y 17:00.");
      return false;
    }
    if (inicioMin >= finMin) {
      toast.error("La hora de inicio debe ser menor que la hora fin.");
      return false;
    }
  }
  return true;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setLoading(true);

    // Obtener el token directamente, más conciso
    const token = JSON.parse(localStorage.getItem("auth-token"))?.state?.token || null;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tutorias/registrar-disponibilidad`,
        { diaSemana: diaSeleccionado, bloques },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success(response.data.msg || "Disponibilidad actualizada.");
      // Limpiar el formulario después de un envío exitoso
      setDiaSeleccionado("");
      setBloques([{ horaInicio: "", horaFin: "" }]);
      // Redirigir a calendario después de un corto delay para que se vea el toast
    setTimeout(() => {
    navigate("/dashboard/ver-disponibilidad-docente/:docenteId");
    }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.msg || error.message || "Error al actualizar disponibilidad."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto my-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Agendar Disponibilidad
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Agregue los bloques de tiempo en los que estarás disponible para tutorías.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="dia" className="block text-lg font-semibold font-medium text-gray-700 mb-1">
            Día de la semana
          </label>
          <select
            id="dia"
            value={diaSeleccionado}
            onChange={(e) => setDiaSeleccionado(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" disabled>Seleccione un día</option>
            {diasSemana.map((dia) => (
              <option key={dia} value={dia}>
                {dia.charAt(0).toUpperCase() + dia.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 space-y-4">
          <h3 className="text-lg font-semibold font-medium text-gray-700">Bloques de Horario</h3>
          {bloques.map((bloque, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500">Hora Inicio</label>
                <input
                  type="time"
                  value={bloque.horaInicio}
                  onChange={(e) => handleCambioBloque(index, "horaInicio", e.target.value)}
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-500">Hora Fin</label>
                <input
                  type="time"
                  value={bloque.horaFin}
                  onChange={(e) => handleCambioBloque(index, "horaFin", e.target.value)}
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => eliminarBloque(index)}
                className={`flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full ${bloques.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={`Eliminar bloque ${index + 1}`}
                disabled={bloques.length === 1}
              >
                <FaTrashAlt size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={agregarBloque}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-800 font-semibold text-sm transition-colors"
          >
            <FaPlus />
            Agregar otro bloque
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-900 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Guardar Disponibilidad"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AgendarDisponibilidad;
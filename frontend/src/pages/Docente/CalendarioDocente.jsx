import { FaClock } from "react-icons/fa";

// Definimos el orden de los días
const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];

const obtenerFechaPorDiaSemana = (diaSemana) => {
  const diasMap = {
    lunes: 1,
    martes: 2,
    miércoles: 3,
    jueves: 4,
    viernes: 5,
  };

  const hoy = new Date();
  const diaActual = hoy.getDay(); 
  const objetivo = diasMap[diaSemana];

  let diferencia = objetivo - diaActual;
  if (diferencia < 0) diferencia += 7; // Ir a la próxima semana si ya pasó

  const fechaObjetivo = new Date(hoy);
  fechaObjetivo.setDate(hoy.getDate() + diferencia);

  // Retornar en formato YYYY-MM-DD
  return fechaObjetivo.toISOString().split("T")[0];
};

const CalendarioDocente = ({
  disponibilidad = {},
  readOnly = true,
  bloqueSeleccionado,
  onSelectBloque = () => {},
  bloquesOcupados = [],
}) => {
  const isSelected = (bloque) => {
    if (!bloqueSeleccionado) return false;
    return (
      bloque.horaInicio === bloqueSeleccionado.horaInicio &&
      bloque.horaFin === bloqueSeleccionado.horaFin &&
      bloque.diaSemana === bloqueSeleccionado.diaSemana
    );
  };

  console.log("Bloques ocupados recibidos:", bloquesOcupados);
  const isOcupado = (bloque) => {
    const encontrado = bloquesOcupados.some(
      (ocupado) =>
        ocupado.diaSemana.toLowerCase() === bloque.diaSemana.toLowerCase() &&
        ocupado.horaInicio === bloque.horaInicio &&
        ocupado.horaFin === bloque.horaFin
    );
    return encontrado;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {diasSemana.map((dia) => (
        <div
          key={dia}
          className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-bold text-gray-800 capitalize mb-3">
            {dia}
          </h3>
          <div className="space-y-2">
            {disponibilidad[dia] && disponibilidad[dia].length > 0 ? (
              disponibilidad[dia].map((b, i) => {
                // Añadimos fecha real al bloque
                const bloqueConFecha = {
                  ...b,
                  diaSemana: dia,
                  fecha: obtenerFechaPorDiaSemana(dia),
                };

                const ocupado = isOcupado(bloqueConFecha);
                const seleccionado = isSelected(bloqueConFecha);

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (!readOnly && !ocupado) onSelectBloque(bloqueConFecha);
                    }}
                    className={`flex items-center p-2 rounded-md text-sm font-medium shadow-inner select-none ${
                      ocupado
                        ? "bg-red-200 text-red-800 cursor-not-allowed line-through"
                        : seleccionado
                        ? "bg-green-300 text-green-900"
                        : readOnly
                        ? "bg-indigo-100 text-indigo-800"
                        : "cursor-pointer hover:bg-indigo-300 bg-indigo-50 text-indigo-900"
                    }`}
                    title={ocupado ? "Bloque ocupado" : "Disponible"}
                  >
                    <FaClock className="mr-2" />
                    <span>
                      {b.horaInicio} - {b.horaFin}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm italic">
                No hay disponibilidad.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarioDocente;

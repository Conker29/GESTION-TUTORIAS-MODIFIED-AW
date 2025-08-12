import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import { FaUserCircle, FaCalendarAlt, FaIdCard, FaBuilding, FaEnvelope, FaMobileAlt, FaBook, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Details = () => {
  const { id } = useParams();
  const [docente, setDocente] = useState(null); // Cambiado a null para mejor manejo de estado
  const { fetchDataBackend } = useFetch();

  const listDocente = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/docente/${id}`;
    const storedUser = JSON.parse(localStorage.getItem("auth-token"));
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedUser.state.token}`,
    };
    const response = await fetchDataBackend(url, null, "GET", headers);
    setDocente(response);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('es-EC', { dateStyle: 'long', timeZone: 'UTC' });
  };

  useEffect(() => {
    listDocente();
  }, [id]);

  if (!docente) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Cargando información del docente...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Título y descripción */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h1 className="font-semibold text-4xl text-red-900 flex items-center">
            <FaUserCircle className="mr-2 text-xl" />
            Información del Docente
          </h1>
          <p className="mt-2 text-gray-500 italic">
            Detalles del docente seleccionado.
          </p>
        </div>
        
        <div className="p-8 grid md:grid-cols-3 gap-8 items-center">
          
          {/* Columna de la imagen */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="h-60 w-60 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
              <img
                src={docente.avatarDocente}
                alt={`Foto de ${docente.nombreDocente}`}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-800 text-center">
              {docente.nombreDocente}
            </h2>
            <p className="flex-items center space-x-2 mt-2 text-sm text-gray-500 text-center">
              <FaBuilding className="text-xl" />
              {docente.oficinaDocente}
            </p>
          </div>

          {/* Columna de la información detallada */}
          <div className="md:col-span-2 space-y-4 text-gray-700">
            
            {/* Sección de información personal */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-amber-700 mb-3 flex items-center">
                <FaIdCard className="mr-2 text-xl" />
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                <p><span className="font-semibold">Cédula:</span> {docente.cedulaDocente}</p>
                <p><span className="font-semibold">Fecha de nacimiento:</span> {formatDate(docente.fechaNacimientoDocente)}</p>
                <p><span className="font-semibold">Celular:</span> {docente.celularDocente}</p>
              </div>
            </div>

            {/* Sección de información de contacto */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-amber-700 mb-3 flex items-center">
                <FaEnvelope className="mr-2 text-xl" />
                Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                <p><span className="font-semibold">Correo institucional:</span> {docente.emailDocente}</p>
                <p><span className="font-semibold">Correo alternativo:</span> {docente.emailAlternativoDocente || 'N/A'}</p>
              </div>
            </div>

            {/* Sección de información académica */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-amber-700 mb-3 flex items-center">
                <FaBook className="mr-2 text-xl" />
                Información Académica
              </h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Semestre Asignado:</span> {docente.semestreAsignado || 'N/A'}</p>
                <div>
                  <p className="font-semibold mb-1">Asignaturas:</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(docente.asignaturas) && docente.asignaturas.length > 0
                      ? docente.asignaturas.map((asig, i) => (
                          <span key={i} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {asig}
                          </span>
                        ))
                      : <p className="text-gray-500 italic text-sm">No hay asignaturas asignadas.</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de estado */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-amber-700 mb-3 flex items-center">
                <FaCheckCircle className="mr-2 text-xl" />
                Estado
              </h3>
              <p>
                <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${docente.estadoDocente ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {docente.estadoDocente ? "Activo" : "Inactivo"}
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
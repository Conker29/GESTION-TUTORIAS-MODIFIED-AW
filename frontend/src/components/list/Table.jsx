import { MdDeleteForever, MdInfo, MdPublishedWithChanges } from "react-icons/md";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from 'react-router'
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify"
import storeAuth from "../../context/storeAuth";

const Table = () => {
  const { rol } = storeAuth()
  const navigate = useNavigate()
  const { fetchDataBackend } = useFetch();
  const [docentes, setDocentes] = useState([]);
  
  console.log(docentes);
  const listDocentes = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/docentes`;
    const storedUser = JSON.parse(localStorage.getItem("auth-token"));
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedUser.state.token}`,
    };
    const response = await fetchDataBackend(url, null, "GET", headers);
    if (response) setDocentes(response);
  };

  const deleteDocente = async(id) => {
        const confirmDelete = confirm("¿Está seguro de deshabilitar este registro?")
        if(confirmDelete){
            const url = `${import.meta.env.VITE_BACKEND_URL}/docente/eliminar/${id}`
            const storedUser = JSON.parse(localStorage.getItem("auth-token"))
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedUser.state.token}`,
                }
            }
            const data ={
                salidaDocente:new Date().toString()
            }
            await fetchDataBackend(url, data, "DELETE", options.headers)
            await listDocentes()
            //setDocentes((prevDocentes) => prevDocentes.filter(docente => docente._id !== id))
        }
    }

  useEffect(() => {
    listDocentes();
  }, []);

  if (docentes.length === 0) {
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
        <span className="font-medium">No existen registros</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <ToastContainer /> 
      <table className="w-full mt-5 table-auto shadow-lg bg-white rounded-lg overflow-hidden">
        <thead className="bg-slate-800 text-white sticky top-0 z-10">
          <tr>
            {[
              "N°",
              "Cédula",
              "Nombre",
              "Fecha de Nacimiento",
              "Oficina",
              "Email",
              "Email alternativo",
              "Celular",
              "Semestre Asignado",
              "Asignaturas",
              "Estado",
              "Acciones",
            ].map((header) => (
              <th key={header} className="p-3 text-sm font-semibold text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {docentes.map((docente, index) => (
            <tr key={docente._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{docente.cedulaDocente}</td>
              <td className="p-3">{docente.nombreDocente}</td>
              <td className="p-3">
                {new Date(docente.fechaNacimientoDocente).toLocaleDateString("es-EC")}
              </td>
              <td className="p-3">{docente.oficinaDocente}</td>
              <td className="p-3">{docente.emailDocente}</td>
              <td className="p-3">{docente.emailAlternativoDocente}</td>
              <td className="p-3">{docente.celularDocente}</td>
              <td className="p-3">{docente.semestreAsignado}</td>
              <td className="p-3 flex flex-wrap gap-1">
                {Array.isArray(docente.asignaturas) &&
                  docente.asignaturas.map((asig, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {asig}
                    </span>
                  ))}
              </td>
              <td className="p-3">
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    docente.estadoDocente
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {docente.estadoDocente ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="p-3 space-x-2">
                <MdInfo
                  title="Más información"
                  className="h-6 w-6 text-slate-800 cursor-pointer hover:text-green-600 inline"
                  onClick={() => navigate(`/dashboard/visualizar/${docente._id}`)}
                />

                {
                  rol==="Administrador" &&
                    (
                      <>
                        <MdPublishedWithChanges
                        title="Actualizar"
                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2 hover:text-blue-600"
                        onClick={() => navigate(`/dashboard/actualizar/${docente._id}`)}
                        />

                        <MdDeleteForever
                        title="Eliminar"
                        className="h-7 w-7 text-red-900 cursor-pointer inline-block hover:text-red-600"
                        onClick={()=>{deleteDocente(docente._id)}}
                        />
                    </>
                    )
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

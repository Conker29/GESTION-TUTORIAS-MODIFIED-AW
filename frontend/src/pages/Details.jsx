import { useEffect, useState } from "react"
import { useParams } from "react-router"
import useFetch from "../hooks/useFetch"

const Details = () => {
  const { id } = useParams()
  const [docente, setDocente] = useState({})
  const { fetchDataBackend } = useFetch()

  const listDocente = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/docente/${id}`
    const storedUser = JSON.parse(localStorage.getItem("auth-token"))
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedUser.state.token}`
    }
    const response = await fetchDataBackend(url, null, "GET", headers)
    setDocente(response)
  }

  const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-EC', { dateStyle: 'long', timeZone: 'UTC' })
    }

  useEffect(() => {
    listDocente()
  }, [])


  return (
    <>
      <div>
        <h1 className='font-black text-4xl text-red-900'>Detalle del registro</h1>
        <hr className='my-4 border-t-2 border-gray-300' />
        <p className='mb-8'>Este módulo permite visualizar los datos de cada registro.</p>
      </div>

      <div className='m-5 flex justify-between'>

        <div>
          <ul className="list-disc pl-5">
            <li className="text-md text-gray-00 mt-4 font-bold text-xl">Información del docente</li>
            <ul className="pl-5">
              <li className="text-md text-gray-00 mt-2">
                <span className="text-gray-600 font-bold">Cédula: </span>{docente?.cedulaDocente}
              </li>
              <li className="text-md text-gray-00 mt-2">
                <span className="text-gray-600 font-bold">Nombres completos: </span>{docente?.nombreDocente}
              </li>
              <li className="text-md text-gray-00 mt-2">
                <span className="text-gray-600 font-bold">Fecha de nacimiento: {formatDate(docente?.fechaNacimientoDocente)}</span>
              </li>
              <li className="text-md text-gray-00 mt-2">
                <span className="text-gray-600 font-bold">Oficina: </span>{docente?.oficinaDocente}
              </li>
              <li className="text-md text-gray-00 mt-2">
                <span className="text-gray-600 font-bold">Correo institucional: </span>{docente?.emailDocente}
              </li>
              <li className="text-md text-gray-00 mt-2">
                <span className="text-gray-600 font-bold">Correo electrónico Alternativo: </span>{docente?.emailAlternativoDocente}
              </li>
              <li className="text-md text-gray-00 mt-2">
                <span className="text-gray-600 font-bold">Celular: </span>{docente?.celularDocente}
              </li>
              <li className="text-md text-gray-00 mt-2">
                <span className="text-gray-600 font-bold">Asignaturas impartidas por semestre: </span>
                {Array.isArray(docente?.asignaturas)
                  ? docente.asignaturas.join(", ")
                  : docente?.asignaturas}
              </li>
            </ul>
            <li className="text-md text-gray-00 mt-2">
              <span className="text-gray-600 font-bold">Estado: </span>
              <span className="bg-blue-100 text-green-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {docente?.estadoDocente && "activo"}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <img src={docente?.avatarDocente} alt="docente" className='h-80 w-80 rounded-full' />
        </div>

      </div>

    {/*<hr className='my-4 border-t-2 border-gray-300' />

    <div className='flex justify-between items-center'>
        <p>Este módulo te permite gestionar los tratamientos</p>
        <button className="px-5 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700">
          Registrar
        </button>
        {false && (<Modaltutorias />)}
      </div>*/}

    </>
  )
}

export default Details
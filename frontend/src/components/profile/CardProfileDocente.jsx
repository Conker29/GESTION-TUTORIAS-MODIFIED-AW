import storeProfile from "../../context/storeProfile"
import { useState } from "react"
import { FaUserCircle } from "react-icons/fa"
import { MdEdit } from "react-icons/md"

export const CardProfileDocente = () => {
    const { user, updatePhotoProfile } = storeProfile()
    const [selectedFile, setSelectedFile] = useState(null)

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const handleUpload = async () => {
        if (!selectedFile) return
        await updatePhotoProfile(selectedFile, user._id)
        setSelectedFile(null)
    }

    // Corregido el formateo de fecha para evitar el error de zona horaria
    const formatDate = (dateString) => {
        if (!dateString) return "No disponible"
        const date = new Date(dateString)
        // Usar UTC para evitar el cambio de día por la zona horaria
        const day = String(date.getUTCDate()).padStart(2, '0')
        const month = String(date.getUTCMonth() + 1).padStart(2, '0')
        const year = date.getUTCFullYear()
        return `${year}-${month}-${day}` // Formato YYYY-MM-DD para una mejor legibilidad
    }

    return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 max-w-md mx-auto my-8 flex flex-col items-center">
            
            {/* Contenedor de la foto de perfil dentro de la tarjeta */}
            <div className="relative w-40 h-40 mb-6 border-4 border-white rounded-full overflow-hidden shadow-md">
                {user.avatarDocente ? (
                    <img
                        src={user.avatarDocente}
                        alt="Foto del docente"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <FaUserCircle className="text-gray-400 w-full h-full" />
                )}
            </div>

            {/* Sección de edición de foto */}
            <div className="text-center mb-6">
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    <MdEdit className="mr-2 h-4 w-4" />
                    Seleccionar Foto
                </label>
                {selectedFile && (
                    <button
                        onClick={handleUpload}
                        className="ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        disabled={!selectedFile}
                    >
                        Subir Foto
                    </button>
                )}
            </div>

            {/* Separador visual */}
            <div className="w-full border-t border-gray-300 mb-6"></div>

            {/* Información del docente */}
            <div className="space-y-4 text-left w-full">
                <p className="text-gray-700 text-lg"><b className="font-semibold text-gray-900">Nombre:</b> {user.nombreDocente}</p>
                <p className="text-gray-700"><b className="font-semibold text-gray-900">Fecha de nacimiento:</b> {formatDate(user.fechaNacimientoDocente)}</p>
                <p className="text-gray-700"><b className="font-semibold text-gray-900">Cédula:</b> {user.cedulaDocente}</p>
                <p className="text-gray-700"><b className="font-semibold text-gray-900">Email:</b> {user.emailDocente}</p>
                <p className="text-gray-700"><b className="font-semibold text-gray-900">Email Alternativo:</b> {user.emailAlternativoDocente}</p>
                <p className="text-gray-700"><b className="font-semibold text-gray-900">Celular:</b> {user.celularDocente}</p>
                <p className="text-gray-700"><b className="font-semibold text-gray-900">Semestre Asignado:</b> {user.semestreAsignado}</p>
                <p className="text-gray-700"><b className="font-semibold text-gray-900">Asignaturas:</b> {user.asignaturas}</p>
            </div>
        </div>
    )
}

import storeProfile from "../../context/storeProfile"
import { useState } from "react"
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaChalkboardTeacher, FaCalendarAlt, FaIdCard, FaSchool, FaBuilding } from "react-icons/fa"
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

    const formatDate = (dateString) => {
        if (!dateString) return "No disponible"
        const date = new Date(dateString)
        const day = String(date.getUTCDate()).padStart(2, '0')
        const month = String(date.getUTCMonth() + 1).padStart(2, '0')
        const year = date.getUTCFullYear()
        return `${year}-${month}-${day}`
    }

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl p-8 max-w-lg mx-auto my-8 flex flex-col items-center relative">
            
            <div className="relative w-40 h-40 mb-6 border-4 border-gray-300 rounded-full overflow-hidden shadow-lg">
                {user.avatarDocente ? (
                    <img
                        src={user.avatarDocente}
                        alt="Foto del docente"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <FaUserCircle className="text-gray-400 w-full h-full p-4" />
                )}
            </div>

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
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors"
                >
                    <MdEdit className="mr-2 h-4 w-4" />
                    Seleccionar Foto
                </label>
                {selectedFile && (
                    <button
                        onClick={handleUpload}
                        className="ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={!selectedFile}
                    >
                        Subir Foto
                    </button>
                )}
            </div>

            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">{user.nombreDocente}</h2>
            <p className="text-sm font-light text-gray-500 mb-6">Docente de la ESFOT</p>

            <div className="w-full border-t border-gray-200 my-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-gray-700">
                <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-gray-500" />
                    <p><b>Fecha de Nacimiento:</b> {formatDate(user.fechaNacimientoDocente)}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaIdCard className="text-gray-500" />
                    <p><b>Cédula:</b> {user.cedulaDocente}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaBuilding className="text-gray-500" />
                    <p><b>Oficina:</b> {user.oficinaDocente}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-500" />
                    <p><b>Email:</b> {user.emailDocente}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaPhoneAlt className="text-gray-500" />
                    <p><b>Celular:</b> {user.celularDocente}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaSchool className="text-gray-500" />
                    <p><b>Semestre Asignado:</b> {user.semestreAsignado}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaChalkboardTeacher className="text-gray-500" />
                    <p><b>Asignaturas:</b> {user.asignaturas}</p>
                </div>
            </div>
        </div>
    )
}

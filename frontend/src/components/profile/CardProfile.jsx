import { useState, useEffect } from "react";
import storeProfile from "../../context/storeProfile";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export const CardProfile = () => {
  const { user, updatePhotoProfile } = storeProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para obtener URL completa de la foto
  const getFullPhotoUrl = (foto) => {
    if (!foto) return null;
    if (foto.startsWith("http")) return foto;
    return `${import.meta.env.VITE_BACKEND_URL}/${foto}`;
  };

  useEffect(() => {
    setPreview(getFullPhotoUrl(user?.fotoPerfilAdmin));
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // preview local inmediato
    } else {
      setPreview(getFullPhotoUrl(user?.fotoPerfilAdmin));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const updatedUser = await updatePhotoProfile(selectedFile, user._id, user.rol);
      // Actualiza el preview con la foto subida (URL completa)
      setPreview(getFullPhotoUrl(updatedUser?.fotoPerfilAdmin));
      setSelectedFile(null);
    } catch (error) {
      // Aquí podrías manejar error si quieres
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl p-8 max-w-sm mx-auto my-8 flex flex-col items-center relative">
      
      <div className="relative w-32 h-32 mb-4 border-4 border-gray-300 rounded-full overflow-hidden shadow-lg">
        {preview ? (
          <img
            src={preview}
            alt="Foto del administrador"
            className="object-cover w-full h-full"
          />
        ) : (
          <FaUserCircle className="text-gray-400 w-full h-full p-4" />
        )}
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4">{user?.nombreAdministrador}</h2>
        <p className="text-sm font-light text-gray-500">Administrador de la plataforma</p>
      </div>

      <div className="w-full border-t border-gray-200 my-4"></div>

      <div className="w-full space-y-3">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaEnvelope className="text-gray-500" />
          <p><b>Correo Institucional:</b> {user.email}</p>
        </div>
      </div>

      <div className="w-full border-t border-gray-200 my-4"></div>
      <p className="text-sm font-semibold text-black">Editar Foto de Perfil</p>
      <div className="text-center mt-2">
        <input
          type="file"
          id="file-upload-adm"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          disabled={loading}
        />
        <label
          htmlFor="file-upload-adm"
          className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <MdEdit className="mr-2 h-4 w-4" />
          Seleccionar Foto
        </label>
        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50`}
          >
            {loading ? "Subiendo..." : "Subir Foto"}
          </button>
        )}
      </div>
    </div>
  );
};

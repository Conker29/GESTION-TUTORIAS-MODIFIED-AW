import storeProfile from "../../context/storeProfile";
import { useState } from "react";

const CardProfileEstudiante = () => {
  const { user, updatePhotoProfile } = storeProfile();
   const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Llamamos a la función del store que hace la subida
    await updatePhotoProfile(selectedFile, user._id, user.rol);
  };
  
  return (
    <div className="bg-white border border-slate-200 h-auto p-4 flex flex-col items-center justify-between shadow-xl rounded-lg">

      <div>
        <img
          src={user.fotoPerfil || "https://marketup.com/wp-content/themes/marketup/assets/icons/perfil-vazio.jpg"}
          alt="Foto del estudiante"
          className="m-auto rounded-full border border-gray-300"
          width={120}
          height={120}
        />
      </div>

      <input type="file" onChange={handleFileChange} accept="image/*" />

      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
      >
        Subir Foto
      </button>

      <div className="self-start mt-4">
        <b>Nombre:</b>
        <p className="inline-block ml-3">{user.nombreEstudiante}</p>
      </div>
      <div className="self-start">
        <b>Celular:</b>
        <p className="inline-block ml-3">{user.telefono}</p>
      </div>
      <div className="self-start">
        <b>Email:</b>
        <p className="inline-block ml-3">{user.emailEstudiante}</p>
      </div>
    </div>
  );
};

export default CardProfileEstudiante;
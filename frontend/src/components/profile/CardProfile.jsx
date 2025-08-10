import { useState, useEffect } from "react";
import storeProfile from "../../context/storeProfile"

export const CardProfile = () => {
    const { user } = storeProfile()
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        // Si cambia el usuario, actualizar la imagen con la fotoPerfil (url)
        if (user?.fotoPerfil) {
        setPreview(user.fotoPerfil);
        }
    }, [user]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        await storeProfile.getState().updatePhotoProfile(file, user._id);
        setPreview(URL.createObjectURL(file)); // Actualiza preview con imagen seleccionada
        }

    return (
        <div className="bg-white border border-slate-200 w-full max-w-md mx-auto p-6 
                        flex flex-col items-center text-gray-800 shadow-xl rounded-2xl">
            <div className="relative mb-4">
                <img
                    src={preview || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png" 
                    } 
                    alt="Perfil"
                    className="w-32 h-32 object-cover rounded-full border-2 border-emerald-400"
                />
                <label className="absolute bottom-2 right-2 bg-emerald-500 text-white rounded-full p-2 cursor-pointer hover:bg-emerald-600 transition-all shadow-lg">
                    📤
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            </div>

            <div className="text-center w-full">
                <div className="mb-2">
                    <p className="text-xl text-red-900 font-semibold">Nombre</p>
                    <p className="text-lg font-medium">{user?.nombreAdministrador || user?.nombreEstudiante}</p>
                </div>
                <div>
                    <p className="text-xl text-red-900 font-semibold">Correo</p>
                    <p className="text-lg font-medium">{user?.email || user?.emailEstudiante}</p>
                </div>
            </div>
        </div>
   )
}

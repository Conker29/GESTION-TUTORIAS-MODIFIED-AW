import storeProfile from "../../context/storeProfile"

export const CardProfile = () => {
    const { user } = storeProfile()

    return (
        <div className="bg-white border border-slate-200 w-full max-w-md mx-auto p-6 
                        flex flex-col items-center text-gray-800 shadow-xl rounded-2xl">
            <div className="relative mb-4">
                <img
                    src="https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
                    alt="Perfil"
                    className="w-32 h-32 object-cover rounded-full border-2 border-emerald-400"
                />
                <label className="absolute bottom-2 right-2 bg-emerald-500 text-white rounded-full p-2 cursor-pointer hover:bg-emerald-600 transition-all shadow-lg">
                    📤
                    <input type="file" accept="image/*" className="hidden" />
                </label>
            </div>

            <div className="text-center w-full">
                <div className="mb-2">
                    <p className="text-xl text-red-900 font-semibold">Nombre</p>
                    <p className="text-lg font-medium">{user?.nombreAdministrador || user?.nombreDocente}</p>
                </div>
                <div>
                    <p className="text-xl text-red-900 font-semibold">Correo</p>
                    <p className="text-lg font-medium">{user?.email || user?.emailDocente}</p>
                </div>
            </div>
        </div>
    )
}
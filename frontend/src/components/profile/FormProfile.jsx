import { useEffect } from "react"
import storeProfile from "../../context/storeProfile"
import { useForm } from "react-hook-form"

const FormularioPerfil = () => {
    const { user, updateProfile } = storeProfile()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const updateUser = async(data) => {
        updateProfile(data,user._id, user.rol)
    }

    useEffect(() => {
        if (user) {
            reset({
            nombreAdministrador: user?.nombreDocente || user?.nombreAdministrador,
            email: user?.emailDocente || user?.email,
            })

        }
    }, [user])

    return (
        <form onSubmit={handleSubmit(updateUser)}>
            <div>
                <label className="mb-4 block text-sm font-semibold">Nombre</label>
                <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("nombreAdministrador", { required: "El nombre es obligatorio" })}
                />
                {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                <input
                    type="email"
                    placeholder="Ingresa tu correo"
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("email", { required: "El correo es obligatorio" })}
                />
                {errors.email && <p className="text-red-800">{errors.email.message}</p>}

            </div>

            <input
                type="submit"
                className="bg-red-900 w-full p-2 mt-5 text-white font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all"
                value="Actualizar"
            />
        </form>
    );
};

export default FormularioPerfil;

import { Link } from 'react-router'
import useFetch from '../hooks/useFetch'
import { useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'

export const Forgot = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { fetchDataBackend } = useFetch()

  const sendMail = (data) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`
    fetchDataBackend(url, data, 'POST')
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://png.pngtree.com/background/20240122/original/pngtree-college-students-doing-homework-in-library-reading-literature-information-photo-picture-image_7382984.jpg')`
      }}
    >
      {/* Overlay oscuro semi-transparente */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Contenedor blanco con contenido */}
      <div className="relative bg-white rounded-2xl p-10 max-w-md w-full mx-4 shadow-lg z-10">
        <ToastContainer />

        <h1 className="text-3xl font-semibold mb-6 text-center text-red-900">
          ¿Olvidaste tu contraseña?
        </h1>

        <form onSubmit={handleSubmit(sendMail)}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Ingresa tu correo electrónico para restablecerla
            </label>
            <input
              type="email"
              placeholder="Correo electrónico..."
              className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 text-gray-700"
              {...register('email', { required: 'El correo electrónico es obligatorio' })}
            />
            {errors.email && (
              <p className="text-red-700 mt-1 text-sm">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-red-900 text-white border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-black hover:text-white"
          >
            Enviar correo
          </button>
        </form>

        <div className="mt-6 text-sm flex justify-between items-center">
          <p>¿Ya posees una cuenta?</p>
          <Link
            to="/login"
            className="py-2 px-5 bg-red-900 text-white border rounded-xl hover:scale-110 duration-300 hover:bg-black hover:text-white"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

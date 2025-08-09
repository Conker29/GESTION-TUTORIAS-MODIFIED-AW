import estudiantes from '../assets/estudiantes.webp'
import imgEstudiante from '../assets/imgEstudiante.jpg'
import logoEPN from '../assets/logoEPN.svg';
import logoESFOT from '../assets/logoEsfot.png';
import { Link } from 'react-router';
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

export const Home = () => {
    return (
        <>
            <header className="
                w-full
                py-4 px-4 
                flex items-center justify-between 
                md:py-2 md:px-6 shadow-md
                bg-gray-100
            ">
                {/* Contenedor para los logos */}
                <div className="flex items-center space-x-2"> 
                    <img src={logoEPN} alt="Logo EPN" className='w-25 h-auto' />  
                    <img src={logoESFOT} alt="Logo ESFOT" className='w-30 h-auto' /> 
                </div>
                
                {/* Botón de LOGIN a la derecha */}
                <Link 
                    to="/login" 
                    href="#" 
                    className='
                        block                   
                        bg-red-900             
                        w-32        
                        py-2                    
                        text-white              
                        rounded-2xl             
                        text-center             
                        hover:bg-black       
                        transition-colors duration-300 
                    '
                >
                    Iniciar sesión
                </Link>
            </header>

            {/* MAIN con la imagen de fondo y texto de bienvenida */}
            <main 
                className='
                    relative flex flex-col items-center justify-center min-h-screen
                    text-center          
                    py-12 px-8           
                    bg-cover bg-center   
                    md:flex-row          
                    md:text-left         
                    md:py-8
                '
                style={{ backgroundImage: `url(${estudiantes})` }} 
            >
                {/* Overlay encima del fondo grande */}
                <div className='absolute inset-0 bg-black opacity-80'></div> 

                {/* Contenido Principal (Texto de bienvenida) */}
                <div className='relative z-10 text-white md:w-1/2'> 
                    <h1 className='text-center font-lato font-extrabold text-4xl my-4 md:text-6xl'>
                        Bienvenido!
                    </h1>
                    <p className='text-center text-2xl my-6 font-sans'>
                        Mediante esta plataforma puedes agendar una tutoría con el docente de tu preferencia.
                    </p>
                </div>
            </main>

                <section className='container mx-auto px-4'>

                    <div className='container mx-auto relative mt-6'>
                        <h2 className='font-extrabold text-3xl relative z-1 w-50 text-center mx-auto bg-white text-red-900 '>Nosotros</h2>
                        <div className='text-blue-900 border-1 absolute top-1/2 w-full z-0' />
                    </div>

                    <div className='my-10 flex flex-col gap-10 items-center sm:flex-row sm:justify-around sm:items-center'>

                        <div className='sm:w-1/2'>
                            <img src={imgEstudiante} alt="imagenEstudiante" className='w-full h-full object-cover' />
                        </div>

                        <div className='px-10 sm:w-1/2'>
                            <p className='my-2 text-xl'>
                                Con nuestra plataforma, los estudiantes de nivelación y primer semestre pueden agendar una tutoría con el docente de su preferencia, revisando su disponibilidad 
                                en tiempo real y evitando cruces de horarios con otros estudiantes.
                            </p>

                            <p className='my-4 text-2xl font-semibold text-red-900'>Servicios</p>
                            
                            <ul className='space-y-2 list-disc list-inside text-black'> 
                                <li className='text-xl'>Agendamiento en línea</li>
                                <li className='text-xl'>Notificaciones y recordatorios automáticos</li>
                                <li className='text-xl'>Historial de tutorías para seguimiento</li>
                                <li className='text-xl'>Acceso desde cualquier dispositivo</li>
                            </ul>
                        </div>
                    </div>
                </section>


            <section className='container mx-auto px-4'>
                <div className='container mx-auto relative mt-6'>
                    <h2 className='font-extrabold text-3xl relative z-10 w-fit px-4 text-center mx-auto bg-white text-red-900 tracking-wider'>
                        Dudas Frecuentes
                    </h2>
                    <div className='border-t-2 border-blue-900 absolute top-1/2 w-full z-0' />
                </div>

                <div className="my-10 grid gap-8">
                    {/* Pregunta 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                        <h4 className="text-lg font-bold text-blue-900 mb-2">
                        ¿Cómo agendo una tutoría?
                        </h4>
                        <p className="text-gray-600">
                        Solo inicia sesión con tu correo institucional y en la sección Mis Tutorías haz clic en Agendar Tutoría, elige el docente y horario disponible.
                        El sistema bloquea automáticamente ese espacio para evitar choques con otros estudiantes.
                        </p>
                    </div>

                    {/* Pregunta 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                        <h4 className="text-lg font-bold text-blue-900 mb-2">
                        Si no asistí a mi tutoría... ¿Puedo reprogramar mi cita?
                        </h4>
                        <p className="text-gray-600">
                        Sí, puedes modificar la fecha u hora de acuerdo a la disponibilidad de horarios del docente.
                        </p>
                    </div>

                    {/* Pregunta 3 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                        <h4 className="text-lg font-bold text-blue-900 mb-2">
                        ¿Cuánto tiempo dura una tutoría?
                        </h4>
                        <p className="text-gray-600">
                        40 minutos, dependiendo del docente.
                        </p>
                    </div>

                    {/* Pregunta 4 */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                        <h4 className="text-lg font-bold text-blue-900 mb-2">
                        ¿Puedo agendar con más de un docente?
                        </h4>
                        <p className="text-gray-600">
                        Sí, siempre que respetes la disponibilidad de cada docente y no reserves en el mismo horario con dos diferentes.
                        </p>
                    </div>
                </div>

            </section>

            <footer className='text-center bg-gray-50 p-6 sm:px-20 sm:py-10 mt-20 rounded-tr-3xl rounded-tl-3xl space-y-8'>

                <div className='flex justify-between items-center'>
        
                    <div className='text-left'>
                    <p className='text-3xl font-extrabold text-red-900'>Contacto</p>
                    <p className='text-xl my-4'>Para cualquier duda o comentario, envía un email a: tutorias.esfot@gmail.com</p>
                    </div>
                    <ul className='flex gap-4'>
                        <li><FaFacebook className='text-2xl' /></li>
                        <li><FaSquareInstagram className='text-2xl' /></li>
                        <li><FaXTwitter className='text-2xl' /></li>
                    </ul>
                </div>

                <hr className='border-1 border-blue-800' />

                <p className='font-semibold'>
                    Copyright 2025 © - Tutorías ESFOT
                </p>
            </footer>
        </>
    )
}

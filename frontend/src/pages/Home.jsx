import estudiantes from '../assets/estudiantes.webp'
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
<<<<<<< HEAD
                        w-32        
=======
                        w-32                    {/* Ancho ligeramente más pequeño para la cabecera */}
>>>>>>> 3c794791b03dba7db6f48e2d5c4e7d2a56d46f9b
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
                        Bienvenido a la plataforma
                    </h1>
                    <p className='text-center text-2xl my-6 font-sans'>
                        Agenda una cita con tu tutor académico de acuerdo a su disponibilidad aquí
                    </p>
                </div>
            </main>

            <footer className='text-center bg-gray-50 p-6 sm:px-20 sm:py-10 mt-20 rounded-tr-3xl rounded-tl-3xl space-y-8'>

                <div className='flex justify-between items-center'>
                    <div className='text-left'>
                    <p className='text-3xl font-extrabold text-amber-800'>Contacto</p>
                        <p className='font-bold my-2'>Email: tutorias.esfot@gmail.com</p>
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

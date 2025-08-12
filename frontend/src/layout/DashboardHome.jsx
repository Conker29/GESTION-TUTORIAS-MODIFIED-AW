import storeProfile from '../context/storeProfile';
import { FaFilePdf } from 'react-icons/fa'; // Importa el ícono de PDF

const DashboardHome = () => {
    const { user } = storeProfile();
    const nombreUsuario = user?.nombreAdministrador || user?.nombreDocente || user?.nombreEstudiante;

    return (
        <div className="p-8">
            <h1 className='font-black text-4xl text-red-900'>¡Hola, {nombreUsuario}!</h1>
            <p className='text-gray-600 mt-2'>¡Aquí tienes las noticias y actualizaciones más recientes.</p>
            <hr className='my-4 border-gray-300'/>
            
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-2xl font-bold text-gray-800">Noticias y recordatorios de la Semana</h2>
                <p className="text-gray-700 mt-4">
                    - El cierre del saew es el 21 de agosto. 
                </p>
                <p className="text-gray-700 mt-2">
                    - Las calificaciones solo pueden ser subidas al sistema hasta el 12 de agosto.
                </p>
                <p className="text-gray-700 mt-2">
                    - El control de documentos de los estudiantes es hasta el miercoles 13 de agosto.
                </p>
            </div>
            
            {/* ----- SECCIÓN: Calendario Académico para visualizar ----- */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-2xl font-bold text-gray-800">Ver Calendarios Académicos</h2>
                <p className="text-gray-700 italic mt-2">
                    Haz clic aquí para ver el calendario académico
                </p>
                
                <div className="flex space-x-4 mt-4">
                    {/* Enlace para el calendario 2025 A */}
                    <a
                        href="/Calendario-Academico-2025A.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FaFilePdf className="mr-2 h-4 w-4" />
                        Calendario 2025 A
                    </a>

                    {/* Enlace para el calendario 2025 B */}
                    <a
                        href="/Calendario-Academico-2025B.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <FaFilePdf className="mr-2 h-4 w-4" />
                        Calendario 2025 B
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
import storeProfile from '../context/storeProfile';
import { CardProfileDocente } from '../components/profile/CardProfileDocente';
import CardProfileEstudiante from '../components/profile/CardProfileEstudiante';
import { CardProfile } from '../components/profile/CardProfile';

const Profile = () => {
    const { user } = storeProfile();
    const rol = user?.rol;

    const renderProfileCard = () => {
        if (rol === "Docente") {
            return <CardProfileDocente />;
        } else if (rol === "Estudiante") {
            return <CardProfileEstudiante />;
        } else if (rol === "Administrador") {
            return <CardProfile />;
        }
        return <p>Cargando perfil...</p>;
    };

    if (!user) {
        return <p>Cargando perfil...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className='font-black text-4xl text-red-900'>Perfil de {rol}</h1>
            <hr className='my-4 border-gray-300'/>
            <p className='mb-8'>Aquí puedes ver y gestionar la información básica de tu perfil.</p>
            
            <div className='flex justify-center'>
                {renderProfileCard()}
            </div>
        </div>
    );
};

export default Profile;
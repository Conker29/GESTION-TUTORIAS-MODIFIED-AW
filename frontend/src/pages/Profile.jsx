import { CardProfileDocente } from '../components/profile/CardProfileDocente';
import CardProfileEstudiante from '../components/profile/CardProfileEstudiante';
import CardPassword from '../components/profile/CardPassword';
import { CardProfile } from '../components/profile/CardProfile';
import FormProfile from '../components/profile/FormProfile';
import storeProfile from '../context/storeProfile';

const Profile = () => {
  const { user} = storeProfile();
  const rol = user?.rol;
  return (
    <>       
      <div>
        <h1 className='font-black text-4xl text-red-900'>Perfil</h1>
        <hr className='x'/>
        <p className='mb-8'>Este módulo permite gestionar el perfil del usuario.</p>
      </div>

      {rol === "Docente" ? (
        <CardProfileDocente />
      ) : rol === "Estudiante" ? (
        <CardProfileEstudiante />
      ) : (
        <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
          <div className='w-full md:w-1/2'>
            <FormProfile />
          </div>
          <div className='w-full md:w-1/2'>
            <CardProfile />
            <CardPassword />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;

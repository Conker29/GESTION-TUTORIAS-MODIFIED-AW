import React from 'react';
import FormProfile from '../components/profile/FormProfile';
import CardPassword from '../components/profile/CardPassword';
import storeProfile from '../context/storeProfile';

const Settings = () => {
    const { user } = storeProfile();
    const rol = user?.rol;
    
    // Si el rol es estudiante, no tiene un formulario de actualización de nombre/email
    // pero si tiene para cambiar la contraseña
    // Esto es solo un ejemplo, puedes adaptarlo a tu lógica de negocio
    if (rol === "Estudiante") {
        return (
            <div className="container mx-auto p-4">
                <h1 className='font-black text-4xl text-red-900'>Configuración</h1>
                <hr className='my-4 border-gray-300'/>
                <p className='mb-8'>Aquí puedes actualizar la contraseña de tu cuenta.</p>
                <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                    <div className='w-full md:w-1/2'>
                        <CardPassword />
                    </div>
                </div>
            </div>
        );
    }
    
    // Para roles como Administrador o Docente, que tienen formulario de datos y de contraseña
    return (
        <div className="container mx-auto p-4">
            <h1 className='font-black text-4xl text-red-900'>Configuración</h1>
            <hr className='my-4 border-gray-300'/>
            <p className='mb-8'>Aquí puedes actualizar tus datos y contraseña de cuenta.</p>
            
            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                <div className='w-full md:w-1/2'>
                    <FormProfile />
                </div>
                <div className='w-full md:w-1/2'>
                    <CardPassword />
                </div>
            </div>
        </div>
    );
};

export default Settings;
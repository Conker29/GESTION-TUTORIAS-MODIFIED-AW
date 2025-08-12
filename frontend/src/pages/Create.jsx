import { Form } from '../components/create/Form'

const Create = () => {
    return (
        <div>
            <h1 className='font-semibold text-4xl text-red-900'>Panel de Gestión de Docentes</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8 text-gray-500 italic'>Este módulo está dedicado a la gestión de docentes. Por favor, 
                complete los campos del formulario.
            </p>
            <Form />
        </div>
    )
}

export default Create
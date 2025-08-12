import Table from "../components/list/Table"

const List = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-red-900'>Gestión de Docentes</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8 text-gray-600 italic'>Este módulo permite ver/listar todos los docentes creados en el semestre.</p>
            <Table/>
        </div>
    )
}

export default List
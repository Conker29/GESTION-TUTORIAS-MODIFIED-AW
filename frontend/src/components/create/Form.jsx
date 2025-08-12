import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

export const Form = ({ docente }) => {
  const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
  const { fetchDataBackend } = useFetch();

  const asignaturasporSemestre = {
    "Nivelacion": [
      {codigo: "CNTSR030", nombre: "Física"}, 
      {codigo: "CNTSR010", nombre: "Fundamentos de Matemática"},
      {codigo:"CNTSR040", nombre: "Química"}, 
      {codigo: "CNICR050", nombre: "Lenguaje y Comunicación"},
      {codigo: "CNTSR020", nombre: "Geometria"}
    ],
    "Primer Semestre": [
      {codigo: "FISD113", nombre: "Física"}, 
      {codigo: "MATD143", nombre: "Cálculo diferencial e integral"}, 
      {codigo: "MATD153", nombre: "Estadística y Probabilidad Básica"},
      {codigo: "ICOD142", nombre: "Introducción a las TIC"}, 
      {codigo: "CSHD111", nombre: "Comunicación Oral y Escrita"}, 
      {codigo: "ADMD163", nombre: "Administración financiera"}
    ]
  };

  const semestreSeleccionado = watch("semestreAsignado");
  const emailDocente = watch("emailDocente");

  useEffect(() => {
    setAsignaturasSeleccionadas([]);
  }, [semestreSeleccionado]);

  useEffect(() => {
    if (docente) {
      reset({
        cedulaDocente: docente.cedulaDocente,
        nombreDocente: docente.nombreDocente,
        fechaNacimientoDocente: new Date(docente.fechaNacimientoDocente).toISOString().split("T")[0],
        emailDocente: docente.emailDocente,
        emailAlternativoDocente: docente.emailAlternativoDocente,
        celularDocente: docente.celularDocente,
        oficinaDocente: docente.oficinaDocente,
        semestreAsignado: docente.semestreAsignado || "",
      });

      setAsignaturasSeleccionadas(docente.asignaturas || []);
      setImagenPreview(docente.imagenUrl || null);
    }
  }, [docente, reset]);

  const toggleAsignatura = (asignatura) => {
    const nombre = asignatura.nombre;
    setAsignaturasSeleccionadas((prev) =>
      prev.includes(nombre)
        ? prev.filter((a) => a !== nombre)
        : [...prev, nombre]
    );
  };

  const registerDocente = async (data) => {
    // Validación extra antes de enviar
    if (data.emailDocente === data.emailAlternativoDocente) {
      toast.error("El correo institucional y el correo alternativo no pueden ser iguales.");
      return;
    }

    const formData = new FormData();

    if (data.imagen?.[0]) {
      formData.append("imagen", data.imagen[0]);
    }

    Object.keys(data).forEach((key) => {
      if (key !== "imagen") {
        formData.append(key, data[key]);
      }
    });

    formData.append("asignaturas", JSON.stringify(asignaturasSeleccionadas));

    const storedUser = JSON.parse(localStorage.getItem("auth-token"));
    const headers = {
      Authorization: `Bearer ${storedUser.state.token}`,
    };

    const url = docente?._id
      ? `${import.meta.env.VITE_BACKEND_URL}/docente/actualizar/${docente._id}`
      : `${import.meta.env.VITE_BACKEND_URL}/docente/registro`;

    const method = docente?._id ? "PUT" : "POST";

    const response = await fetchDataBackend(url, formData, method, headers);
    if (response) {
      setTimeout(() => navigate("/dashboard/listar"), 2000);
    }
  };

  // Vista previa de la imagen seleccionada
  const selectedFile = watch("imagen")?.[0];
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagenPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  return (
    <section className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4">
        {docente ? "Actualizar Docente" : "Registrar Docente"}
      </h2>

      <form onSubmit={handleSubmit(registerDocente)} className="space-y-6">
        <ToastContainer />

        {/* Cédula */}
        <div>
          <label className="block text-sm font-semibold mb-2">Cédula</label>
          <input
            type="text"
            className="block w-full border rounded px-3 py-2"
            placeholder="Ingrese la cédula del docente..."
            {...register("cedulaDocente", { required: "Campo obligatorio" })}
            disabled={!!docente}
          />
          {errors.cedulaDocente && <p className="text-red-800 text-sm">{errors.cedulaDocente.message}</p>}
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold mb-2">Nombre completo</label>
          <input
            type="text"
            className="block w-full border rounded px-3 py-2"
            placeholder="Ingrese el nombre del docente..."
            {...register("nombreDocente", { required: "Campo obligatorio" })}
          />
          {errors.nombreDocente && <p className="text-red-800 text-sm">{errors.nombreDocente.message}</p>}
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label className="block text-sm font-semibold mb-2">Fecha de nacimiento</label>
          <input
            type="date"
            className="block w-full border rounded px-3 py-2"
            {...register("fechaNacimientoDocente", { required: "Campo obligatorio" })}
          />
          {errors.fechaNacimientoDocente && <p className="text-red-800 text-sm">{errors.fechaNacimientoDocente.message}</p>}
        </div>

        {/* Correo institucional */}
        <div>
          <label className="block text-sm font-semibold mb-2">Correo institucional</label>
          <input
            type="email"
            className="block w-full border rounded px-3 py-2"
            placeholder="Ingrese el correo del docente..."
            {...register("emailDocente", { required: "Campo obligatorio" })}
          />
          {errors.emailDocente && <p className="text-red-800 text-sm">{errors.emailDocente.message}</p>}
        </div>

        {/* Correo alternativo */}
        <div>
          <label className="block text-sm font-semibold mb-2">Correo alternativo</label>
          <input
            type="email"
            className="block w-full border rounded px-3 py-2"
            placeholder="Ingrese un correo alternativo..."
            {...register("emailAlternativoDocente", {
              required: "Campo obligatorio",
              validate: value => value !== emailDocente || "El correo alternativo no puede ser igual al correo institucional"
            })}
          />
          {errors.emailAlternativoDocente && <p className="text-red-800 text-sm">{errors.emailAlternativoDocente.message}</p>}
        </div>

        {/* Celular */}
        <div>
          <label className="block text-sm font-semibold mb-2">Celular</label>
          <input
            type="text"
            className="block w-full border rounded px-3 py-2"
            placeholder="Ingrese el número de teléfono del docente."
            {...register("celularDocente", { required: "Campo obligatorio" })}
          />
          {errors.celularDocente && <p className="text-red-800 text-sm">{errors.celularDocente.message}</p>}
        </div>

        {/* Oficina */}
        <div>
          <label className="block text-sm font-semibold mb-2">Oficina</label>
          <select
            className="block w-full border rounded px-3 py-2"
            {...register("oficinaDocente", { required: "Campo obligatorio" })}
          >
            <option value="">Seleccione una opción</option>
            <option value="Oficina 1 ESFOT">Oficina 1 ESFOT</option>
            <option value="Oficina 2 ESFOT">Oficina 2 ESFOT</option>
            <option value="Oficina 3 ESFOT">Oficina 3 ESFOT</option>
          </select>
          {errors.oficinaDocente && <p className="text-red-800 text-sm">{errors.oficinaDocente.message}</p>}
        </div>

        {/* Semestre Asignado */}
        <div>
          <label className="block text-sm font-semibold mb-2">Semestre Asignado</label>
          <select
            className="block w-full border rounded px-3 py-2"
            {...register("semestreAsignado", { required: "Campo obligatorio" })}
          >
            <option value="">Seleccione una opción</option>
            <option value="Nivelacion">Nivelación</option>
            <option value="Primer Semestre">Primer Semestre</option>
          </select>
          {errors.semestreAsignado && <p className="text-red-800 text-sm">{errors.semestreAsignado.message}</p>}
        </div>

        {/* Asignaturas */}
        {(asignaturasporSemestre[semestreSeleccionado]?.length > 0) && (
          <div>
            <label className="block text-sm font-semibold mb-2">Asignaturas</label>
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Seleccionar</th>
                  <th className="text-left p-2">Código de la Asignatura</th>
                  <th className="text-left p-2">Nombre de la asignatura</th>
                </tr>
              </thead>
              <tbody>
                {asignaturasporSemestre[semestreSeleccionado].map((asignatura) => (
                  <tr key={asignatura.codigo} className="border-t">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={asignaturasSeleccionadas.includes(asignatura.nombre)}
                        onChange={() => toggleAsignatura(asignatura)}
                      />
                    </td>
                    <td className="p-2">{asignatura.codigo}</td>
                    <td className="p-2">{asignatura.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Imagen */}
        <div>
          <label className="block text-sm font-semibold mb-2">Foto del docente</label>
          {imagenPreview && (
            <img src={imagenPreview} alt="Vista previa" className="w-32 h-32 object-cover mb-2 rounded border" />
          )}
          <input
            type="file"
            accept="image/*"
            className="block w-full border rounded px-3 py-2"
            {...register("imagen", {
              required: !docente && "Debe subir una imagen"
            })}
          />
          {errors.imagen && <p className="text-red-800 text-sm">{errors.imagen.message}</p>}
        </div>

        {/* Botón */}
        <input
          type="submit"
          className="bg-red-800 text-white w-full py-2 rounded-md font-semibold hover:bg-amber-700"
          value={docente ? "Actualizar" : "Registrar"}
        />
      </form>
    </section>
  );
};

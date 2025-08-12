import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const getAuthHeaders = (isFormData = false) => {
  const storedUser = JSON.parse(localStorage.getItem("auth-token"));
  return {
    headers: {
      Authorization: `Bearer ${storedUser?.state?.token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  };
};

const storeProfile = create((set) => ({
  user: JSON.parse(localStorage.getItem("user-profile")) || null,
  clearUser: () => set({ user: null }),

  profile: async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"));
      let endpoint = ''
      if (storedUser.state.rol === "Administrador") {
        endpoint = "perfil"
      } 
      else if (storedUser.state.rol === "Docente") {
        endpoint = "docente/perfil"}
      else if (storedUser.state.rol === "Estudiante") {
        endpoint = "estudiante/perfil"
      }
      
      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`;

      const respuesta = await axios.get(url, getAuthHeaders());
      // Normalizar user para que siempre tenga rol
      const data = respuesta.data;
      const userConRol = {
      ...data,
      rol: data.rol || storedUser.state.rol || "Estudiante",
      };
      set({ user: userConRol });
    } catch (error) {
      console.log(error);
    }
  },

  updateProfile: async (data, id, rol) => {
  try {
    let endpoint = "";
    if (rol === "Administrador") endpoint = "administrador";
    else if (rol === "Docente") endpoint = "docente/actualizar";
    else if (rol === "Estudiante") endpoint = "estudiante";
    else throw new Error("Rol inválido para actualizar perfil");

    const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/${id}`;
    const respuesta = await axios.put(url, data, getAuthHeaders());

    // Actualizar estado user con los datos actualizados según rol
    let userActualizado = respuesta.data;
    if (rol === "Administrador") {
      userActualizado = respuesta.data.administrador || respuesta.data;
    } else if (rol === "Docente") {
      userActualizado = respuesta.data.docente || respuesta.data;
    } else if (rol === "Estudiante") {
      userActualizado = respuesta.data.estudiante || respuesta.data;
    }

    set({ user: userActualizado });

    toast.success("Perfil actualizado correctamente");
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.msg || "Error al actualizar perfil");
  }
},

  updatePasswordProfile: async (data, id) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/administrador/actualizarpassword/${id}`;
      const respuesta = await axios.put(url, data, getAuthHeaders());
      toast.success(respuesta?.data?.msg);
      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
    }
  },

  updatePhotoProfile: async (file, id, rol) => {
  try {
    // Definir endpoint según rol
    let endpoint = '';
    console.log("ROL recibido en updatePhotoProfile:", rol);
    if (rol === "Administrador") {
      endpoint = "administrador";
    } else if (rol === "Docente") {
      endpoint = "docente/actualizar";
    } else if (rol === "Estudiante") {
      endpoint = "estudiante";
    } else {
      throw new Error("Rol inválido para actualizar foto");
    }
    const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/${id}`;
    const formData = new FormData();
    formData.append("imagen", file);

    const respuesta = await axios.put(url, formData, getAuthHeaders(true));

    // Actualizar el estado con la nueva foto, adaptando según rol
    const prevUser = JSON.parse(localStorage.getItem("user-profile")) || {};
    let userActualizado = respuesta.data;
    if (rol === "Administrador") {
      userActualizado = { ...prevUser, ...(respuesta.data.administrador || respuesta.data) };
    } else if (rol === "Docente") {
      userActualizado = { ...prevUser, ...(respuesta.data.docente || respuesta.data) };
    } else if (rol === "Estudiante") {
      userActualizado = { ...prevUser, ...(respuesta.data.estudiante || respuesta.data) };
    }

    set({ user: userActualizado });
    localStorage.setItem("user-profile", JSON.stringify(userActualizado));

    toast.success("Foto de perfil actualizada correctamente");

    return userActualizado;

  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.msg || "Error al actualizar la foto");
  }
}

}));

export default storeProfile;

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
  user: null,

  clearUser: () => set({ user: null }),

  profile: async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"));
      const endpoint =
        storedUser.state.rol === "Administrador" ? "perfil" : "docente/perfil";
      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`;

      const respuesta = await axios.get(url, getAuthHeaders());
      set({ user: respuesta.data });
    } catch (error) {
      console.log(error);
    }
  },

  updateProfile: async (data, id) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/administrador/${id}`;
      const respuesta = await axios.put(url, data, getAuthHeaders());
      set({ user: respuesta.data });
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
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

  // Nuevo método para actualizar foto de perfil
  updatePhotoProfile: async (file, id) => {
  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}/administrador/${id}`;
    const formData = new FormData();
    formData.append("imagen", file);

    const respuesta = await axios.put(url, formData, getAuthHeaders(true));
    
    // Actualizar el estado con la nueva foto
    set({ user: respuesta.data.administrador || respuesta.data }); 
    
    toast.success("Foto de perfil actualizada correctamente");

    return respuesta.data;

  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.msg || "Error al actualizar la foto");
  }
}
}));

export default storeProfile;

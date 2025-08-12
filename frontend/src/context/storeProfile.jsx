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

// Función para normalizar el usuario
const normalizarUsuario = (userRaw, rol) => {
  return {
    ...userRaw,
    rol,
    nombre:
      rol === "Administrador"
        ? userRaw.nombreAdministrador || ""
        : rol === "Docente"
        ? userRaw.nombreDocente || ""
        : rol === "Estudiante"
        ? userRaw.nombreEstudiante || ""
        : "",
    fotoPerfil:
      rol === "Administrador"
        ? userRaw.fotoPerfilAdmin || ""
        : rol === "Docente"
        ? userRaw.avatarDocente || ""
        : rol === "Estudiante"
        ? userRaw.fotoPerfil || ""
        : "",
  };
};

const storeProfile = create((set) => ({
  user: (() => {
    const saved = JSON.parse(localStorage.getItem("user-profile"));
    if (!saved) return null;
    // Intentamos normalizar en caso de que venga sin normalizar
    return normalizarUsuario(saved, saved.rol || "Estudiante");
  })(),

  clearUser: () => set({ user: null }),

  profile: async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"));
      const rol = storedUser?.state?.rol || "Estudiante";
      let endpoint = "";
      if (rol === "Administrador") endpoint = "perfil";
      else if (rol === "Docente") endpoint = "docente/perfil";
      else if (rol === "Estudiante") endpoint = "estudiante/perfil";

      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`;
      const respuesta = await axios.get(url, getAuthHeaders());
      const data = respuesta.data;

      const userNormalizado = normalizarUsuario(data, rol);
      set({ user: userNormalizado });
      localStorage.setItem("user-profile", JSON.stringify(userNormalizado));
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

      let userActualizadoRaw = respuesta.data;
      if (rol === "Administrador") {
        userActualizadoRaw = respuesta.data.administrador || respuesta.data;
      } else if (rol === "Docente") {
        userActualizadoRaw = respuesta.data.docente || respuesta.data;
      } else if (rol === "Estudiante") {
        userActualizadoRaw = respuesta.data.estudiante || respuesta.data;
      }

      const userNormalizado = normalizarUsuario(userActualizadoRaw, rol);

      set({ user: userNormalizado });
      localStorage.setItem("user-profile", JSON.stringify(userNormalizado));

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
      let endpoint = "";
      if (rol === "Administrador") endpoint = "administrador";
      else if (rol === "Docente") endpoint = "docente/actualizar";
      else if (rol === "Estudiante") endpoint = "estudiante";
      else throw new Error("Rol inválido para actualizar foto");

      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/${id}`;
      const formData = new FormData();
      formData.append("imagen", file);

      const respuesta = await axios.put(url, formData, getAuthHeaders(true));

      let userActualizadoRaw = respuesta.data;
      if (rol === "Administrador") {
        userActualizadoRaw = { ...JSON.parse(localStorage.getItem("user-profile")), ...(respuesta.data.administrador || respuesta.data) };
      } else if (rol === "Docente") {
        userActualizadoRaw = { ...JSON.parse(localStorage.getItem("user-profile")), ...(respuesta.data.docente || respuesta.data) };
      } else if (rol === "Estudiante") {
        userActualizadoRaw = { ...JSON.parse(localStorage.getItem("user-profile")), ...(respuesta.data.estudiante || respuesta.data) };
      }

      const userNormalizado = normalizarUsuario(userActualizadoRaw, rol);

      set({ user: userNormalizado });
      localStorage.setItem("user-profile", JSON.stringify(userNormalizado));

      toast.success("Foto de perfil actualizada correctamente");

      return userNormalizado;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Error al actualizar la foto");
    }
  },
}));

export default storeProfile;

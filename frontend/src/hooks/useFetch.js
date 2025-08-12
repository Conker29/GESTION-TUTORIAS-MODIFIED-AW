import axios from "axios";
import { toast } from "react-toastify";

function useFetch() {
    const fetchDataBackend = async (url, data = null, method = "GET", headers = {}) => {
        const loadingToast = toast.loading("Procesando solicitud...");
        try {
            // Crear headers inicial sin "Content-Type"
            let finalHeaders = { ...headers };
            
            // Si NO es FormData, agregar Content-Type json
            if (!(data instanceof FormData)) {
                finalHeaders["Content-Type"] = "application/json";
            }
            const options = {
                method: typeof method === 'string' ? method.toLowerCase() : 'get',
                url,
                headers: finalHeaders,
                data,
            };
            const response = await axios(options);
            toast.dismiss(loadingToast);
            toast.success(response?.data?.msg);
            return response?.data;
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error(error);
            toast.error(error.response?.data?.msg || "Error en la solicitud");
        }
    };

    return { fetchDataBackend };
}

export default useFetch;
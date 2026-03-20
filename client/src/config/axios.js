import axios from "axios";

const API_URL = import.meta.env.VITE_API;

// Default config  
axios.defaults.baseURL = API_URL;

// Intercepted Axios instance config
const authAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

authAxios.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response.status === 401) {
            try {
                const refreshedSession = await refreshUser();
                // console.log("What's inside refreshedSession =>", refreshedSession)
                if (!refreshedSession.success) {
                    throw refreshedSession;
                }

                // Retry original request with same config if refresh successful
                const originalRequest = err.config;
                if (!originalRequest) throw new Error();
                return await axios(originalRequest);
            }
            catch (validationErr) {
                return Promise.reject(validationErr);
            }
        }
        return Promise.reject(err);
    }
);

export default authAxios;
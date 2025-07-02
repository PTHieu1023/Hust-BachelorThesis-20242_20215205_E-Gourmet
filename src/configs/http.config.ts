import axios from "axios";
import { getAuthSession } from "@/configs/auth.config";

const httpClient = axios.create({
    withCredentials: true,
});

// Add a request interceptor to attach the token
httpClient.interceptors.request.use(
    async (config) => {
        const session = await getAuthSession();
        const token = session?.access_token;
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error: Error) => Promise.reject(error)
);

export function getUrl(path: string): string {
    return `${process.env.SERVICES_API_URL}${path}`;
}

export default httpClient;
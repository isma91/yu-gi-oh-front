import { RejectPromise } from "@utils/SimplePromise";
import axios from "axios";


const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
const NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY = process.env.NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY as string;
const Api = axios.create({
    baseURL: NEXT_PUBLIC_API_BASE_URL,
});

Api.interceptors.request.use((config) => {
    const isProtected = config.protected !== undefined;
    if (isProtected === true) {
        delete config.protected;
        const jwt = localStorage.getItem(NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY);
        if (jwt !== null) {
            config.headers.Authorization = "Bearer " + jwt;
        }
    }
    config.headers["Content-Type"] = "multipart/form-data";
    return config;
});

Api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (typeof error.response === "undefined") {
            return RejectPromise({ error: "We are unable to communicate with the server, do not hesitate to write to the administration." });
        }
        const httpCode = error.response.status;
        let errorData = null;
        switch (httpCode) {
            case 400:
                errorData = error.response.data;
                break;
            case 401:
                errorData = { error: "An authentication is required to perform this action." };
                break;
            case 403:
                errorData = { error: "Unfortunately, you do not have permission to perform this action." };
                break;
            case 404:
                errorData = { error: "Request not possible." };
                break;
            case 500:
                errorData = { error: "An error has occurred, do not hesitate to write to the administration." };
                break;
            default:
                errorData = error;
                break;
        }
        return RejectPromise(errorData);
    }
);

export default Api;
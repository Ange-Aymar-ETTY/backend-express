import axios, { AxiosError } from "axios"
import _ from 'lodash';
import { CONFIG } from "../config";

interface RequestParams {
    baseURL?: string;
    headers?: {};
    timeout?: number;
    responseType?: string;
}

const axiosInstance = axios.create({
    baseURL: CONFIG.API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

axiosInstance.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        if (_.isEmpty(response.data)) {
            return { error: true, message: 'Aucune donnée retournée.' };
        }

        return response.data;
    },
    (error: AxiosError) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        let response: any = { error: true };
        
        if (error.response) {
            const statusRange = Math.floor(error.response.status / 100);
            switch (statusRange) {
                case 5:
                    response.message = "Erreur serveur.";
                    break;
                case 4:
                    if (error.response.status === 400) {
                        response.message = "Mauvaise requête.";
                    } else {
                        response.message = "URL inaccessible.";
                    }
                    break;
                default:
                    response.message = "Erreur dans le traitement.";
                    break;
            }
        } else {
            // Something happened in setting up the request and triggered an Error
            // It may be network error / Address unreachable
            if (error.message === "Network Error") {
                response.message = "Erreur réseau.";
            }

            if (error.message.search("timeout") > -1) {
                response.message = "La requête a mis trop de temps.";
            }
        }

        return response
    }
);

export class AxiosService {

    constructor(_baseURL?) {
        if (_baseURL) {
            axiosInstance.defaults.baseURL = _baseURL;
        }
    }

    updateConfInstance(config) {
        axiosInstance.interceptors.request.use(onFulfilled => {
            Object.keys(config).forEach(item => {
                if (typeof config[item] == "string" || typeof config[item] == "number") {
                    onFulfilled[item] = config[item];
                } else {
                    onFulfilled[item] = { ...onFulfilled[item], ...config[item] };
                }
            });
            return onFulfilled;
        });
    }

    get(endPoint: string, config?: RequestParams) {
        if (config)
            this.updateConfInstance(config);

        return axiosInstance.get(endPoint)
    }

    post(endPoint: string, data: any, config?: RequestParams) {
        if (config)
            this.updateConfInstance(config);

        return axiosInstance.post(endPoint, data);
    }
}
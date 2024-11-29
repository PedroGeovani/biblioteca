import { getUserToken } from "@/utils/user-storage.utils";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { ToastService } from "@/utils/toast-service.utils";
import { ToastMessageOptions } from "primevue/toast";
import app from "../../main";
import { MessageToasts } from "@/utils/toast-messages.utils";

function apiConfig(baseUrl: string): AxiosRequestConfig {
  return {
    baseURL: baseUrl,
  };
}

function initAxios(config: AxiosRequestConfig, token?: string): AxiosInstance {
  const defineInstance = axios.create(config);
  defineInstance.interceptors.request.use(
    (request) => {
      request.headers.Authorization =
        token ?? `Bearer ${getUserToken()}`;
      return request;
    },
    (error) => {
      app.config.globalProperties.$toast.add(ToastService.error(MessageToasts.ERROR_CONECTION_AXIOS, "Erro") as ToastMessageOptions);
      return Promise.reject(error);
    }
  );

  defineInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      app.config.globalProperties.$toast.add(ToastService.error(MessageToasts.ERROR_RESPONSE_AXIOS, "Erro") as ToastMessageOptions);
      return Promise.reject(error);
    }
  );
  return defineInstance;
}

function api(baseURL = "/api", token?: string) {
  return initAxios(apiConfig(baseURL), token);
}

export default api;

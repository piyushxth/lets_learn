import axios, { AxiosInstance } from "axios";

let axiosInstance: AxiosInstance;

export const useAxios = () => {
  if (axiosInstance) {
    return { axios: axiosInstance };
  }

  axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.log("Authentication required or session expired");
      }

      return Promise.reject(error);
    },
  );

  return { axios: axiosInstance };
};

import axios from "axios";
export const createAxiosInstance = () => {
  const axiosInstance = axios.create({
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const res = await axiosInstance.post(
          "http://localhost:3005/users/refreshToken",
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          localStorage.setItem("accessToken", res.data.accessToken);

          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

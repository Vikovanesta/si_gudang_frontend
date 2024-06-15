// apiClient.ts
import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  // baseURL: "https://pad2.vikovanesta.me/api/v1",
  baseURL: "http://localhost:8000/api/v1",
  timeout: 60000,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-type": "multipart/form-data ",
  },
});

apiClient.interceptors.request.use(
  config => {
    // Get the token
    const token = useCookie('accessToken').value
    // Add the token to the request header if it exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
});

export default apiClient;

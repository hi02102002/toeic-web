import { BASE_URL } from '@/constants';
import axios from 'axios';
const http = axios.create({
   baseURL: BASE_URL,
   withCredentials: true,
});

http.interceptors.request.use(
   function (config) {
      return config;
   },
   function (error) {
      return Promise.reject(error);
   }
);

http.interceptors.response.use(
   function (response) {
      return response;
   },
   function (error) {
      return Promise.reject(error);
   }
);

export { http };

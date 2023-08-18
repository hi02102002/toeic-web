import { BASE_URL } from '@/constants';
import { TBaseResponse } from '@/types';
import axios from 'axios';
import { getCookie } from 'cookies-next';
const http = axios.create({
   baseURL: BASE_URL,
   withCredentials: true,
});

const handleRefreshToken = async (refreshToken: string) => {
   const {
      data,
   }: TBaseResponse<{
      accessToken: string;
      refreshToken: string;
   }> = await axios
      .post(`http://localhost:3000/api/refresh-token`, {
         refreshToken,
      })
      .then((r) => r.data);

   return data;
};

http.interceptors.request.use(
   function (config) {
      const access_token = getCookie('access_token');
      if (access_token) {
         http.defaults.headers.common['Authorization'] =
            'Bearer ' + access_token;
      }
      return config;
   },
   async function (error) {
      return Promise.reject(error);
   }
);

http.interceptors.response.use(
   function (response) {
      return response.data;
   },
   async function (error) {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;

         const refresh_token = getCookie('refresh_token');
         try {
            const data = await handleRefreshToken(refresh_token as string);

            http.defaults.headers.common['Authorization'] =
               'Bearer ' + data.accessToken;
            return http(originalRequest);
         } catch (error) {
            return Promise.reject(error);
         }
      }
      return Promise.reject(error);
   }
);

const httpCallApi = async <T = unknown>(
   url: string,
   accessToken: string,
   query?: any
) => {
   const res: TBaseResponse<T> = await axios
      .get(`${BASE_URL}${url}`, {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         withCredentials: true,
         params: query,
      })
      .then((r) => r.data);

   return res;
};

const http_server = async <T = unknown>(
   {
      accessToken,
      refreshToken,
   }: {
      accessToken: string | undefined;
      refreshToken: string | undefined;
   },
   url: string,
   query?: Record<string, any>
) => {
   try {
      const res = await httpCallApi<T>(url, accessToken as string, query);
      return res;
   } catch (error: any) {
      if (error.response?.status === 401) {
         const data = await handleRefreshToken(refreshToken as string);

         const res = await httpCallApi<T>(url, data.accessToken, query);

         return res;
      }

      return Promise.reject(error);
   }
};
export { http, http_server };

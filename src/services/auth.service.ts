import { http } from '@/libs/axios';
import { TBaseResponse, TUser } from '@/types';
import axios from 'axios';

export class AuthService {
   async login(values: { email: string; password: string }) {
      const {
         message,
         data,
      }: TBaseResponse<{
         accessToken: string;
         refreshToken: string;
      }> = await axios
         .post('/api/login', values, {
            withCredentials: true,
         })
         .then((r) => r.data);

      return { message, data };
   }

   async loginSocial(
      values: Pick<TUser, 'avatar' | 'email' | 'name' | 'provider'>
   ) {
      const {
         message,
         data,
      }: TBaseResponse<{
         accessToken: string;
         refreshToken: string;
      }> = await axios
         .post('/api/login-social', values, {
            withCredentials: true,
         })
         .then((r) => r.data);

      return { message, data };
   }

   async register(data: {
      email: string;
      password: string;
      confirmPassword: string;
      name: string;
   }) {
      const res = await http.post('/auth/register', data);

      return res;
   }

   requestResetPassword(email: string): Promise<TBaseResponse<null>> {
      return http.post('/auth/request-reset-password', { email });
   }

   resetPassword(data: {
      password: string;
      confirmPassword: string;
      token: string;
   }): Promise<TBaseResponse<null>> {
      return http.post('/auth/reset-password', data);
   }
}

export const authService = new AuthService();

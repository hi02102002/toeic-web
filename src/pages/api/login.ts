import { BASE_URL } from '@/constants';
import { TBaseResponse } from '@/types';
import axios, { AxiosError } from 'axios';
import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   try {
      if (req.method === 'POST') {
         const { email, password } = req.body;

         const {
            data,
            message,
         }: TBaseResponse<{
            accessToken: string;
            refreshToken: string;
         }> = await axios
            .post(`${BASE_URL}/auth/login`, {
               email,
               password,
            })
            .then((r) => r.data);

         setCookie('access_token', data.accessToken, {
            maxAge: 60 * 60 * 23, // 23 hours
            req,
            res,
            path: '/',
         });

         setCookie('refresh_token', data.refreshToken, {
            maxAge: 60 * 60 * 24 * 6, // 6 days
            req,
            res,
            path: '/',
         });

         return res.status(200).json({ data, message });
      }

      return res.status(405).json({ message: 'Method not allowed' });
   } catch (error) {
      if (error instanceof AxiosError) {
         return res.status(error.response?.status || 500).json({
            message: error.response?.data.message || 'Internal server error',
            error: error.response?.data.error || null,
         });
      }
      return res.status(500).json({ message: 'Internal server error' });
   }
}

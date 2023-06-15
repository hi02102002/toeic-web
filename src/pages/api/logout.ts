import { BASE_URL } from '@/constants';
import axios, { AxiosError } from 'axios';
import { deleteCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   try {
      if (req.method === 'POST') {
         await axios.post(
            `${BASE_URL}/auth/logout`,
            {},
            {
               headers: {
                  Authorization: `Bearer ${req.cookies.access_token}`,
               },
            }
         );

         deleteCookie('refresh_token', {
            req,
            res,
         });

         deleteCookie('access_token', {
            req,
            res,
         });

         return res.status(200).json({ message: 'Logout successfully' });
      }

      return res.status(405).json({ message: 'Method not allowed' });
   } catch (error) {
      if (error instanceof AxiosError) {
         return res.status(error.response?.status || 500).json({
            message: error.response?.data.message || 'Internal server error',
         });
      }
      return res.status(500).json({ message: 'Internal server error' });
   }
}

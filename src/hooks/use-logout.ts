import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { auth } from '@/libs/firebase';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
export const useLogout = () => {
   const { user } = useUser();
   const router = useRouter();
   return useMutation({
      mutationFn: async () => {
         await axios.post('/api/logout');
         if (user?.provider !== 'local') {
            await signOut(auth);
         }
      },
      onSuccess() {
         router.push(ROUTES.LOGIN);
      },
   });
};

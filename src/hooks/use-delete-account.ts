import { usersService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useDeleteAccount = () => {
   const router = useRouter();

   return useMutation({
      mutationFn: async () => {
         const res = await usersService.deletePersonalAccount();

         return res;
      },
      onSuccess: () => {
         toast.success('Delete your account successfully');
         router.reload();
      },
      onError: () => {
         toast.error(
            "Sorry, we can't delete your account right now. Please try again later"
         );
      },
   });
};

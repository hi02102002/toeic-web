import { usersService } from '@/services';
import { TPasswordChangeDto } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useChangePassword = () => {
   return useMutation({
      mutationFn: async (data: TPasswordChangeDto) => {
         const res = await usersService.changePassword(data);

         return res;
      },
      onSuccess: () => {
         toast.success('Change your password successfully');
      },
      onError: (e: any) => {
         toast.error(
            e.response?.data?.message ||
               "Sorry, we can't change your password right now. Please try again later"
         );
      },
   });
};

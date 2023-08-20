import { useUser } from '@/contexts/user.ctx';
import { usersService } from '@/services';
import { TProfileDto } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useUpdateProfile = () => {
   const { setUser } = useUser();
   return useMutation({
      mutationFn: async (data: TProfileDto) => {
         const res = await usersService.updateProfile(data);

         return res;
      },
      onSuccess: (data) => {
         setUser((prev) => {
            if (!prev) return prev;
            return {
               ...prev,
               ...data.data,
            };
         });
         toast.success('Update your profile successfully');
      },
      onError: () => {
         toast.error(
            "Sorry, we can't update your profile right now. Please try again later"
         );
      },
   });
};

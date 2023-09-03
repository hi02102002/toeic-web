import { authService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useRequestResetPassword = () => {
   return useMutation({
      mutationFn: async (email: string) => {
         const res = await authService.requestResetPassword(email);
         return res;
      },
      onSuccess(data, variables, context) {
         toast.success(data.message);
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               error.message ||
               'Something went wrong while requesting reset password'
         );
      },
   });
};

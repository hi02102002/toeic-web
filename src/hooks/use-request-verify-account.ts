import { authService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useRequestVerifyAccount = () => {
   return useMutation({
      mutationFn: async (email: string) => {
         const res = await authService.requestVerifyAccount(email);
         return res;
      },
      onSuccess(data, variables, context) {
         toast.success(
            data.message || 'Send your request to verify account successfully'
         );
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something went wrong while sending your request to verify account'
         );
      },
   });
};

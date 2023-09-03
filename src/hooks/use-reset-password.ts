import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useResetPassword = () => {
   const router = useRouter();
   return useMutation({
      mutationFn: async (data: {
         password: string;
         confirmPassword: string;
         token: string;
      }) => {
         const res = await authService.resetPassword(data);

         return res;
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               error.message ||
               'Something went wrong while resetting your password'
         );
      },
      onSuccess(data, variables, context) {
         toast.success(
            data.message || 'Your password has been reset successfully'
         );

         router.push(ROUTES.LOGIN);
      },
   });
};

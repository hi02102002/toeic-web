import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useVerifyAccount = () => {
   const router = useRouter();
   return useMutation({
      mutationFn: async (code: number) => {
         const res = await authService.verifyAccount(code);

         return res;
      },
      onSuccess(data, variables, context) {
         toast.success(
            data.message ||
               'Verify your account successfully. Please login to continue'
         );
         router.push(ROUTES.LOGIN);
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response?.data?.message ||
               'Something went wrong while verifying your account. Please try again'
         );
      },
   });
};

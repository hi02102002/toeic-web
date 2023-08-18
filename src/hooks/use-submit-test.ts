import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { testsService, usersService } from '@/services';
import { TSubmitTestDto } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useSubmitTest = () => {
   const router = useRouter();
   const { setUser } = useUser();
   return useMutation({
      mutationFn: async (fields: TSubmitTestDto) => {
         const res = await testsService.submitTest(fields);
         await usersService.finishTest();
         setUser((prev) => {
            if (prev) {
               return {
                  ...prev,
                  isTesting: false,
               };
            }
            return prev;
         });

         return res.data;
      },
      onSuccess(data, variables, context) {
         router.replace(`${ROUTES.TOIEC_TEST}/results/${data.id}`);
      },
      onError(error, variables, context) {
         toast.error('Something went wrong');
      },
   });
};

import { ROUTES } from '@/constants';
import { testsService } from '@/services';
import { TSubmitTestDto } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useSubmitTest = () => {
   const router = useRouter();
   return useMutation({
      mutationFn: async (fields: TSubmitTestDto) => {
         const res = await testsService.submitTest(fields);
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

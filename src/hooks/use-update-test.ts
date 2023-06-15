import { testsService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useUpdateTest = () => {
   const router = useRouter();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: { id: string; name: string }) => {
         const { id, name } = data;
         const res = await testsService.updateTest(id, name);
         return res;
      },
      onSuccess(data, variables, context) {
         toast.success(data.message);
      },
      onSettled() {
         const query = router.query;
         queryClient.invalidateQueries([
            'tests',
            query?.name || null,
            Number(query?.limit || 10),
            Number(query?.page || 1),
         ]);
      },
   });
};

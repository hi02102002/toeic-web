import { testsService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
export const useCreateTest = () => {
   const router = useRouter();
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (name: string) => {
         return await testsService.createTest(name);
      },
      onSuccess: (data) => {
         toast.success(data.message);
      },
      onError(err) {
         toast.error('Something went wrong');
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

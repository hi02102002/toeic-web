import { testsService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useRemoveTests = () => {
   const router = useRouter();
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (ids: Record<string, boolean>) => {
         const _ids = Object.keys(ids).filter((id) => ids[id]);

         await testsService.removeTests(_ids);

         return _ids;
      },
      onSuccess: (data) => {
         toast.success(`Removed ${data.length} tests`);
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
      onError(err) {
         toast.error('Something went wrong');
      },
   });
};

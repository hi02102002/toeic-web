import { testsService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useResultsTest = (q?: { page?: number; limit?: number }) => {
   return useQuery({
      queryKey: ['results', JSON.stringify(q)],
      queryFn: async () => {
         const res = await testsService.getAllResults(q);

         return res.data;
      },
      keepPreviousData: true,
   });
};

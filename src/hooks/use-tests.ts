import { testsService } from '@/services';
import { TTestQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useTests = (q?: TTestQuery) => {
   return useQuery({
      queryKey: ['tests', JSON.stringify(q)],
      queryFn: async () => {
         const res = await testsService.getAllTests(q);
         return res.data;
      },
      keepPreviousData: true,
   });
};

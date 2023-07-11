import { testsService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const usePracticeToiec = (testId: string) => {
   return useQuery({
      queryKey: ['practice', testId],
      queryFn: async () => {
         const res = await testsService.getPractice(testId);
         return res.data;
      },
   });
};

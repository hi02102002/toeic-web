import { testsService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useToiec = (
   testId: string,
   type: 'practice' | 'explain' = 'practice'
) => {
   return useQuery({
      queryKey: ['toiec', type, testId],
      queryFn: async () => {
         const res = await testsService.getPracticeOrWithExplain(testId, type);
         return res.data;
      },
   });
};

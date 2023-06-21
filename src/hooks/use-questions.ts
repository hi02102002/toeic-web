import { questionService } from '@/services';
import { TQuestionQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useQuestions = (q?: TQuestionQuery) => {
   return useQuery({
      queryKey: ['questions', q],
      queryFn: async () => {
         const res = await questionService.getQuestions(q);

         return res.data;
      },
      keepPreviousData: true,
   });
};

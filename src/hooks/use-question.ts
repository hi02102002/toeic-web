import { questionService } from '@/services';
import { TQuestion } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useQuestion = (id: string, init?: TQuestion) => {
   return useQuery({
      queryKey: ['question', id],
      queryFn: async () => {
         const res = await questionService.getQuestion(id);
         return res.data;
      },
      initialData: init,
   });
};

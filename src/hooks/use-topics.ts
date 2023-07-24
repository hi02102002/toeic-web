import { topicsService } from '@/services';
import { TTopicQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useTopics = (q?: TTopicQuery) => {
   return useQuery({
      queryKey: ['topics', JSON.stringify(q)],
      queryFn: async () => {
         const res = await topicsService.getTopics(q);
         return res.data;
      },
      keepPreviousData: true,
   });
};

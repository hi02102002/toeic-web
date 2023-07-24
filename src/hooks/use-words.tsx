import { topicsService } from '@/services';
import { TWordQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useWords = (topicId: string, query?: TWordQuery) => {
   return useQuery({
      queryKey: ['words', topicId, JSON.stringify(query)],
      queryFn: () => {
         return topicsService.getWords(topicId, query).then((res) => res.data);
      },
      keepPreviousData: true,
   });
};

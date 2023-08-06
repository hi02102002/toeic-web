import { flashcardsService } from '@/services';
import { TFlashcardQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useFlashcards = (q?: TFlashcardQuery) => {
   return useQuery({
      queryKey: ['flashcards', JSON.stringify(q)],
      queryFn: async () => {
         const res = await flashcardsService.getFlashcards(q);

         return res.data;
      },
      keepPreviousData: true,
   });
};

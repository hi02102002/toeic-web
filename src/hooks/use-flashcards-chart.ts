import { flashcardsService } from '@/services';
import { TFlashcardQueryChart } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useFlashcardsChart = (q?: TFlashcardQueryChart) => {
   return useQuery({
      queryKey: ['flashcards-chart', JSON.stringify(q)],
      queryFn: async () => {
         const res = await flashcardsService.getFlashcardChart(q);

         return res.data;
      },
      keepPreviousData: true,
   });
};

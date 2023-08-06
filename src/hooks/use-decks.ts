import { decksService } from '@/services';
import { TDeckQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useDecks = (q?: TDeckQuery, enabled = true) => {
   return useQuery({
      queryKey: ['decks', JSON.stringify(q)],
      queryFn: async () => {
         const res = await decksService.getDecks();

         return res.data;
      },
      enabled,
   });
};

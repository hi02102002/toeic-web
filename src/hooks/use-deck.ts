import { decksService } from '@/services';
import { TDeck } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useDeck = (id: string, init: TDeck) => {
   return useQuery({
      queryKey: ['deck', id],
      queryFn: async () => {
         const res = await decksService.getDeck(id);
         return res.data;
      },
      initialData: init,
   });
};

import { grammarsService } from '@/services';
import { TGrammarQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGrammars = (q?: TGrammarQuery) => {
   return useQuery({
      queryKey: ['grammars', JSON.stringify(q)],
      queryFn: async () => {
         const res = await grammarsService.getAllGrammars(q);
         return res.data;
      },
      keepPreviousData: true,
   });
};

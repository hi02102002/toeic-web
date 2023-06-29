import { grammarsService } from '@/services';
import { TGrammar } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGrammar = (id: string, init?: TGrammar) => {
   return useQuery({
      queryKey: ['grammar', id],
      initialData: init,
      queryFn: async () => {
         const res = await grammarsService.getGrammar(id);
         return res.data;
      },
   });
};

import { testsService } from '@/services';
import { TPart, TTest } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const usePart = (
   id: string,
   initPart?: TPart & {
      test: Pick<TTest, 'id' | 'name'>;
   }
) => {
   return useQuery({
      queryKey: ['part', id],
      queryFn: async () => {
         const res = await testsService.getPartById(id);

         return res.data;
      },
      initialData: initPart,
   });
};

import { topicsService } from '@/services';
import { TWordDto, TWordQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useQueue } from './use-queue';

export const useImportWords = (q?: TWordQuery) => {
   const queryClient = useQueryClient();
   const [list, { enqueue, dequeue }] = useQueue<Array<TWordDto[]>>([]);

   return useMutation({
      mutationFn: async (data: { topicId: string; json: string }) => {
         const words = JSON.parse(data.json) as TWordDto[];

         if (
            !words.length ||
            typeof words !== 'object' ||
            !Array.isArray(words)
         ) {
            throw new Error('Invalid data');
         }

         while (words.length) {
            const chunk = words.splice(0, 200);
            await topicsService.importWords({
               topicId: data.topicId,
               words: chunk,
            });
         }
      },

      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['words', JSON.stringify(q)]);
      },
      onSuccess(data, variables, context) {
         toast.success('Import words successfully');
      },
      onError(error: any, variables, context) {
         toast.error(
            error?.response.data.message ||
               error?.message ||
               'Import words failed'
         );
      },
   });
};

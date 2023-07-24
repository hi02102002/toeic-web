import { topicsService } from '@/services';
import { TTopicQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useRemoveTopics = (q?: TTopicQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (ids: Record<string, any>) => {
         const _ids = Object.keys(ids).filter((id) => ids[id]);
         const res = await topicsService.removeTopics(_ids);
         return res;
      },
      onSuccess: ({ message }) => {
         toast.success(message || 'Remove topics successfully');
      },
      onError: (e: any) => {
         toast.error(e?.response?.data?.message || 'Remove topics failed');
      },
      onSettled: () => {
         queryClient.invalidateQueries(['topics', JSON.stringify(q)]);
      },
   });
};

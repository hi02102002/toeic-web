import { topicsService } from '@/services';
import { TTopicDto, TTopicQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useCreateTopic = (q?: TTopicQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (data: TTopicDto) => {
         const res = await topicsService.createTopic(data);
         return res;
      },
      onSuccess: ({ message }) => {
         toast.success(message || 'Create topic successfully');
      },
      onError: (e: any) => {
         toast.error(e?.response?.data?.message || 'Create topic failed');
      },
      onSettled: () => {
         queryClient.invalidateQueries(['topics', JSON.stringify(q)]);
      },
   });
};

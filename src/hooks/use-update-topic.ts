import { topicsService } from '@/services';
import { TTopicDto, TTopicQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useUpdateTopic = (q?: TTopicQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({
         id,
         data,
      }: {
         id: string;
         data: Partial<TTopicDto>;
      }) => {
         const res = await topicsService.updateTopic(id, data);
         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Update topic successfully');
      },
      onError: (err: any) => {
         toast.error(err?.response?.data?.message || 'Update topic failed');
      },
      onSettled: () => {
         queryClient.invalidateQueries(['topics', JSON.stringify(q)]);
      },
   });
};

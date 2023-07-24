import { topicsService } from '@/services';
import { TWordQuery } from '@/types';
import { idObjToArr } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useRemoveWords = (topicId: string, q?: TWordQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (ids: Record<string, boolean>) => {
         const _ids = idObjToArr(ids);

         return topicsService.removeWords(_ids);
      },
      onSuccess(data, variables, context) {
         toast.success(data.message || 'Remove words successfully');
      },
      onError(error: any, variables, context) {
         toast.error(error?.response?.data?.message || 'Remove words failed');
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['words', topicId, JSON.stringify(q)]);
      },
   });
};

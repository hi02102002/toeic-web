import { questionService } from '@/services';
import { TQuestionQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useRemoveQuestions = (q?: TQuestionQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (ids: Record<string, boolean>) => {
         const _ids = Object.keys(ids).filter((id) => ids[id]);
         const res = await questionService.removeQuestions(_ids);
         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message);
      },
      onError(err: any) {
         toast.error(err?.response?.data?.message || 'Something went wrong');
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['questions', q]);
      },
   });
};

import { grammarsService } from '@/services';
import { TQuestionQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useRemoveGrammars = (q?: TQuestionQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (ids: Record<string, boolean>) => {
         const _ids = Object.keys(ids).filter((id) => ids[id]);
         return grammarsService.removeGrammars(_ids);
      },
      onSuccess: (data) => {
         toast.success(data.message);
      },
      onError: (error: any) => {
         toast.error(error?.response?.data?.message || 'Something went wrong');
      },
      onSettled: () => {
         queryClient.invalidateQueries({
            queryKey: ['grammars', JSON.stringify(q)],
         });
      },
   });
};

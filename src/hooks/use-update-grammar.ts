import { grammarsService } from '@/services';
import { TGrammarDto, TGrammarQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useUpdateGrammar = (q?: TGrammarQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (fields: { id: string; data: Partial<TGrammarDto> }) => {
         return grammarsService.updateGrammarLesson(fields.id, fields.data);
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

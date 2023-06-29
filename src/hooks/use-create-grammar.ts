import { grammarsService } from '@/services';
import { TGrammarDto, TGrammarQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useCreateGrammar = (q?: TGrammarQuery) => {
   const queryClient = useQueryClient();
   const key = ['grammars', JSON.stringify(q)];
   return useMutation({
      mutationFn: (data: TGrammarDto) => {
         return grammarsService.createGrammarLesson(data);
      },
      onError: (err: any, newTodo, context) => {
         toast.error(err?.response?.data?.message || 'Something went wrong');
      },
      onSuccess: (data, variables, context) => {
         toast.success(data.message);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: key });
      },
   });
};

import { flashcardsService } from '@/services';
import { TFlashcardQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useRemoveFlashcard = (q?: TFlashcardQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (id: string) => {
         const res = await flashcardsService.deleteFlashcard(id);
         return res;
      },
      onSuccess: ({ message }) => {
         toast.success(message || 'Delete flashcard successfully');
      },
      onError: (error: any) => {
         toast.error(
            error?.response?.data?.message || 'Delete flashcard failed'
         );
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['flashcards', JSON.stringify(q)]);
      },
   });
};

import { ROUTES } from '@/constants';
import { decksService } from '@/services';
import { TDeckQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useCreateDeck = (q?: TDeckQuery, hasNavigate = true) => {
   const router = useRouter();
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (name: string) => {
         return decksService.createDeck(name);
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Deck created successfully');
         if (hasNavigate) {
            router.push(`${ROUTES.FLASHCARDS}/${data.data.id}`);
         }
      },
      onError: (error: any) => {
         toast.error(
            error?.response.data.message || 'Error while creating the deck'
         );
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['decks', JSON.stringify(q)]);
      },
   });
};

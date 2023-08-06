import { ROUTES } from '@/constants';
import { decksService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useRemoveDeck = () => {
   const router = useRouter();
   return useMutation({
      mutationFn: (id: string) => {
         return decksService.removeDeck(id);
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Deck removed successfully');
         router.push(`${ROUTES.FLASHCARDS}`);
      },
      onError: (error: any) => {
         toast.error(
            error?.response.data.message || 'Error while removing the deck'
         );
      },
   });
};

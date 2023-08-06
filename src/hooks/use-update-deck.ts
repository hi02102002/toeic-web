import { decksService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useUpdateDeck = (id: string) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (name: string) => {
         return decksService.updateDeck(id, name);
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Deck updated successfully');
      },
      onError: (error: any) => {
         toast.error(
            error?.response.data.message || 'Error while updating the deck'
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(['deck', id]);
      },
   });
};

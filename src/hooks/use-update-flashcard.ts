import { flashcardsService, uploadService } from '@/services';
import { TFlashcardDto, TFlashcardQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useUpdateFlashcard = (q?: TFlashcardQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async ({
         id,
         data,
      }: {
         id: string;
         data: Omit<TFlashcardDto, 'deckId' | 'wordId' | 'image'> & {
            image?: FileList | string;
         };
      }) => {
         const image =
            data.image && data.image instanceof File
               ? await uploadService.upload(data.image?.[0] as File)
               : undefined;

         const res = await flashcardsService.updateFlashcard(id, {
            ...data,
            image: image?.url,
         });

         return res;
      },
      onSuccess: ({ message }) => {
         toast.success(message || 'Update flashcard successfully');
      },
      onError: (error: any) => {
         toast.error(
            error?.response?.data?.message || 'Update flashcard failed'
         );
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['flashcards', JSON.stringify(q)]);
      },
   });
};

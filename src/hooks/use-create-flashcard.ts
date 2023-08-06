import { flashcardsService, uploadService } from '@/services';
import { TFlashcardDto, TFlashcardQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useCreateFlashcard = (q?: TFlashcardQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (
         data: TFlashcardDto & {
            image?: FileList | string;
         }
      ) => {
         const image = data.image
            ? await uploadService.upload(data.image?.[0] as File)
            : undefined;

         const res = await flashcardsService.createFlashcard({
            ...data,
            image: image?.url,
         });
         return res;
      },
      onSuccess: ({ message }) => {
         toast.success(message || 'Create flashcard successfully');
      },
      onError: (error: any) => {
         toast.error(
            error?.response?.data?.message || 'Create flashcard failed'
         );
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['flashcards', JSON.stringify(q)]);
      },
   });
};

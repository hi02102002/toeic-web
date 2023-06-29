import { questionService, uploadService } from '@/services';
import { TQuestionDto, TQuestionQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useUpdateQuestion = (q?: TQuestionQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (fields: {
         id: string;
         data: Omit<TQuestionDto, 'answers'> & {
            answers: Array<{
               id: string;
               content: string;
               isCorrect: boolean;
            }>;
         };
      }) => {
         const [image, audio] = await Promise.all([
            fields.data.image?.[0] instanceof File
               ? uploadService.upload(fields.data.image?.[0] as File)
               : Promise.resolve(undefined),
            fields.data.audio?.[0] instanceof File
               ? uploadService.upload(fields.data.audio?.[0] as File)
               : Promise.resolve(undefined),
         ]);

         const res = await questionService.updateQuestion(fields.id, {
            ...fields.data,
            audio: audio?.url as string,
            image: image?.url as string,
         });

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message);
      },
      onError(err: any) {
         toast.error(err?.response?.data?.message || 'Something went wrong');
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['questions', JSON.stringify(q)]);
      },
   });
};

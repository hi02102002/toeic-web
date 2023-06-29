import { questionService, uploadService } from '@/services';
import { TQuestionDto, TQuestionQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useCreateQuestion = (q?: TQuestionQuery) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: TQuestionDto) => {
         const [image, audio] = await Promise.all([
            data.image
               ? uploadService.upload(data.image?.[0] as File)
               : Promise.resolve(undefined),
            data.audio
               ? uploadService.upload(data.audio?.[0] as File)
               : Promise.resolve(undefined),
         ]);

         const res = await questionService.createQuestion({
            ...data,
            audio: audio?.url as string,
            image: image?.url as string,
         });

         return res;
      },
      onError(err: any) {
         toast.error(err?.response?.data?.message || 'Something went wrong');
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['questions', JSON.stringify(q)]);
      },
      onSuccess(data) {
         toast.success(data.message);
      },
   });
};

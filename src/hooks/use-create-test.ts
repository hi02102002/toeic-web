import { testsService, uploadService } from '@/services';
import { TQuestionQuery, TTestDto } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
export const useCreateTest = (q?: TQuestionQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (fields: TTestDto) => {
         const audio = fields.audio
            ? typeof fields.audio === 'string'
               ? { url: fields.audio }
               : await uploadService.upload(fields.audio[0])
            : null;

         return await testsService.createTest({
            name: fields.name,
            audio: audio?.url || '',
         });
      },
      onSuccess: (data) => {
         toast.success(data.message);
      },
      onError(err) {
         toast.error('Something went wrong');
      },
      onSettled() {
         queryClient.invalidateQueries(['tests', JSON.stringify(q)]);
      },
   });
};

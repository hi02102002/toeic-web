import { questionService } from '@/services';
import { PartType, TQuestionJson, TQuestionQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useImportQuestionsTest = (q?: TQuestionQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async ({
         partId,
         partType,
         testId,
         json,
      }: {
         partId: string;
         json: string;
         partType: PartType;
         testId: string;
      }) => {
         const _data = JSON.parse(json) as TQuestionJson[];

         if (typeof _data !== 'object' || !Array.isArray(_data)) return;

         if (!_data.length) return;

         const res = await questionService.importQuestions({
            partId,
            questions: _data,
            partType,
            testId,
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
         toast.success(data?.message || 'Import successfully');
      },
   });
};

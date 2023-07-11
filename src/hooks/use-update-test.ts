import { testsService, uploadService } from '@/services';
import { TTestQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useUpdateTest = (q?: TTestQuery) => {
   const router = useRouter();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (data: {
         id: string;
         name: string;
         audio: string | FileList;
      }) => {
         const { id, name, audio } = data;
         const _audio = audio
            ? await uploadService.upload(audio?.[0] as File)
            : undefined;

         const res = await testsService.updateTest(
            id,
            name,
            _audio?.url as string
         );
         return res;
      },
      onSuccess(data, variables, context) {
         toast.success(data.message);
      },
      onSettled() {
         const query = router.query;
         queryClient.invalidateQueries(['tests', JSON.stringify(q)]);
      },
   });
};

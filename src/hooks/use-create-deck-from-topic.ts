import { ROUTES } from '@/constants';
import { decksService } from '@/services';
import { TDeckFromTopicDto } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export const useCreateDeckFromTopic = () => {
   const router = useRouter();
   return useMutation({
      mutationFn: async (data: TDeckFromTopicDto) => {
         const res = await decksService.createDeckFromTopic(data);
         return res;
      },
      onSuccess(data, variables, context) {
         router.push(`${ROUTES.FLASHCARDS}/${data.data.id}`);
      },
      onError(error: any, variables, context) {
         toast.error(error?.response?.data?.message || 'Something went wrong');
      },
   });
};

import { topicsService, uploadService } from '@/services';
import { TWordDto, TWordQuery } from '@/types';
import { urlAudioWord } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useUpdateWord = (topicId: string, q?: TWordQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async ({
         id,
         data,
      }: {
         id: string;
         data: Partial<
            Omit<TWordDto, 'audios' | 'image'> & {
               image?: FileList | string;
            }
         >;
      }) => {
         const image =
            data.image?.[0] instanceof File
               ? await uploadService.upload(data.image?.[0] as File)
               : (data.image as string);

         const res = topicsService.updateWord(id, {
            definition: data.definition,
            examples: data.examples,
            meaning: data.meaning,
            name: data.name,
            note: data.note,
            patchOfSpeech: data.patchOfSpeech,
            pronunciation: data.pronunciation,
            audios: [
               {
                  src: urlAudioWord(data.name as string, 1),
                  region: 'UK',
               },
               {
                  src: urlAudioWord(data.name as string, 2),
                  region: 'US',
               },
            ],
            image: typeof image === 'string' ? image : image?.url,
         });

         return res;
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Update word successfully');
      },
      onError(error: any, variables, context) {
         toast.error(error?.response?.data?.message || 'Update word failed');
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries(['words', topicId, JSON.stringify(q)]);
      },
   });
};

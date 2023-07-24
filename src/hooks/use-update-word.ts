import { topicsService, uploadService } from '@/services';
import { TWordDto, TWordQuery } from '@/types';
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
               audioUK?: FileList | string;
               audioUS?: FileList | string;
               image?: FileList | string;
            }
         >;
      }) => {
         const [audioUK, audioUS, image] = await Promise.all([
            data.audioUK?.[0] instanceof File
               ? uploadService.upload(data.audioUK?.[0] as File)
               : Promise.resolve(data.audioUK),
            data.audioUS?.[0] instanceof File
               ? uploadService.upload(data.audioUS?.[0] as File)
               : Promise.resolve(data.audioUS),
            data.image?.[0] instanceof File
               ? uploadService.upload(data.image?.[0] as File)
               : Promise.resolve(data.image),
         ]);

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
                  // @ts-ignore
                  src: audioUK?.url || (audioUK as string),
                  region: 'UK',
               },
               {
                  // @ts-ignore
                  src: (audioUS?.url as string) || (audioUS as string),
                  region: 'US',
               },
            ].filter((audio) => typeof audio.src === 'string'),
            // @ts-ignore
            image: image?.url || (image as string),
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

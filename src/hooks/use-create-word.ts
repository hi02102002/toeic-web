import { topicsService, uploadService } from '@/services';
import { TWordDto, TWordQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useCreateWord = (topicId: string, query?: TWordQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (
         data: Omit<TWordDto, 'audios' | 'image'> & {
            audioUK?: FileList | string;
            audioUS?: FileList | string;
            image?: FileList | string;
         }
      ) => {
         console.log(data.image);
         const [audioUK, audioUS, image] = await Promise.all([
            data.audioUK
               ? uploadService.upload(data.audioUK?.[0] as File)
               : Promise.resolve(undefined),
            data.audioUS
               ? uploadService.upload(data.audioUS?.[0] as File)
               : Promise.resolve(undefined),
            data.image
               ? uploadService.upload(data.image?.[0] as File)
               : Promise.resolve(undefined),
         ]);

         return topicsService.createWord(topicId, {
            audios: [
               {
                  src: audioUK?.url as string,
                  region: 'UK',
               },
               {
                  src: audioUS?.url as string,
                  region: 'US',
               },
            ].filter((audio) => audio.src),
            name: data.name,
            meaning: data.meaning,
            examples: data.examples,
            definition: data.definition,
            note: data.note,
            patchOfSpeech: data.patchOfSpeech,
            pronunciation: data.pronunciation,
            image: image?.url,
         });
      },
      onSuccess: (data) => {
         toast.success(data.message || 'Create word successfully');
      },
      onError: (error: any) => {
         toast.error(error?.response.data.message || 'Create word failed');
      },
      onSettled(data, error, variables, context) {
         queryClient.invalidateQueries([
            'words',
            topicId,
            JSON.stringify(query),
         ]);
      },
   });
};

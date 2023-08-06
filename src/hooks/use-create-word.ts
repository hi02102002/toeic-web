import { topicsService, uploadService } from '@/services';
import { TWordDto, TWordQuery } from '@/types';
import { urlAudioWord } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useCreateWord = (topicId: string, query?: TWordQuery) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (
         data: Omit<TWordDto, 'audios' | 'image'> & {
            image?: FileList | string;
         }
      ) => {
         const image = data.image
            ? await uploadService.upload(data.image?.[0] as File)
            : undefined;

         return topicsService.createWord(topicId, {
            audios: [
               {
                  src: urlAudioWord(data.name, 1),
                  region: 'UK',
               },
               {
                  src: urlAudioWord(data.name, 2),
                  region: 'US',
               },
            ].filter((audio) => audio.src),
            name: data.name,
            meaning: data.meaning,
            examples: data.examples?.filter((example) => example),
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

import { uploadService } from '@/services';
import { TUploadRes } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useUploadFile = (cb?: (res: TUploadRes) => void) => {
   return useMutation({
      mutationFn: async (file: File) => {
         const res = await uploadService.upload(file);
         cb && cb(res);
         return res;
      },
   });
};

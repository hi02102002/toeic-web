import { http } from '@/libs/axios';
import { TBaseResponse, TUploadRes } from '@/types';

class UploadService {
   async upload(file: File) {
      const formData = new FormData();

      formData.append('file', file);

      const res: TBaseResponse<TUploadRes> = await http.post(
         '/upload',
         formData,
         {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         }
      );

      return res.data;
   }
}

export const uploadService = new UploadService();

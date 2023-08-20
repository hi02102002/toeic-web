import { usersService } from '@/services';
import { TUserLearningSettingDto } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useUpdateUserSettingLearning = () => {
   return useMutation({
      mutationFn: async (data: TUserLearningSettingDto) => {
         const res = await usersService.updateSetting(data);

         return res;
      },
      onSuccess: () => {
         toast.success('Update your learning setting successfully');
      },
      onError: () => {
         toast.error(
            "Sorry, we can't update your learning setting right now. Please try again later"
         );
      },
   });
};

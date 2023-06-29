import { useUser } from '@/contexts/user.ctx';
import { usersService } from '@/services';
import { TUserDto, TUserQuery } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useUpdateUser = (q?: TUserQuery) => {
   const queryClient = useQueryClient();
   const { setUser, user } = useUser();
   return useMutation({
      mutationFn: ({ data, id }: { id: string; data: Partial<TUserDto> }) => {
         return usersService.updateUser(id, data);
      },
      onSuccess: (data) => {
         if (user && user.id === data.data.id) {
            setUser({
               ...user,
               ...data.data,
            });
         }
         toast.success(data.message);
      },
      onError: (error: any) => {
         toast.error(error?.response?.data?.message || 'Something went wrong');
      },
      onSettled: () => {
         queryClient.invalidateQueries({
            queryKey: ['users', JSON.stringify(q)],
         });
      },
   });
};

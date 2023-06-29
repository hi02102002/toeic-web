import { usersService } from '@/services';
import { TUserQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useUsers = (q?: TUserQuery) => {
   return useQuery({
      queryKey: ['users', JSON.stringify(q)],
      queryFn: async () => {
         const v = await usersService.getAllUsers(q);
         return v.data;
      },
   });
};

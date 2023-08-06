import { ROUTES_AUTH } from '@/constants';
import { usersService } from '@/services';
import { TUser } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useMe = (initUser: TUser | null) => {
   const router = useRouter();
   return useQuery({
      queryKey: ['me', router.pathname],
      queryFn: async () => {
         if (
            initUser === undefined &&
            !ROUTES_AUTH.some((r) => router.pathname.includes(r))
         ) {
            const v = await usersService.getMe();
            return v.data;
         }
         return initUser;
      },
      initialData: initUser,
      refetchInterval: Infinity,
   });
};

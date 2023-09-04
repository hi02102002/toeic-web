import { LoadingFullPage } from '@/components/shared';
import { ROUTES_AUTH } from '@/constants';
import { useStartFinishTest } from '@/hooks/use-start-finish-test';
import { http } from '@/libs/axios';
import { TBaseResponse, TUser } from '@/types';
import { useRouter } from 'next/router';
import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useState,
} from 'react';

type TUserCtx = {
   user: TUser | null;
   setUser: React.Dispatch<React.SetStateAction<TUser | null>>;
};

export const UserCtx = createContext<TUserCtx>({
   user: null,
   setUser: () => {},
});

export const useUser = () => useContext(UserCtx);

export const UserProvider = ({
   children,
   initUser,
}: {
   children: React.ReactNode;
   initUser: TUser | null;
}) => {
   const [user, setUser] = useState<TUser | null>(initUser);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const router = useRouter();
   useStartFinishTest();

   const handelFetchUser = useCallback(async () => {
      if (
         initUser === undefined &&
         !ROUTES_AUTH.some((r) => router.pathname.includes(r)) &&
         !(router.pathname === '/404')
      ) {
         try {
            setIsLoading(true);

            const res: TBaseResponse<TUser> = await http.get('/auth/me');

            setUser(res.data);
            setIsLoading(false);
         } catch (error) {
            setIsLoading(false);
            setUser(null);
         }
      } else {
         setUser(initUser);
      }
   }, [initUser, router.pathname]);

   useEffect(() => {
      handelFetchUser();
   }, [handelFetchUser]);

   return (
      <UserCtx.Provider value={{ user, setUser }}>
         {isLoading ? <LoadingFullPage /> : children}
      </UserCtx.Provider>
   );
};

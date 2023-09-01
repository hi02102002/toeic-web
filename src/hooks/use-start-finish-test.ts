import { useUser } from '@/contexts/user.ctx';
import { usersService } from '@/services';
import { useEffect } from 'react';

export const useStartFinishTest = () => {
   const { setUser } = useUser();

   useEffect(() => {
      return () => {
         setUser((prev) => {
            if (!prev) return prev;
            return {
               ...prev,
               isTesting: false,
            };
         });
         usersService.finishTest();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
};

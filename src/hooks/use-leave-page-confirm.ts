import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useBeforeUnload } from 'react-use';

export const useLeavePageConfirm = (
   isConfirm: boolean = true,
   message: string = 'Are you sure want to leave this page?'
) => {
   const router = useRouter();
   useBeforeUnload(isConfirm, message);

   useEffect(() => {
      const handler = () => {
         if (isConfirm && !window.confirm(message)) {
            throw 'Route Canceled';
         }
      };

      Router.events.on('routeChangeStart', handler);

      return () => {
         Router.events.off('routeChangeStart', handler);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isConfirm, message]);
};

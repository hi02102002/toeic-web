import { TIME_OF_TOIEC } from '@/constants';
import { useEffect, useMemo, useState } from 'react';

export const useCountDownTime = () => {
   const [time, setTime] = useState<number>(TIME_OF_TOIEC);

   useEffect(() => {
      const interval = setInterval(() => {
         setTime((time) => {
            if (time === 0) {
               return 0;
            }
            return time - 1000;
         });
      }, 1000);

      return () => {
         clearInterval(interval);
      };
   }, []);

   return useMemo(
      () => ({
         time,
         isFinished: time === 0,
      }),
      [time]
   );
};

import { useLayoutEffect, useRef, useState } from 'react';

export const useElSize = <T extends HTMLElement = HTMLElement>() => {
   const [size, setSize] = useState({ width: 0, height: 0 });
   const ref = useRef<T | null>(null);

   useLayoutEffect(() => {
      setSize({
         width: ref.current?.clientWidth || 0,
         height: ref.current?.clientHeight || 0,
      });
   }, []);

   return { ref, size };
};

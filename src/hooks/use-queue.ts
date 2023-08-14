import { useCallback, useState } from 'react';

export const useQueue = <T>(
   initialList: T[]
): [
   T[],
   {
      dequeue: () => T | undefined;
      enqueue: (item: T) => number;
      length: number;
      peek: () => T | undefined;
   }
] => {
   const [list, setList] = useState<T[]>([...initialList]);

   /**
    * @param {T} item
    * @returns {number}
    * @description Add an item to the end of the queue
    */
   const enqueue = useCallback(
      (item: T) => {
         const newList = [...list, item];

         setList(newList);

         return newList.length;
      },
      [list]
   );

   /**
    * @returns {T | undefined}
    * @description Remove an item from the beginning of the queue
    * and return it
    */
   const dequeue = useCallback(() => {
      if (list.length > 0) {
         const firstItem = list[0];
         setList([...list.slice(1)]);

         return firstItem;
      }

      return undefined;
   }, [list]);

   /**
    * @returns {T | undefined}
    * @description Return the first item in the queue
    * without removing it
    */
   const peek = useCallback(() => {
      if (list.length > 0) {
         return list[0];
      }

      return undefined;
   }, [list]);

   const controls = {
      dequeue,
      enqueue,
      length: list.length,
      peek,
   };

   return [list, controls];
};

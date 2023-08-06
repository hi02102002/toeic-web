import { Button } from '@/components/shared';
import { calcPageCount } from '@/utils';
import {
   IconChevronLeft,
   IconChevronRight,
   IconChevronsLeft,
   IconChevronsRight,
} from '@tabler/icons-react';
import { useState } from 'react';

type Props = {
   total?: number;
   onPaginationChange?: (value: number) => void;
   pageValue?: number;
   perPage?: number;
};

export const Pagination = ({
   onPaginationChange,
   pageValue,
   total = 0,
   perPage = 5,
}: Props) => {
   const [stateValue, setStateValue] = useState<number>(pageValue || 0);

   const isControl = pageValue !== undefined;

   const page = isControl ? pageValue : stateValue;

   const pageCount = calcPageCount(total, perPage);

   const hasNext = page + 1 !== pageCount && pageCount !== 0;

   const hasPrevious = page !== 0 && pageCount !== 0;

   const handleNextPage = () => {
      if (!hasNext) return;

      if (!isControl) {
         setStateValue(page + 1);
      }
      onPaginationChange?.(page + 1);
   };

   const handlePreviousPage = () => {
      if (!hasPrevious) return;
      if (!isControl) {
         setStateValue(page - 1);
      }
      onPaginationChange?.(page - 1);
   };

   const handleLastPage = () => {
      if (!hasNext) return;

      if (!isControl) {
         setStateValue(pageCount - 1);
      }
      onPaginationChange?.(pageCount - 1);
   };

   const handleFirstPage = () => {
      if (!hasPrevious) return;

      if (!isControl) {
         setStateValue(0);
      }
      onPaginationChange?.(0);
   };

   return (
      <div className="flex items-center space-x-2">
         <Button
            variants="outline"
            className=" w-8 h-8 p-0 flex"
            disabled={!hasPrevious}
            onClick={handleFirstPage}
         >
            <IconChevronsLeft className="w-4 h-4" />
         </Button>
         <Button
            variants="outline"
            className="w-8 h-8 p-0"
            onClick={handlePreviousPage}
            disabled={!hasPrevious}
         >
            <IconChevronLeft className="w-4 h-4" />
         </Button>
         <Button
            variants="outline"
            className="w-8 h-8 p-0"
            onClick={handleNextPage}
            disabled={!hasNext}
         >
            <IconChevronRight className="w-4 h-4" />
         </Button>
         <Button
            variants="outline"
            className=" w-8 h-8 p-0 flex"
            disabled={!hasNext}
            onClick={handleLastPage}
         >
            <IconChevronsRight className="w-4 h-4" />
         </Button>
      </div>
   );
};

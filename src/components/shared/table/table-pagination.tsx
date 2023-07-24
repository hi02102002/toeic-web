import { Confirm } from '@/components/app';
import {
   Button,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/shared';
import { cn } from '@/utils';
import {
   IconChevronLeft,
   IconChevronRight,
   IconChevronsLeft,
   IconChevronsRight,
} from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
interface DataTablePaginationProps<TData> {
   table: Table<TData>;
   pageSizes?: number[];
   onRemoveSelectedRows?: (close?: () => void) => void;
   showSelect?: Boolean;
}

export function DataTablePagination<TData>({
   table,
   pageSizes = [5, 10, 15],
   onRemoveSelectedRows,
   showSelect = true,
}: DataTablePaginationProps<TData>) {
   return (
      <div className="flex items-center justify-between px-2 md:flex-row flex-col gap-6">
         {showSelect && (
            <div className="flex items-center gap-2">
               <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{' '}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
               </div>
               {table.getFilteredSelectedRowModel().rows.length > 0 && (
                  <Confirm
                     title="Remove selected rows?"
                     description="Are you sure you want to remove the selected rows? This action cannot be undone."
                     onConfirm={onRemoveSelectedRows}
                  >
                     <span className="text-sm text-red-500 underline cursor-pointer underline-offset-2">
                        Remove selected rows
                     </span>
                  </Confirm>
               )}
            </div>
         )}
         <div
            className={cn(
               'flex items-center sm:space-x-6 lg:space-x-8 sm:flex-row flex-col space-y-6 sm:space-y-0',
               {
                  'ml-auto': !showSelect,
               }
            )}
         >
            <div className="flex items-center space-x-2">
               <p className="text-sm font-medium">Rows per page</p>
               <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                     table.setPageSize(Number(value));
                  }}
               >
                  <SelectTrigger className="h-8 w-[70px]">
                     <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                     />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                     {pageSizes.map((pageSize) => (
                        <SelectItem
                           key={pageSize}
                           value={`${pageSize}`}
                           className="cursor-pointer"
                        >
                           {pageSize}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
               Page {table.getState().pagination.pageIndex + 1} of{' '}
               {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
               <Button
                  variants="outline"
                  className="hidden w-8 h-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
               >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft className="w-4 h-4" />
               </Button>
               <Button
                  variants="outline"
                  className="w-8 h-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
               >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft className="w-4 h-4" />
               </Button>
               <Button
                  variants="outline"
                  className="w-8 h-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
               >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight className="w-4 h-4" />
               </Button>
               <Button
                  variants="outline"
                  className="hidden w-8 h-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
               >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight className="w-4 h-4" />
               </Button>
            </div>
         </div>
      </div>
   );
}

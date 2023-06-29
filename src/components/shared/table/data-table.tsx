import { IconLoader2 } from '@tabler/icons-react';
import { Table as TTable, flexRender } from '@tanstack/react-table';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from './table';
import { DataTablePagination } from './table-pagination';

interface DataTableProps<TData> {
   table: TTable<TData>;
   isLoading?: boolean;
   onRemoveSelectedRows?: (onClose?: () => void) => void;
   showSelect?: Boolean;
}

export const DataTable = <TData extends object>({
   table,
   isLoading,
   onRemoveSelectedRows,
   showSelect = true,
}: DataTableProps<TData>) => {
   return (
      <div className="space-y-4">
         <Table className="relative p-4 border rounded border-border">
            <TableHeader>
               {table.getHeaderGroups().map((headerGroup) => {
                  return (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead key={header.id}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                         header.column.columnDef.header,
                                         header.getContext()
                                      )}
                              </TableHead>
                           );
                        })}
                     </TableRow>
                  );
               })}
            </TableHeader>
            <TableBody className="relative">
               {isLoading ? (
                  <TableRow>
                     <TableCell
                        colSpan={table.getAllColumns().length}
                        className="h-24 text-center"
                     >
                        <IconLoader2 className="w-6 h-6 mx-auto animate-spin text-primary" />
                     </TableCell>
                  </TableRow>
               ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                     <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                     >
                        {row.getVisibleCells().map((cell) => (
                           <TableCell key={cell.id}>
                              {flexRender(
                                 cell.column.columnDef.cell,
                                 cell.getContext()
                              )}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell
                        colSpan={table.getAllColumns().length}
                        className="h-24 text-center"
                     >
                        No results.
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
         <DataTablePagination
            table={table}
            onRemoveSelectedRows={onRemoveSelectedRows}
            showSelect={showSelect}
         />
      </div>
   );
};

export default DataTable;

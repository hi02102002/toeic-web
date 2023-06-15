import { Confirm, CreateUpdateTest } from '@/components/app';
import { AdminLayout } from '@/components/layouts/admin';
import {
   Button,
   Checkbox,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuPortal,
   DropdownMenuSeparator,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
   Input,
   LoadingFullPage,
} from '@/components/shared';
import {
   DataTablePagination,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/shared/table';
import { useCreateTest, useTests, useUpdateTest } from '@/hooks';
import { useDebounce } from '@/hooks/use-debounce';
import { useRemoveTests } from '@/hooks/use-remove-tests';
import { NextPageWithLayout, TTest } from '@/types';
import { withRoute } from '@/utils/withRoute';
import {
   IconBook2,
   IconBrandGooglePodcasts,
   IconDots,
   IconEdit,
   IconLoader2,
   IconPlus,
   IconTrash,
   IconX,
} from '@tabler/icons-react';
import {
   ColumnDef,
   PaginationState,
   flexRender,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const Tests: NextPageWithLayout = () => {
   const router = useRouter();
   const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });
   const [rowSelection, setRowSelection] = useState({});
   const [search, setSearch] = useState<string>('');
   const debounceSearch = useDebounce(search, 500);
   const { mutateAsync: handleCreateTests, isLoading: isLoadingCreateTest } =
      useCreateTest();

   const { mutateAsync: handleUpdateTest, isLoading: isLoadingUpdateTest } =
      useUpdateTest();

   const { mutateAsync: handleRemoveTests, isLoading: isLoadingRemoveTests } =
      useRemoveTests();

   const { data, isLoading } = useTests(router.query);

   const columns: ColumnDef<TTest>[] = [
      {
         accessorKey: 'id',
         header: ({ table }) => (
            <Checkbox
               checked={table.getIsAllPageRowsSelected()}
               onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
               }
               aria-label="Select all"
            />
         ),
         cell: ({ row }) => (
            <Checkbox
               checked={row.getIsSelected()}
               onCheckedChange={(value) => row.toggleSelected(!!value)}
               aria-label="Select row"
            />
         ),
         enableSorting: false,
         enableHiding: false,
      },
      {
         accessorKey: 'name',
         header: 'Name',
         cell({ row }) {
            return <span className="font-medium">{row.getValue('name')}</span>;
         },
      },
      {
         accessorKey: 'createdAt',
         header: 'Created At',
         cell({ row }) {
            return (
               <span>
                  {new Date(row.getValue('createdAt')).toLocaleString()}
               </span>
            );
         },
      },
      {
         accessorKey: 'actions',
         id: 'actions',
         header: 'Actions',
         cell({ row }) {
            const parts = row.original.parts;
            return (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <IconDots className="w-4 h-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                           <IconBrandGooglePodcasts className="w-4 h-4 mr-2" />
                           Parts
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                           <DropdownMenuSubContent>
                              {parts.map((part) => {
                                 return (
                                    <DropdownMenuItem key={part.id}>
                                       <IconBook2 className="w-4 h-4 mr-2" />
                                       {part.name}
                                    </DropdownMenuItem>
                                 );
                              })}
                           </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                     </DropdownMenuSub>
                     <DropdownMenuSeparator />
                     <CreateUpdateTest
                        onSubmit={async ({ name }, reset, close) => {
                           await handleUpdateTest({
                              id: row.getValue('id'),
                              name,
                           });
                           reset?.();
                           close?.();
                        }}
                        defaultValues={{
                           name: row.getValue('name'),
                        }}
                        testName={row.getValue('name')}
                        type="update"
                     >
                        <DropdownMenuItem
                           onSelect={(e) => {
                              e.preventDefault();
                           }}
                        >
                           <IconEdit className="w-4 h-4 mr-2" />
                           Update{' '}
                        </DropdownMenuItem>
                     </CreateUpdateTest>

                     <Confirm
                        title="Remove test"
                        description={`Are you sure you want to remove ${row.getValue(
                           'name'
                        )} ?`}
                        onConfirm={async (close) => {
                           await handleRemoveTests({
                              [row.getValue('id') as string]: true,
                           });
                           close?.();
                        }}
                     >
                        <DropdownMenuItem
                           className="hover:bg-red-200 hover:text-red-500"
                           onSelect={(e) => {
                              e.preventDefault();
                           }}
                        >
                           <IconTrash className="w-4 h-4 mr-2" />
                           Remove{' '}
                        </DropdownMenuItem>
                     </Confirm>
                  </DropdownMenuContent>
               </DropdownMenu>
            );
         },
      },
   ];

   const filterSearch = useCallback(
      ({
         name,
         limit,
         page,
      }: {
         name?: string;
         page?: number;
         limit?: number;
      }) => {
         const { query } = router;

         if (page) {
            query.page = page ? page.toString() : undefined;
         }

         if (limit) {
            query.limit = limit ? limit.toString() : undefined;
         }

         query.name = name ? name.toString() : undefined;

         router.push({
            pathname: router.pathname,
            query,
         });
      },
      [router]
   );

   const pagination = useMemo(
      () => ({
         pageIndex,
         pageSize,
      }),
      [pageIndex, pageSize]
   );

   console.log(rowSelection);

   const table = useReactTable({
      data: data?.tests || [],
      columns,
      getCoreRowModel: getCoreRowModel(),
      state: {
         pagination,
         rowSelection,
      },
      pageCount: data?.total ? Math.ceil(data?.total / pageSize) : 0,
      onPaginationChange: setPagination,
      manualPagination: true,
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      getRowId: (row, relativeIndex, parent) => {
         // In row object you have access to data.
         // You can choose parameter. In this example I used uniqueId
         return parent ? [parent.id, row.id].join('.') : row.id;
      },
   });

   useEffect(() => {
      filterSearch({
         page: pageIndex + 1,
         limit: pageSize,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pageIndex, pageSize]);

   useEffect(() => {
      filterSearch({
         name: debounceSearch,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [debounceSearch]);

   return (
      <>
         <div className="py-4 space-y-4">
            <h3 className="text-lg font-semibold">Tests Management</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                     <Input
                        className="w-full max-w-xs"
                        placeholder="Search"
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                     />
                     {search && (
                        <Button
                           leftIcon={<IconX />}
                           variants="outline"
                           onClick={() => setSearch('')}
                        >
                           Reset
                        </Button>
                     )}
                  </div>
                  <CreateUpdateTest
                     onSubmit={async ({ name }, reset, close) => {
                        await handleCreateTests(name);
                        reset?.();
                        close?.();
                     }}
                  >
                     <Button leftIcon={<IconPlus />} variants="primary">
                        Create test
                     </Button>
                  </CreateUpdateTest>
               </div>
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
                              colSpan={columns.length}
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
                              colSpan={columns.length}
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
                  onRemoveSelectedRows={async (close) => {
                     await handleRemoveTests(rowSelection);
                     close?.();
                  }}
               />
            </div>
         </div>
         {(isLoadingCreateTest ||
            isLoadingUpdateTest ||
            isLoadingRemoveTests) && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 pointer-events-none"
               classNameLoading="text-primary"
            />
         )}
      </>
   );
};

Tests.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};
export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})();

export default Tests;

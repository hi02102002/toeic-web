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
import { DataTable } from '@/components/shared/table';
import { useCreateTest, useTests, useUpdateTest } from '@/hooks';
import { useDebounce } from '@/hooks/use-debounce';
import { useRemoveTests } from '@/hooks/use-remove-tests';
import { NextPageWithLayout, TTest, TTestQuery } from '@/types';
import { calcPageCount } from '@/utils';
import { withRoute } from '@/utils/withRoute';
import {
   IconBook2,
   IconBrandGooglePodcasts,
   IconDots,
   IconEdit,
   IconPlus,
   IconTrash,
   IconX,
} from '@tabler/icons-react';
import {
   ColumnDef,
   PaginationState,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

const Tests: NextPageWithLayout = () => {
   const router = useRouter();
   const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });
   const [rowSelection, setRowSelection] = useState({});
   const [search, setSearch] = useState<string>('');
   const debounceSearch = useDebounce(search, 500);
   const q: TTestQuery = {
      limit: pageSize,
      name: debounceSearch,
      page: pageIndex + 1,
   };
   const { mutateAsync: handleCreateTests, isLoading: isLoadingCreateTest } =
      useCreateTest(q);

   const { mutateAsync: handleUpdateTest, isLoading: isLoadingUpdateTest } =
      useUpdateTest(q);

   const { mutateAsync: handleRemoveTests, isLoading: isLoadingRemoveTests } =
      useRemoveTests(q);

   const { data, isLoading } = useTests(q);

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
         accessorKey: 'audio',
         header: 'Audio',
         cell({ row }) {
            return <audio src={row.original.audio} controls />;
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
                                    <DropdownMenuItem key={part.id} asChild>
                                       <Link href={`/admin/parts/${part.id}`}>
                                          <IconBook2 className="w-4 h-4 mr-2" />
                                          {part.name}
                                       </Link>
                                    </DropdownMenuItem>
                                 );
                              })}
                           </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                     </DropdownMenuSub>
                     <DropdownMenuSeparator />
                     <CreateUpdateTest
                        onSubmit={async ({ name, audio }, reset, close) => {
                           await handleUpdateTest({
                              id: row.getValue('id'),
                              name,
                              audio:
                                 audio?.[0]?.name === row.original.audio
                                    ? undefined
                                    : audio,
                           });
                           reset?.();
                           close?.();
                        }}
                        defaultValues={{
                           name: row.getValue('name'),
                           audio: row.original.audio,
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

   const pagination = useMemo(
      () => ({
         pageIndex,
         pageSize,
      }),
      [pageIndex, pageSize]
   );

   const table = useReactTable({
      data: data?.tests || [],
      columns,
      getCoreRowModel: getCoreRowModel(),
      state: {
         pagination,
         rowSelection,
      },
      pageCount: calcPageCount(data?.total || 0, pageSize),
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

   return (
      <>
         <div className="py-4 space-y-4">
            <h3 className="text-xl font-semibold">Tests Management</h3>
            <div className="space-y-4">
               <div className="flex flex-col items-center justify-between w-full gap-4 md:flex-row">
                  <div className="flex flex-col items-center w-full gap-4 md:flex-row">
                     <Input
                        className="w-full"
                        placeholder="Search"
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                        classNameContainer="md:max-w-xs w-full"
                     />
                     {search && (
                        <Button
                           leftIcon={<IconX />}
                           variants="outline"
                           onClick={() => setSearch('')}
                           className="w-full md:w-auto"
                        >
                           Reset
                        </Button>
                     )}
                  </div>
                  <CreateUpdateTest
                     onSubmit={async (data, reset, close) => {
                        await handleCreateTests({
                           audio: data?.audio as string,
                           name: data.name,
                        });
                        reset?.();
                        close?.();
                     }}
                  >
                     <Button
                        leftIcon={<IconPlus />}
                        variants="primary"
                        className="flex-shrink-0 w-full md:w-auto"
                     >
                        Create test
                     </Button>
                  </CreateUpdateTest>
               </div>
               <DataTable
                  table={table}
                  onRemoveSelectedRows={async (close) => {
                     await handleRemoveTests(rowSelection);
                     close?.();
                  }}
                  isLoading={isLoading}
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
   return (
      <AdminLayout
         title="Admin | Tests"
         description="Manage tests, create, update, remove tests"
      >
         {page}
      </AdminLayout>
   );
};
export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})();

export default Tests;

import { Confirm, CreateUpdateTopic } from '@/components/app';
import { AdminLayout } from '@/components/layouts/admin';
import {
   Button,
   Checkbox,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   Input,
   LoadingFullPage,
} from '@/components/shared';
import { DataTable } from '@/components/shared/table';
import { ROUTES } from '@/constants';
import {
   useCreateTopic,
   useDebounce,
   useRemoveTopics,
   useTopics,
   useUpdateTopic,
} from '@/hooks';
import { NextPageWithLayout, TTopic, TTopicQuery } from '@/types';
import { calcPageCount } from '@/utils';
import { withRoute } from '@/utils/withRoute';
import {
   IconDots,
   IconEdit,
   IconEye,
   IconTrash,
   IconX,
} from '@tabler/icons-react';
import {
   ColumnDef,
   PaginationState,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Topics: NextPageWithLayout = () => {
   const router = useRouter();
   const [rowSelection, setRowSelection] = useState<Record<string, any>>({});
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });
   const [search, setSearch] = useState('');
   const debouncedSearch = useDebounce(search, 500);

   const q: TTopicQuery = {
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      parentId: router.query.parentId as string,
      name: debouncedSearch,
   };

   const { data, isLoading } = useTopics(q);

   const { mutateAsync: handleCreateTopic, isLoading: isLoadingCreateTopic } =
      useCreateTopic(q);
   const { mutateAsync: handleRemoveTopics, isLoading: isLoadingRemoveTopics } =
      useRemoveTopics(q);
   const { mutateAsync: handleUpdateTopic, isLoading: isLoadingUpdateTopic } =
      useUpdateTopic(q);

   const isLoadingActions =
      isLoadingCreateTopic || isLoadingRemoveTopics || isLoadingUpdateTopic;

   const columns: ColumnDef<TTopic>[] = [
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
         accessorKey: 'id',
         header: 'ID',
      },
      {
         accessorKey: 'name',
         header: 'Topic',
      },
      {
         accessorKey: 'Actions',
         header: 'Actions',
         cell({ row }) {
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
                     <DropdownMenuSeparator />
                     {row.original.hasChild && (
                        <DropdownMenuItem
                           onClick={() => {
                              router.push(
                                 `${ROUTES.ADMINT_TOPICS}?parentId=${row.original.id}`
                              );
                           }}
                        >
                           <IconEye className="w-4 h-4 mr-2" />
                           View children
                        </DropdownMenuItem>
                     )}
                     {!row.original.hasChild && (
                        <DropdownMenuItem
                           onClick={() => {
                              router.push(
                                 `${ROUTES.ADMINT_TOPICS}/${row.original.id}`
                              );
                           }}
                        >
                           <IconEye className="w-4 h-4 mr-2" />
                           View vocabularies
                        </DropdownMenuItem>
                     )}

                     <CreateUpdateTopic
                        onSubmit={async ({ name }, close) => {
                           await handleUpdateTopic({
                              id: row.original.id,
                              data: {
                                 name,
                              },
                           });
                           close?.();
                        }}
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
                     </CreateUpdateTopic>

                     <Confirm
                        title="Remove Topic"
                        description={`Are you sure you want to remove ${row.original.name} ?`}
                        onConfirm={async (close) => {
                           await handleRemoveTopics({
                              [row.original.id]: true,
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

   const table = useReactTable({
      columns,
      data: data?.topics || [],
      getCoreRowModel: getCoreRowModel(),
      state: {
         pagination,
         rowSelection,
      },
      manualPagination: true,
      pageCount: calcPageCount(data?.total || 0, pagination.pageSize),
      onPaginationChange: setPagination,
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      getRowId: (row, relativeIndex, parent) => {
         return parent ? [parent.id, row.id].join('.') : row.id;
      },
   });

   return (
      <div className="py-4 space-y-4">
         <h3 className="text-xl font-semibold">Topics</h3>
         <div className="flex items-center justify-between w-full gap-4 md:flex-row flex-col">
            <div className="flex items-center gap-4 w-full md:flex-row flex-col">
               <Input
                  className="w-full"
                  placeholder="Search"
                  value={search}
                  onChange={(e: any) => setSearch(e.target.value)}
                  classNameContainer="w-full md:max-w-xs"
               />
               {search && (
                  <Button
                     leftIcon={<IconX />}
                     variants="outline"
                     onClick={() => setSearch('')}
                     className=" md:w-auto w-full"
                  >
                     Reset
                  </Button>
               )}
            </div>
            <CreateUpdateTopic
               onSubmit={async ({ name, hasChildren }, onClose) => {
                  await handleCreateTopic({
                     name,
                     parentId: router.query.parentId as string,
                     hasChild: hasChildren,
                  });
                  onClose?.();
               }}
            >
               <Button
                  variants="primary"
                  className="flex-shrink-0 md:w-auto w-full"
               >
                  Add new topic
               </Button>
            </CreateUpdateTopic>
         </div>
         <DataTable
            table={table}
            isLoading={isLoading}
            onRemoveSelectedRows={async (onClose) => {
               await handleRemoveTopics(rowSelection);
               onClose?.();
            }}
         />
         {isLoadingActions && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 pointer-events-none"
               classNameLoading="text-primary"
            />
         )}
      </div>
   );
};

Topics.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})();

export default Topics;

import { Confirm, CreateUpdateGrammar, ViewParagraph } from '@/components/app';
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
   useCreateGrammar,
   useGrammars,
   useRemoveGrammars,
   useUpdateGrammar,
} from '@/hooks';
import { useDebounce } from '@/hooks/use-debounce';
import { NextPageWithLayout, TGrammar, TGrammarQuery } from '@/types';
import { calcPageCount } from '@/utils';
import { withRoute } from '@/utils/withRoute';
import {
   IconBook2,
   IconDots,
   IconEdit,
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
import { useCallback, useEffect, useMemo, useState } from 'react';

type Props = {};

const Grammars: NextPageWithLayout = (props: Props) => {
   const router = useRouter();
   const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });
   const [search, setSearch] = useState<string>('');
   const debounceSearch = useDebounce(search, 500);
   const [rowSelection, setRowSelection] = useState({});

   const q: TGrammarQuery = {
      limit: Number(router.query.limit || pageSize),
      page: Number(router.query.page || pageIndex + 1),
      name: (router.query.name as string) || debounceSearch,
   };
   const { data, isLoading } = useGrammars(q);

   const {
      mutateAsync: handleCreateGrammar,
      isLoading: isLoadingCreateGrammar,
   } = useCreateGrammar(q);

   const {
      mutateAsync: handleUpdateGrammar,
      isLoading: isLoadingUpdateGrammar,
   } = useUpdateGrammar(q);

   const {
      mutateAsync: handleRemoveGrammars,
      isLoading: isLoadingRemoveGrammars,
   } = useRemoveGrammars(q);

   const columns: ColumnDef<TGrammar>[] = useMemo(
      () => [
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
            header: 'Title',
            cell({ row }) {
               return (
                  <span className="font-medium line-clamp-2 whitespace-nowrap">
                     {row.original.name}
                  </span>
               );
            },
         },
         {
            accessorKey: 'theory',
            header: 'Theory',
            cell({ row }) {
               return (
                  <ViewParagraph paragraph={row.original.theory || 'N/A'}>
                     <span className="font-medium cursor-pointer">
                        View paragraph
                     </span>
                  </ViewParagraph>
               );
            },
         },
         {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell({ row }) {
               return (
                  <span className="whitespace-nowrap break-keep">
                     {new Date(row.getValue('createdAt')).toLocaleString()}
                  </span>
               );
            },
         },
         {
            accessorKey: 'actions',
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
                        <DropdownMenuItem
                           onClick={() => {
                              router.push(
                                 `${ROUTES.ADMIN_GRAMMARS}/${row.original.id}`
                              );
                           }}
                        >
                           <IconBook2 className="w-4 h-4 mr-2" />
                           Questions
                        </DropdownMenuItem>
                        <CreateUpdateGrammar
                           onSubmit={async (values, onClose) => {
                              await handleUpdateGrammar({
                                 id: row.original.id,
                                 data: values,
                              });

                              onClose?.();
                           }}
                           defaultValues={{
                              name: row.original.name,
                              theory: row.original.theory,
                           }}
                           type="update"
                        >
                           <DropdownMenuItem
                              onSelect={(e) => {
                                 e.preventDefault();
                              }}
                           >
                              <IconEdit className="w-4 h-4 mr-2" />
                              Update
                           </DropdownMenuItem>
                        </CreateUpdateGrammar>
                        <Confirm
                           title="Are you sure?"
                           description="You will not be able to recover this grammar lesson!"
                           onConfirm={async (onClose) => {
                              await handleRemoveGrammars({
                                 [row.original.id]: true,
                              });

                              onClose?.();
                           }}
                        >
                           <DropdownMenuItem
                              onSelect={(e) => {
                                 e.preventDefault();
                              }}
                           >
                              <IconTrash className="w-4 h-4 mr-2" />
                              Remove
                           </DropdownMenuItem>
                        </Confirm>
                     </DropdownMenuContent>
                  </DropdownMenu>
               );
            },
         },
      ],
      [handleUpdateGrammar, handleRemoveGrammars, router]
   );

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

         if (!router.isReady) {
            return;
         }

         if (page) {
            query.page = page ? page.toString() : undefined;
         }

         if (limit) {
            query.limit = limit ? limit.toString() : undefined;
         }

         query.name = name ? name.toString() : undefined;

         router.replace({
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

   const table = useReactTable({
      columns,
      data: data?.grammars || [],
      getCoreRowModel: getCoreRowModel(),
      pageCount: calcPageCount(data?.total || 0, pagination.pageSize),
      getRowId: (row, relativeIndex, parent) => {
         return parent ? [parent.id, row.id].join('.') : row.id;
      },
      state: {
         rowSelection,
         pagination,
      },
      onRowSelectionChange: setRowSelection,
      enableRowSelection: true,
      onPaginationChange: setPagination,
      manualPagination: true,
   });

   useEffect(() => {
      filterSearch({
         page: pageIndex + 1,
         limit: pageSize,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pagination]);

   useEffect(() => {
      filterSearch({
         name: debounceSearch,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [debounceSearch]);

   return (
      <div className="py-4 space-y-4">
         <h3 className="text-lg font-semibold">Grammars</h3>
         <div className="flex items-center justify-between">
            <div className="flex items-center w-full gap-4">
               <Input
                  className="w-full"
                  placeholder="Search"
                  value={search}
                  onChange={(e: any) => setSearch(e.target.value)}
                  classNameContainer="max-w-xs"
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
            <CreateUpdateGrammar
               onSubmit={async (values, onClose) => {
                  await handleCreateGrammar(values);
                  onClose?.();
               }}
            >
               <Button variants="primary" className="flex-shrink-0">
                  Create lessons
               </Button>
            </CreateUpdateGrammar>
         </div>
         <DataTable
            table={table}
            isLoading={isLoading}
            onRemoveSelectedRows={async (onClose) => {
               await handleRemoveGrammars(rowSelection);
               onClose?.();
            }}
         />
         {(isLoadingCreateGrammar ||
            isLoadingUpdateGrammar ||
            isLoadingRemoveGrammars) && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 "
               classNameLoading="text-primary"
            />
         )}
      </div>
   );
};

Grammars.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})();

export default Grammars;

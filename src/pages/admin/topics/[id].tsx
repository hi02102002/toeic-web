import { Confirm, CreateUpdateWordFlashcard } from '@/components/app';

import { AdminLayout } from '@/components/layouts/admin';
import {
   Button,
   Checkbox,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger,
   ImageClickAble,
   Input,
   LoadingFullPage,
} from '@/components/shared';
import { DataTable } from '@/components/shared/table';
import {
   useCreateWord,
   useDebounce,
   useRemoveWords,
   useUpdateWord,
} from '@/hooks';
import { useWords } from '@/hooks/use-words';
import { http_server } from '@/libs/axios';
import {
   NextPageWithLayout,
   TBaseResponse,
   TTopic,
   TWord,
   TWordQuery,
} from '@/types';
import { calcPageCount } from '@/utils';
import { withRoute } from '@/utils/withRoute';
import { IconDots, IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import {
   ColumnDef,
   PaginationState,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useState } from 'react';

type Props = {};

const Words: NextPageWithLayout = (props: Props) => {
   const router = useRouter();
   const [search, setSearch] = useState<string>('');
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });
   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
      {}
   );
   const debouncedSearch = useDebounce(search, 500);
   const query: TWordQuery = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      name: debouncedSearch,
   };
   const { data, isLoading } = useWords(router.query.id as string, query);
   const { mutateAsync: handleCreateWord, isLoading: isLoadingCreateWord } =
      useCreateWord(router.query.id as string, query);
   const { mutateAsync: handleUpdateWord, isLoading: isLoadingUpdateWord } =
      useUpdateWord(router.query.id as string, query);
   const { mutateAsync: handleRemoveWords, isLoading: isLoadingRemoveWords } =
      useRemoveWords(router.query.id as string, query);
   const isLoadingAction =
      isLoadingCreateWord || isLoadingUpdateWord || isLoadingRemoveWords;

   const columns: ColumnDef<TWord>[] = [
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
      },
      {
         accessorKey: 'image',
         header: 'Image',
         cell({ row }) {
            return row.original.image ? (
               <ImageClickAble
                  src={row.original.image}
                  alt={row.original.name}
                  height={500}
                  width={500}
               />
            ) : (
               <span>N/A</span>
            );
         },
      },

      {
         accessorKey: 'patchOfSpeech',
         header: 'Patch of speech',
      },
      {
         accessorKey: 'pronunciation',
         header: 'Pronunciation',
      },
      {
         accessorKey: 'audios',
         header: 'Audios',
         cell({ row }) {
            return row.original.audios && row.original.audios.length > 0 ? (
               <span className="block space-y-2 whitespace-nowrap break-keep">
                  {row.original.audios?.map((audio) => (
                     <audio key={audio.src} src={audio.src} controls />
                  ))}
               </span>
            ) : (
               <span>N/A</span>
            );
         },
      },
      {
         accessorKey: 'definition',
         header: 'Definition',
      },
      {
         accessorKey: 'meaning',
         header: 'Meaning',
         cell({ row }) {
            return row.original.meaning ? (
               <span>{row.original.meaning}</span>
            ) : (
               <span>N/A</span>
            );
         },
      },
      {
         accessorKey: 'note',
         header: 'Note',
         cell({ row }) {
            return row.original.note ? (
               <span>{row.original.note}</span>
            ) : (
               <span>N/A</span>
            );
         },
      },
      {
         accessorKey: 'examples',
         header: 'Examples',
         cell({ row }) {
            return row.original.examples && row.original.examples.length > 0 ? (
               <span className="whitespace-nowrap break-keep">
                  {row.original.examples?.map((example) => (
                     <p key={example}>{example}</p>
                  ))}
               </span>
            ) : (
               <span>N/A</span>
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
                     <Button variants="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <IconDots className="w-4 h-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>

                     <CreateUpdateWordFlashcard
                        title="Update word"
                        onSubmit={async ({ values, close }) => {
                           await handleUpdateWord({
                              id: row.original.id,
                              data: values,
                           });
                           close?.();
                        }}
                        type="update"
                        defaultValues={{
                           name: row.original.name,
                           definition: row.original.definition || '',
                           examples: row.original.examples,
                           meaning: row.original.meaning,
                           note: row.original.note,
                           patchOfSpeech: row.original.patchOfSpeech,
                           pronunciation: row.original.pronunciation,
                           image: row.original.image,
                        }}
                     >
                        <DropdownMenuItem
                           onSelect={(e) => {
                              e.preventDefault();
                           }}
                        >
                           <IconEdit className="w-4 h-4 mr-2" />
                           Update{' '}
                        </DropdownMenuItem>
                     </CreateUpdateWordFlashcard>

                     <Confirm
                        title="Remove word"
                        description={`Are you sure you want to remove ${row.original.name} ?`}
                        onConfirm={async (close) => {
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
      data: data?.words || [],
      getCoreRowModel: getCoreRowModel(),
      manualPagination: true,
      state: {
         pagination,
         rowSelection,
      },
      pageCount: calcPageCount(data?.total || 0, pagination.pageSize),
      onPaginationChange: setPagination,
      onRowSelectionChange: setRowSelection,
      getRowId: (row, relativeIndex, parent) => {
         return parent ? [parent.id, row.id].join('.') : row.id;
      },
      enableRowSelection: true,
   });

   return (
      <div className="py-4 space-y-4">
         <h3 className="text-lg font-semibold">Words</h3>
         <div className="space-y-4">
            <div className="flex items-center justify-between w-full">
               <div className="flex items-center gap-4">
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
               <CreateUpdateWordFlashcard
                  title="Add new word"
                  onSubmit={async ({ values, close }) => {
                     await handleCreateWord(values);
                     close?.();
                  }}
               >
                  <Button variants="primary">Add new word</Button>
               </CreateUpdateWordFlashcard>
            </div>
            <DataTable
               table={table}
               isLoading={isLoading}
               onRemoveSelectedRows={async (onClose) => {
                  await handleRemoveWords(rowSelection);
                  onClose?.();
               }}
            />
         </div>
         {isLoadingAction && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 pointer-events-none"
               classNameLoading="text-primary"
            />
         )}
      </div>
   );
};

Words.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: false,
})(async ({ ctx, access_token, refresh_token }) => {
   const id = ctx.params?.id as string;

   try {
      const res: TBaseResponse<TTopic> = await http_server(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         `/topics/${id}`
      );
      if (!res.data) {
         return {
            notFound: true,
         };
      }

      return {
         props: {},
      };
   } catch (error) {
      return {
         notFound: true,
      };
   }
});

export default Words;

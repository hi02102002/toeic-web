import { Confirm, CreateUpdateCommonQuestion } from '@/components/app';
import { AdminLayout } from '@/components/layouts/admin';
import {
   Button,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   LoadingFullPage,
} from '@/components/shared';
import { DataTable } from '@/components/shared/table';
import {
   useCreateQuestion,
   useGrammar,
   useQuestions,
   useRemoveQuestions,
} from '@/hooks';
import { useUpdateQuestion } from '@/hooks/use-update-question';
import { http_server } from '@/libs/axios';
import {
   NextPageWithLayout,
   TGrammar,
   TQuestion,
   TQuestionQuery,
} from '@/types';
import { calcPageCount } from '@/utils';
import { tableQuestionColumns } from '@/utils/table';
import { withRoute } from '@/utils/withRoute';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import {
   ColumnDef,
   PaginationState,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

type Props = {
   grammar: TGrammar;
};

const Grammar: NextPageWithLayout<Props> = ({ grammar: initGrammar }) => {
   const router = useRouter();
   const { data: grammar } = useGrammar(router.query.id as string, initGrammar);
   const [rowSelection, setRowSelection] = useState({});
   const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });

   const q: TQuestionQuery = {
      grammarId: (router.query.id as string) || initGrammar.id,
      limit: pageSize,
      page: pageIndex + 1,
   };

   const { data, isLoading } = useQuestions(q);

   const {
      mutateAsync: handleCreateQuestion,
      isLoading: isLoadingCreateQuestion,
   } = useCreateQuestion(q);

   const {
      mutateAsync: handleRemoveQuestions,
      isLoading: isLoadingRemoveQuestions,
   } = useRemoveQuestions(q);

   const {
      mutateAsync: handleUpdateQuestion,
      isLoading: isLoadingUpdateQuestion,
   } = useUpdateQuestion(q);

   const columns: ColumnDef<TQuestion>[] = useMemo(
      () => [
         tableQuestionColumns['id'],
         tableQuestionColumns['text'],
         tableQuestionColumns['createdAt'],
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
                        <CreateUpdateCommonQuestion
                           type="update"
                           onSubmit={async ({ close, values, resetForm }) => {
                              await handleUpdateQuestion({
                                 data: {
                                    ...values,
                                    answers: values.answers.map((a) => ({
                                       content: a.content,
                                       id: a.id as string,
                                       isCorrect: a.isCorrect,
                                    })),
                                 },
                                 id: row.original.id,
                              });
                           }}
                           defaultValues={{
                              text: row.original.text,
                              explain: row.original.explain,
                              answers: row.original.answers,
                           }}
                        >
                           <DropdownMenuItem
                              onSelect={(e) => {
                                 e.preventDefault();
                              }}
                           >
                              <IconEdit className="w-4 h-4 mr-2" />
                              Update
                           </DropdownMenuItem>
                        </CreateUpdateCommonQuestion>
                        <Confirm
                           title="Are you sure?"
                           description="You will not be able to recover this question!"
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
      [handleUpdateQuestion]
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
      data: data?.questions || [],
      getCoreRowModel: getCoreRowModel(),
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
      pageCount: calcPageCount(data?.total || 0, pageSize),
   });

   return (
      <>
         <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-semibold">
                  Questions of {grammar?.name}
               </h3>
               <CreateUpdateCommonQuestion
                  onSubmit={async ({ values, close, resetForm }) => {
                     await handleCreateQuestion({
                        grammarId: router.query.id as string,
                        explain: values.explain,
                        text: values.text,
                        answers: values.answers.map((a) => ({
                           content: a.content,
                           isCorrect: a.isCorrect,
                        })),
                     });
                     close?.();
                     resetForm?.();
                  }}
               >
                  <Button variants="primary">Create question</Button>
               </CreateUpdateCommonQuestion>
            </div>
            <DataTable
               table={table}
               isLoading={isLoading}
               onRemoveSelectedRows={async (onClose) => {
                  await handleRemoveQuestions(rowSelection);
                  onClose?.();
               }}
            />
         </div>
         {(isLoadingCreateQuestion ||
            isLoadingRemoveQuestions ||
            isLoadingUpdateQuestion) && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 "
               classNameLoading="text-primary"
            />
         )}
      </>
   );
};

Grammar.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})(async ({ access_token, refresh_token, ctx }) => {
   const id = ctx.params?.id as string;

   try {
      const grammar = await http_server(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         `/grammars/${id}`
      )
         .then((r) => r.data)
         .catch(() => null);

      if (!grammar) {
         return {
            notFound: true,
         };
      }

      return {
         props: {
            grammar,
         },
      };
   } catch (error) {
      return {
         notFound: true,
      };
   }
});

export default Grammar;

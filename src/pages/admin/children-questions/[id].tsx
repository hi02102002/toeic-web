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
import { useCreateQuestion, useQuestion, useQuestions } from '@/hooks';
import { useUpdateQuestion } from '@/hooks/use-update-question';
import { http_server } from '@/libs/axios';
import {
   NextPageWithLayout,
   PartType,
   TQuestion,
   TQuestionQuery,
} from '@/types';
import { tableQuestionColumns } from '@/utils/table';
import { withRoute } from '@/utils/withRoute';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import {
   ColumnDef,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

type Props = {
   question: TQuestion;
};

const ChildrenQuestions: NextPageWithLayout<Props> = ({
   question: initQuestion,
}) => {
   const router = useRouter();

   const q: TQuestionQuery = {
      parentId: (router.query.id as string) || initQuestion.id,
   };

   const { data: question } = useQuestion(
      router.query.id as string,
      initQuestion
   );

   const { data, isLoading } = useQuestions(q);

   const {
      mutateAsync: handleCreateQuestion,
      isLoading: isLoadingCreateQuestion,
   } = useCreateQuestion(q);

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
                           onSubmit={async ({ close, values }) => {
                              await handleUpdateQuestion({
                                 data: {
                                    answers: values.answers.map((answer) => ({
                                       content: answer.content,
                                       isCorrect: answer.isCorrect,
                                       id: answer.id as string,
                                    })),
                                    text: values.text,
                                    explain: values.explain,
                                    partType: question?.part.type as PartType,
                                    parentId: question?.id as string,
                                 },
                                 id: row.original.id,
                              });
                              close?.();
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
      [question, handleUpdateQuestion]
   );

   const table = useReactTable({
      columns,
      data: data?.questions || [],
      getCoreRowModel: getCoreRowModel(),
   });

   return (
      <div>
         <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-semibold">Sub questions</h3>
               <CreateUpdateCommonQuestion
                  type="create"
                  onSubmit={async ({ close, values }) => {
                     await handleCreateQuestion({
                        partType: question?.part.type as PartType,
                        parentId: question?.id as string,
                        answers: values.answers,
                        text: values.text,
                        explain: values.explain,
                     });
                     close?.();
                  }}
               >
                  <Button variants="primary">Create questions</Button>
               </CreateUpdateCommonQuestion>
            </div>
            <div>
               <DataTable table={table} isLoading={isLoading} />
            </div>
         </div>
         {(isLoadingCreateQuestion || isLoadingUpdateQuestion) && (
            <LoadingFullPage
               className="backdrop-blur-sm z-[10000] fixed inset-0 bg-transparent"
               classNameLoading="text-primary"
            />
         )}
      </div>
   );
};

ChildrenQuestions.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})(async ({ ctx, access_token, refresh_token }) => {
   const id = ctx.query.id as string;

   const question = await http_server(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      `/questions/${id}`
   )
      .then((res) => res.data)
      .catch((e) => {
         return null;
      });

   if (!question) {
      return {
         notFound: true,
      };
   }

   return {
      props: {
         question,
      },
   };
});

export default ChildrenQuestions;

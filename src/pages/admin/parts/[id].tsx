import {
   Confirm,
   CreateUpdateCommonQuestion,
   CreateUpdateQuestionPart1,
   CreateUpdateQuestionPart2,
   CreateUpdateQuestionPart34,
   CreateUpdateQuestionPart67,
} from '@/components/app';
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
import { ROUTES } from '@/constants';
import {
   useCreateQuestion,
   usePart,
   useQuestions,
   useRemoveQuestions,
} from '@/hooks';
import { useUpdateQuestion } from '@/hooks/use-update-question';
import { http_server } from '@/libs/axios';
import {
   NextPageWithLayout,
   PartType,
   TBaseResponse,
   TPart,
   TQuestion,
   TTest,
} from '@/types';
import { calcPageCount } from '@/utils';
import { tableQuestionColumns } from '@/utils/table';
import { withRoute } from '@/utils/withRoute';
import {
   IconBrandStorytel,
   IconDots,
   IconEdit,
   IconTrash,
} from '@tabler/icons-react';
import {
   ColumnDef,
   PaginationState,
   Row,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Props = {
   part: TPart & {
      test: Pick<TTest, 'id' | 'name'>;
   };
};

const Part: NextPageWithLayout<Props> = ({ part: initPart }) => {
   const router = useRouter();
   const [rowSelection, setRowSelection] = useState({});
   const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });

   const q = useMemo(() => {
      return {
         page: pageIndex + 1,
         limit: pageSize,
         partId: router.query.id as string,
      };
   }, [router.query.id, pageIndex, pageSize]);

   const { data: part } = usePart(router.query.id as string, initPart);
   const {
      mutateAsync: handleCreateQuestion,
      isLoading: isLoadingCreateQuestion,
   } = useCreateQuestion(q);

   const { data, isLoading: isLoadingQuestions } = useQuestions(q);

   const {
      mutateAsync: handleUpdateQuestion,
      isLoading: isLoadingUpdateQuestion,
   } = useUpdateQuestion(q);

   const {
      mutateAsync: handleRemoveQuestions,
      isLoading: isLoadingRemoveQuestions,
   } = useRemoveQuestions(q);

   const renderCreate = useCallback(() => {
      switch (part?.type) {
         case PartType.PART1:
            return (
               <CreateUpdateQuestionPart1
                  onSubmit={async ({ values, resetForm, close }) => {
                     await handleCreateQuestion({
                        ...values,
                        partType: 'PART1',
                        partId: part?.id as string,
                     });
                     resetForm?.();
                     close?.();
                  }}
               >
                  <Button variants="primary">Create question</Button>
               </CreateUpdateQuestionPart1>
            );
         case PartType.PART2:
            return (
               <CreateUpdateQuestionPart2
                  onSubmit={async ({ values, resetForm, close }) => {
                     await handleCreateQuestion({
                        ...values,
                        partType: 'PART2',
                        partId: part?.id as string,
                     });
                     resetForm?.();
                     close?.();
                  }}
               >
                  <Button variants="primary">Create question</Button>
               </CreateUpdateQuestionPart2>
            );
         case PartType.PART3:
         case PartType.PART4:
            return (
               <CreateUpdateQuestionPart34
                  onSubmit={async ({ values, resetForm, close }) => {
                     await handleCreateQuestion({
                        ...values,
                        partType: part.type,
                        partId: part?.id as string,
                     });
                     resetForm?.();
                     close?.();
                  }}
               >
                  <Button variants="primary">Create question</Button>
               </CreateUpdateQuestionPart34>
            );
         case PartType.PART5:
            return (
               <CreateUpdateCommonQuestion
                  onSubmit={async ({ values, resetForm, close }) => {
                     await handleCreateQuestion({
                        ...values,
                        partType: part.type,
                        partId: part?.id as string,
                     });
                     resetForm?.();
                     close?.();
                  }}
               >
                  <Button variants="primary">Create question</Button>
               </CreateUpdateCommonQuestion>
            );
         case PartType.PART6:
         case PartType.PART7:
            return (
               <CreateUpdateQuestionPart67
                  onSubmit={async ({ values, resetForm, close }) => {
                     await handleCreateQuestion({
                        ...values,
                        partType: part.type,
                        partId: part?.id as string,
                     });
                     resetForm?.();
                     close?.();
                  }}
               >
                  <Button variants="primary">Create question</Button>
               </CreateUpdateQuestionPart67>
            );
         default:
            return null;
      }
   }, [part, handleCreateQuestion]);

   const renderUpdate = useCallback(
      (row: Row<TQuestion>) => {
         switch (part?.type) {
            case PartType.PART1:
               return (
                  <CreateUpdateQuestionPart1
                     onSubmit={async ({ values, resetForm, close }) => {
                        await handleUpdateQuestion({
                           data: {
                              explain: values.explain,
                              partType: 'PART1',
                              audio:
                                 values.audio?.[0].name === row.original.audio
                                    ? undefined
                                    : values.audio,
                              image:
                                 values.image?.[0].name === row.original.image
                                    ? undefined
                                    : values.image,
                              partId: row.original.partId,
                              transcript: values.transcript,
                              answers: values.answers.map((answer) => ({
                                 content: answer.content,
                                 isCorrect: answer.isCorrect,
                                 id: answer.id as string,
                              })),
                           },
                           id: row.original.id,
                        });
                        resetForm?.();
                        close?.();
                     }}
                     defaultValues={{
                        image: row.getValue('image'),
                        audio: row.getValue('audio'),
                        answers: row.original.answers.map((answer) => ({
                           content: answer.content,
                           isCorrect: answer.isCorrect,
                           id: answer.id,
                        })),
                        explain: row.original.explain,
                        transcript: row.original.transcript,
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
                  </CreateUpdateQuestionPart1>
               );
            case PartType.PART2:
               return (
                  <CreateUpdateQuestionPart2
                     onSubmit={async ({ values, resetForm, close }) => {
                        await handleUpdateQuestion({
                           data: {
                              explain: values.explain,
                              partType: 'PART2',
                              audio:
                                 values.audio?.[0].name === row.original.audio
                                    ? undefined
                                    : values.audio,
                              partId: row.original.partId,
                              transcript: values.transcript,
                              answers: values.answers.map((answer) => ({
                                 content: answer.content,
                                 isCorrect: answer.isCorrect,
                                 id: answer.id as string,
                              })),
                           },
                           id: row.original.id,
                        });
                        resetForm?.();
                        close?.();
                     }}
                     defaultValues={{
                        audio: row.getValue('audio'),
                        answers: row.original.answers.map((answer) => ({
                           content: answer.content,
                           isCorrect: answer.isCorrect,
                           id: answer.id,
                        })),
                        explain: row.original.explain,
                        transcript: row.original.transcript,
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
                  </CreateUpdateQuestionPart2>
               );
            case PartType.PART3:
            case PartType.PART4:
               return (
                  <>
                     <DropdownMenuItem
                        onClick={() => {
                           router.push(
                              `${ROUTES.ADMIN_CHILDREN_QUESTIONS}/${row.original.id}`
                           );
                        }}
                     >
                        <IconBrandStorytel className="w-4 h-4 mr-2" />
                        Children questions
                     </DropdownMenuItem>
                     <CreateUpdateQuestionPart34
                        onSubmit={async ({ values, resetForm, close }) => {
                           await handleUpdateQuestion({
                              data: {
                                 partType: part.type as PartType,
                                 audio:
                                    values.audio?.[0]?.name ===
                                    row.original.audio
                                       ? undefined
                                       : values.audio,
                                 image:
                                    values.image?.[0]?.name ===
                                    row.original.image
                                       ? undefined
                                       : values.image,
                                 partId: row.original.partId,
                                 transcript: values.transcript,
                                 answers: [],
                              },
                              id: row.original.id,
                           });
                           resetForm?.();
                           close?.();
                        }}
                        defaultValues={{
                           image: row.original.image,
                           audio: row.original.audio,
                           transcript: row.original.transcript,
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
                     </CreateUpdateQuestionPart34>
                  </>
               );
            case PartType.PART5:
               return (
                  <CreateUpdateCommonQuestion
                     onSubmit={async ({ values, resetForm, close }) => {
                        await handleUpdateQuestion({
                           data: {
                              partType: part.type as PartType,
                              text: values.text,
                              answers: values.answers.map((answer) => ({
                                 content: answer.content,
                                 isCorrect: answer.isCorrect,
                                 id: answer.id as string,
                              })),
                              explain: values.explain,
                           },
                           id: row.original.id,
                        });
                        resetForm?.();
                        close?.();
                     }}
                     type="update"
                     defaultValues={{
                        text: row.original.text,
                        answers: row.original.answers.map((answer) => ({
                           content: answer.content,
                           isCorrect: answer.isCorrect,
                           id: answer.id as string,
                        })),
                        explain: row.original.explain,
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
               );
            case PartType.PART6:
            case PartType.PART7:
               return (
                  <>
                     <DropdownMenuItem
                        onClick={() => {
                           router.push(
                              `${ROUTES.ADMIN_CHILDREN_QUESTIONS}/${row.original.id}`
                           );
                        }}
                     >
                        <IconBrandStorytel className="w-4 h-4 mr-2" />
                        Children questions
                     </DropdownMenuItem>
                     <CreateUpdateQuestionPart67
                        onSubmit={async ({ values, resetForm, close }) => {
                           await handleUpdateQuestion({
                              data: {
                                 partType: part.type as PartType,
                                 text: values.text,
                                 answers: [],
                              },
                              id: row.original.id,
                           });
                           resetForm?.();
                           close?.();
                        }}
                        type="update"
                        defaultValues={{
                           text: row.original.text,
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
                     </CreateUpdateQuestionPart67>
                  </>
               );
            default:
               return null;
         }
      },
      [part, handleUpdateQuestion, router]
   );

   const columns: ColumnDef<TQuestion>[] = useMemo(() => {
      const colActions: ColumnDef<TQuestion> = {
         accessorKey: 'actions',
         id: 'actions',
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
                     {renderUpdate(row)}
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
      };

      switch (part?.type) {
         case PartType.PART1:
            return [
               tableQuestionColumns['id'],
               tableQuestionColumns['image'],
               tableQuestionColumns['audio'],
               tableQuestionColumns['createdAt'],
               colActions,
            ];

         case PartType.PART2:
         case PartType.PART3:
         case PartType.PART4:
            return [
               tableQuestionColumns['id'],
               tableQuestionColumns['audio'],
               tableQuestionColumns['image'],
               tableQuestionColumns['createdAt'],
               colActions,
            ];
         case PartType.PART5:
            return [
               tableQuestionColumns['id'],
               tableQuestionColumns['text'],
               tableQuestionColumns['createdAt'],
               colActions,
            ];
         case PartType.PART6:
         case PartType.PART7:
            return [
               tableQuestionColumns['id'],
               tableQuestionColumns['paragraph'],
               tableQuestionColumns['createdAt'],
               colActions,
            ];
         default:
            return [];
      }
   }, [renderUpdate, part?.type]);

   const table = useReactTable({
      data: data?.questions || [],
      columns,
      getCoreRowModel: getCoreRowModel(),
      getRowId: (row, relativeIndex, parent) => {
         return parent ? [parent.id, row.id].join('.') : row.id;
      },
      state: {
         rowSelection,
         pagination: {
            pageIndex,
            pageSize,
         },
      },
      onRowSelectionChange: setRowSelection,
      enableRowSelection: true,
      onPaginationChange: setPagination,
      manualPagination: true,
      pageCount: calcPageCount(data?.total || 0, pageSize),
   });

   useEffect(() => {
      router.replace({
         pathname: router.pathname,
         query: {
            ...router.query,
            page: pageIndex + 1,
            limit: pageSize,
         },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pageIndex, pageSize]);

   return (
      <>
         <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-semibold">
                  {part?.test.name} - {part?.name}
               </h3>
               {renderCreate()}
            </div>
            <DataTable
               table={table}
               isLoading={isLoadingQuestions}
               onRemoveSelectedRows={async (onClose) => {
                  await handleRemoveQuestions(rowSelection);
                  onClose?.();
               }}
            />
         </div>
         {(isLoadingCreateQuestion ||
            isLoadingUpdateQuestion ||
            isLoadingRemoveQuestions) && (
            <LoadingFullPage
               className="backdrop-blur-sm z-[10000] fixed inset-0 bg-transparent"
               classNameLoading="text-primary"
            />
         )}
      </>
   );
};

Part.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})(async ({ access_token, refresh_token, ctx }) => {
   const id = ctx.params?.id as string;

   const res: TBaseResponse<
      TPart & {
         test: Pick<TTest, 'id' | 'name'>;
      }
   > = await http_server(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      `/tests/parts/${id}`
   );

   if (!res.data) {
      return {
         notFound: true,
      };
   }

   return {
      props: {
         part: res.data,
      },
   };
});

export default Part;

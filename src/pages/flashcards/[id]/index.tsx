import {
   Confirm,
   CreateUpdateDeck,
   CreateUpdateWordFlashcard,
} from '@/components/app';
import { FlashcardCard } from '@/components/app/flashcard';
import { AppLayout } from '@/components/layouts/app';
import {
   Button,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   LoadingFullPage,
   Pagination,
} from '@/components/shared';
import { ROUTES } from '@/constants';
import {
   useCreateFlashcard,
   useDeck,
   useFlashcardsChart,
   useRemoveDeck,
   useRemoveFlashcard,
   useUpdateDeck,
   useUpdateFlashcard,
} from '@/hooks';
import { useFlashcards } from '@/hooks/use-flashcards';
import { http_server } from '@/libs/axios';
import {
   NextPageWithLayout,
   TBaseResponse,
   TDeck,
   TFlashcardQuery,
} from '@/types';
import { withRoute } from '@/utils/withRoute';
import {
   IconEdit,
   IconLoader2,
   IconNotebook,
   IconPlus,
   IconTrashX,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
   Bar,
   BarChart,
   CartesianGrid,
   Legend,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from 'recharts';
type Props = {
   deck: TDeck;
};

const Flashcards: NextPageWithLayout<Props> = ({ deck: initDeck }) => {
   const [page, setPage] = useState(0);
   const { data: deck } = useDeck(initDeck.id, initDeck);
   const router = useRouter();

   const q: TFlashcardQuery = {
      deckId: initDeck.id,
      page: page + 1,
      limit: 20,
   };

   const { mutateAsync: handleRemoveDeck, isLoading: isLoadingRemoveDeck } =
      useRemoveDeck();
   const { mutateAsync: handleUpdateDeck, isLoading: isLoadingUpdateDeck } =
      useUpdateDeck(initDeck.id);
   const { data: resFlashcards, isLoading: isLoadingFlashcards } =
      useFlashcards(q);
   const {
      mutateAsync: handleCreateFlashcard,
      isLoading: isLoadingCreateFlashcard,
   } = useCreateFlashcard(q);
   const {
      mutateAsync: handleUpdateFlashcard,
      isLoading: isLoadingUpdateFlashcard,
   } = useUpdateFlashcard(q);

   const {
      mutateAsync: handleRemoveFlashcard,
      isLoading: isLoadingRemoveFlashcard,
   } = useRemoveFlashcard(q);

   const { data: resFlashcardsChart, isLoading: isLoadingFlashcardsChart } =
      useFlashcardsChart({
         deckId: initDeck.id,
      });

   const isLoadingActions =
      isLoadingRemoveDeck ||
      isLoadingUpdateDeck ||
      isLoadingCreateFlashcard ||
      isLoadingUpdateFlashcard ||
      isLoadingRemoveFlashcard;

   return (
      <>
         <div className="container py-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
               <h3 className="text-lg font-semibold">
                  Flashcards of {deck.name}
               </h3>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variants="primary">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => {
                           router.push(
                              `${ROUTES.FLASHCARDS}/${deck.id}/learning`
                           );
                        }}
                     >
                        <IconNotebook className="w-5 h-5" />
                        Start learning
                     </DropdownMenuItem>
                     <CreateUpdateWordFlashcard
                        title="Add new flashcard"
                        type="create"
                        onSubmit={async ({ values, close }) => {
                           await handleCreateFlashcard({
                              ...values,
                              deckId: deck.id,
                           });
                           close?.();
                        }}
                     >
                        <DropdownMenuItem
                           className="flex items-center gap-2"
                           onSelect={(e) => {
                              e.preventDefault();
                           }}
                        >
                           <IconPlus className="w-5 h-5" />
                           Add new flashcard
                        </DropdownMenuItem>
                     </CreateUpdateWordFlashcard>
                     <CreateUpdateDeck
                        type="update"
                        onSubmit={async ({ values, close }) => {
                           await handleUpdateDeck(values.name);
                           close?.();
                        }}
                        defaultValues={{
                           name: deck.name,
                        }}
                     >
                        <DropdownMenuItem
                           className="flex items-center gap-2"
                           onSelect={(e) => {
                              e.preventDefault();
                           }}
                        >
                           <IconEdit className="w-5 h-5" />
                           Update
                        </DropdownMenuItem>
                     </CreateUpdateDeck>
                     <Confirm
                        title="Remove your deck?"
                        description={`Are you sure you want to remove ${deck.name} ?`}
                        onConfirm={async (close) => {
                           await handleRemoveDeck(deck.id);
                           close?.();
                        }}
                     >
                        <DropdownMenuItem
                           className="flex items-center gap-2"
                           onSelect={(e) => {
                              e.preventDefault();
                           }}
                        >
                           <IconTrashX className="w-5 h-5" />
                           Remove
                        </DropdownMenuItem>
                     </Confirm>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
            {isLoadingFlashcards || isLoadingFlashcardsChart ? (
               <div className="flex items-center justify-center">
                  <IconLoader2 className="w-5 h-5 animate-spin" />
               </div>
            ) : (
               <>
                  {resFlashcards?.flashcards.length === 0 ? (
                     <div className="flex items-center justify-center font-medium text-center">
                        Not found any flashcards
                     </div>
                  ) : (
                     <>
                        <div className="h-96">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                 width={500}
                                 height={300}
                                 data={resFlashcardsChart || []}
                                 margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                 }}
                              >
                                 <CartesianGrid strokeDasharray="3 3" />
                                 <XAxis dataKey="date" />
                                 <YAxis />
                                 <Tooltip wrapperClassName="rounded border-border border" />
                                 <Legend />
                                 <Bar dataKey="learned" fill="#27272a" />
                                 <Bar dataKey="reviewed" fill="#7f7f80" />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                        <ul className="space-y-4">
                           {resFlashcards?.flashcards.map((flashcard) => {
                              return (
                                 <li key={flashcard.id}>
                                    <FlashcardCard
                                       flashcard={flashcard}
                                       onRemove={async (id) => {
                                          await handleRemoveFlashcard(id);
                                       }}
                                       onUpdate={async (values) => {
                                          await handleUpdateFlashcard({
                                             data: values,
                                             id: flashcard.id,
                                          });
                                       }}
                                    />
                                 </li>
                              );
                           })}
                        </ul>
                     </>
                  )}
                  <Pagination
                     total={resFlashcards?.total || 0}
                     pageValue={page}
                     perPage={20}
                     onPaginationChange={(page) => {
                        setPage(page);
                        window.scrollTo({
                           top: 0,
                           behavior: 'smooth',
                        });
                     }}
                  />
               </>
            )}
         </div>
         {isLoadingActions && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 pointer-events-none"
               classNameLoading="text-primary"
            />
         )}
      </>
   );
};

Flashcards.getLayout = (page) => {
   return (
      <AppLayout
         title={`Toiec | Flashcards of ${page.props?.deck.name}`}
         description="List of flashcards"
      >
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: false,
})(async ({ access_token, refresh_token, ctx }) => {
   const id = ctx.params?.id as string;

   try {
      const res: TBaseResponse<TDeck> = await http_server(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         `/decks/${id}`
      );
      return {
         props: {
            deck: res.data,
         },
      };
   } catch (error) {
      return {
         notFound: true,
      };
   }
});

export default Flashcards;

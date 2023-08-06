import { CreateUpdateDeck } from '@/components/app';
import { DeckCard } from '@/components/app/flashcard';
import { AppLayout } from '@/components/layouts/app';
import { Button, LoadingFullPage, Pagination } from '@/components/shared';
import { useCreateDeck } from '@/hooks';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TBaseResponse, TDeck } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { useRouter } from 'next/router';

type Props = {
   decks: TDeck[];
   total: number;
};

const Flashcards: NextPageWithLayout<Props> = ({ decks, total }) => {
   const router = useRouter();
   const { mutateAsync: handleCreateDeck, isLoading: isLoadingCreateDeck } =
      useCreateDeck();
   return (
      <div className="container py-4 space-y-4">
         <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Your Decks</h3>
            <CreateUpdateDeck
               type="create"
               onSubmit={async ({ values, close }) => {
                  await handleCreateDeck(values.name);
                  close?.();
               }}
            >
               <Button variants="primary">Create new deck</Button>
            </CreateUpdateDeck>
         </div>
         {decks.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
               {decks.map((deck) => {
                  return (
                     <li key={deck.id}>
                        <DeckCard deck={deck} />
                     </li>
                  );
               })}
            </ul>
         ) : (
            <div className="flex items-center justify-center h-full">
               <span className="font-medium">Not have any decks</span>
            </div>
         )}
         <div className="flex items-center justify-center md:justify-start">
            <Pagination
               total={total}
               perPage={10}
               onPaginationChange={(value) => {
                  router.push({
                     pathname: router.pathname,
                     query: {
                        ...router.query,
                        page: value + 1,
                        limit: 10,
                     },
                  });
               }}
            />
         </div>
         {isLoadingCreateDeck && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 pointer-events-none"
               classNameLoading="text-primary"
            />
         )}
      </div>
   );
};

Flashcards.getLayout = (page) => {
   return (
      <AppLayout title="Toiec | Flashcard" description="List of flashcards">
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: false,
})(async ({ access_token, refresh_token, ctx }) => {
   const query = ctx.query;
   const res: TBaseResponse<{
      decks: TDeck[];
      total: number;
   }> = await http_server(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      '/decks',
      {
         page: query.page || 1,
         limit: query.limit || 10,
      }
   );

   return {
      props: {
         ...res.data,
      },
   };
});

export default Flashcards;

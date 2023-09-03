import { DeckCard, FlashcardChart } from '@/components/app/flashcard';
import { ToiecTestCard } from '@/components/app/toiec-test';
import { AppLayout } from '@/components/layouts/app';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TBaseResponse, TDeck, TTest } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {
   recentDecks: Array<TDeck>;
   recentTests: Array<{
      id: string;
      test: TTest;
   }>;
};

const Dashboard: NextPageWithLayout<Props> = ({ recentDecks, recentTests }) => {
   return (
      <div className="container py-4 space-y-4">
         <div className="space-y-4">
            <h3 className="text-xl font-semibold">
               Your flashcards progress 7 days
            </h3>
            <div className="sm:max-w-4xl mx-auto">
               <FlashcardChart />
            </div>
         </div>
         <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recent decks</h3>
            {recentDecks.length > 0 ? (
               <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                  {recentDecks.map((deck) => {
                     return (
                        <li key={deck.id}>
                           <DeckCard deck={deck} />
                        </li>
                     );
                  })}
               </ul>
            ) : (
               <p className="text-center font-medium">
                  Not have any recent decks.
               </p>
            )}
         </div>
         <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recent tests</h3>
            {recentTests.length > 0 ? (
               <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                  {recentTests.map(({ id, test }) => {
                     return (
                        <li key={id}>
                           <ToiecTestCard test={test} />
                        </li>
                     );
                  })}
               </ul>
            ) : (
               <p className="text-center font-medium">
                  Not have any recent tests.
               </p>
            )}
         </div>
      </div>
   );
};

export const getServerSideProps = withRoute({
   isProtected: true,
})(async ({ access_token, refresh_token }) => {
   const res: TBaseResponse<{
      recentDecks: Array<TDeck>;
      recentTests: Array<{
         id: string;
         test: TTest;
      }>;
   }> = await http_server(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      '/dashboard/users'
   );

   return {
      props: {
         ...res.data,
      },
   };
});

Dashboard.getLayout = (page) => {
   return (
      <AppLayout title="Toiec | Dashboard" description="Dashboard">
         {page}
      </AppLayout>
   );
};

export default Dashboard;

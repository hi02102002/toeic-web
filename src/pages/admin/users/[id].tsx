import { DeckCard } from '@/components/app/flashcard';
import { ToiecTestCard } from '@/components/app/toiec-test';
import { AdminLayout } from '@/components/layouts/admin';
import { Avatar } from '@/components/shared';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/shared/table';
import { ROUTES } from '@/constants';
import { http_server } from '@/libs/axios';
import {
   NextPageWithLayout,
   TBaseResponse,
   TDeck,
   TTest,
   TTestUser,
   TUser,
} from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {
   detail: {
      user: TUser;
      recentTests: Array<{
         id: string;
         test: TTest;
      }>;
      recentDecks: TDeck[];
      resultsTest: {
         total: number;
         results: TTestUser[];
      };
   };
};

const UserDetail: NextPageWithLayout<Props> = ({ detail }: Props) => {
   const { user, recentTests, recentDecks, resultsTest } = detail;
   return (
      <div className="py-4 space-y-4">
         <div className="space-y-4">
            <h3 className="text-xl font-semibold">User detail</h3>
            <div className="flex gap-4">
               <Avatar url={user.avatar} alt={user.name} sizes="lg" />
               <div>
                  <span className="text-lg font-semibold line-clamp-1">
                     {user.name}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <span>{user.email}</span>
                  </div>
               </div>
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
         <div className="space-y-4">
            <h3 className="text-xl font-semibold">Results of tests</h3>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Test</TableHead>
                     <TableHead>Test date</TableHead>
                     <TableHead>Listening score</TableHead>
                     <TableHead>Reading score</TableHead>
                     <TableHead>Total score </TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {resultsTest?.results.map((result) => {
                     return (
                        <TableRow key={result.id}>
                           <TableCell className="font-medium">
                              {result.test.name}
                           </TableCell>
                           <TableCell>
                              {new Date(result.createdAt).toLocaleDateString()}
                           </TableCell>
                           <TableCell>{result.listeningScore}</TableCell>
                           <TableCell>{result.readingScore}</TableCell>
                           <TableCell>{result.totalScore}</TableCell>
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         </div>
      </div>
   );
};

UserDetail.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})(async ({ access_token, refresh_token, ctx }) => {
   const id = ctx.query.id as string;

   try {
      const res: TBaseResponse<{
         user: TUser;
         recentTests: Array<{
            id: string;
            test: TTest;
         }>;
         recentDecks: TDeck[];
         resultsTest: {
            total: number;
            results: TTestUser[];
         };
      }> = await http_server(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         `/users/${id}`
      );

      return {
         props: {
            detail: res.data,
         },
      };
   } catch (error) {
      return {
         redirect: {
            destination: ROUTES.ADMIN_USERS,
            permanent: false,
         },
      };
   }
});

export default UserDetail;

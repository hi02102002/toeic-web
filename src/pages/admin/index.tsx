import { FeatureCard } from '@/components/app/admin';
import { AdminLayout } from '@/components/layouts/admin';
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
import { NextPageWithLayout, TBaseResponse } from '@/types';
import { withRoute } from '@/utils/withRoute';

type TTop5TestUseMost = Array<{
   testid: string;
   testname: string;
   usagecount: number;
}>;

type TTop5UserHighestScore = Array<{
   user_id: string;
   username: string;
   total_score: number;
   test_id: string;
   test_name: string;
}>;

type Props = {
   top5TestUseMost: TTop5TestUseMost;
   top5UserHighestScore: TTop5UserHighestScore;
};

const QUICK_LINKS = [
   {
      image: '/images/teamwork.png',
      title: 'Users',
      description:
         'Manage list of users. You can create, update, delete users.',
      href: ROUTES.ADMIN_USERS,
   },
   {
      image: '/images/exam.png',
      title: 'Toiec tests',
      description:
         'Manage list of toiec tests. You can create, update, delete tests.',
      href: ROUTES.ADMIN_TOIEC_TESTS,
   },
   {
      image: '/images/word.png',
      title: 'Topics',
      description:
         'Manage list of topics. You can create, update, delete topics. You can also add words to topics.',
      href: ROUTES.ADMINT_TOPICS,
   },
   {
      image: '/images/textbook.png',
      title: 'Grammars',
      description:
         'Manage list of grammars. You can create, update, delete grammars. You can also add questions to grammars.',
      href: ROUTES.ADMIN_GRAMMARS,
   },
];

const Admin: NextPageWithLayout<Props> = ({
   top5TestUseMost,
   top5UserHighestScore,
}) => {
   return (
      <div className="py-4 space-y-4">
         <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {QUICK_LINKS.map((quickLink) => {
                  return <FeatureCard key={quickLink.title} {...quickLink} />;
               })}
            </div>
         </div>
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-4">
               <h3 className="text-xl font-semibold">
                  Top 5 tests that use most
               </h3>
               <div>
                  <Table className="border-border border rounded">
                     <TableHeader className="rounded-t">
                        <TableRow>
                           <TableHead>Test name</TableHead>

                           <TableHead>Usage</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody className="rounded-b">
                        {top5TestUseMost.length > 0 ? (
                           top5TestUseMost.map((test) => (
                              <TableRow
                                 key={test.testid}
                                 className="last:rounded-b"
                              >
                                 <TableCell className="font-medium">
                                    {test.testname}
                                 </TableCell>
                                 <TableCell>{test.usagecount}</TableCell>
                              </TableRow>
                           ))
                        ) : (
                           <TableRow>
                              <TableCell colSpan={2} className="text-center">
                                 No data
                              </TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </div>
            </div>
            <div className="space-y-4">
               <h3 className="text-xl font-semibold">
                  Top 5 users highest score
               </h3>
               <div>
                  <Table className="border-border border rounded">
                     <TableHeader className="rounded-t">
                        <TableRow>
                           <TableHead>Test name</TableHead>
                           <TableHead>Username</TableHead>
                           <TableHead>Score</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody className="rounded-b">
                        {top5UserHighestScore.length > 0 ? (
                           top5UserHighestScore.map((user) => (
                              <TableRow
                                 key={user.user_id}
                                 className="last:rounded-b"
                              >
                                 <TableCell className="font-medium">
                                    {user.test_name}
                                 </TableCell>
                                 <TableCell className="font-medium">
                                    {user.username}
                                 </TableCell>
                                 <TableCell>{user.total_score}</TableCell>
                              </TableRow>
                           ))
                        ) : (
                           <TableRow>
                              <TableCell colSpan={2} className="text-center">
                                 No data
                              </TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </div>
            </div>
         </div>
      </div>
   );
};

Admin.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})(async ({ ctx, access_token, refresh_token }) => {
   const res: TBaseResponse<{
      top5TestUseMost: TTop5TestUseMost;
      top5UserHighestScore: TTop5UserHighestScore;
   }> = await http_server(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      '/dashboard/admin'
   );

   return {
      props: {
         ...res.data,
      },
   };
});

export default Admin;

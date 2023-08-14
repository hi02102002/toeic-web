import { ToiecTestCard } from '@/components/app';
import { AppLayout } from '@/components/layouts/app';
import { Pagination } from '@/components/shared';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TTest } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { useRouter } from 'next/router';

type Props = {
   total: number;
   tests: TTest[];
};

const ToiecTests: NextPageWithLayout<Props> = ({ tests, total }) => {
   const router = useRouter();

   return (
      <div className="container py-4 space-y-4">
         <h3 className="text-lg font-semibold">Toiec Tests</h3>
         <div className="flex-1">
            {tests.length > 0 ? (
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                  {tests.map((test) => {
                     return <ToiecTestCard test={test} key={test.id} />;
                  })}
               </div>
            ) : (
               <div className="flex items-center justify-center h-full">
                  <span className="font-medium">Not have any tests</span>
               </div>
            )}
         </div>
         <Pagination
            perPage={20}
            total={total}
            onPaginationChange={(value) => {
               router.push({
                  pathname: router.pathname,
                  query: {
                     page: value + 1,
                  },
               });
            }}
         />
      </div>
   );
};

ToiecTests.getLayout = (page) => {
   return (
      <AppLayout title="Toiec Tests" description="List of toiec tests">
         {page}
      </AppLayout>
   );
};
export const getServerSideProps = withRoute({
   isProtected: true,
})(async ({ ctx, access_token, refresh_token }) => {
   const { page } = ctx.query;

   const getTests = async () => {
      const res = await http_server<{
         tests: TTest[];
         total: number;
      }>(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         '/tests',
         {
            page: page ? page : 1,
            limit: 20,
         }
      );

      return res.data;
   };

   return {
      props: {
         ...(await getTests()),
      },
   };
});

export default ToiecTests;

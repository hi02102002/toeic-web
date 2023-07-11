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
      <div className="container py-4">
         <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
               {tests.map((test) => {
                  return <ToiecTestCard test={test} key={test.id} />;
               })}
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
      </div>
   );
};

ToiecTests.getLayout = (page) => {
   return <AppLayout>{page}</AppLayout>;
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
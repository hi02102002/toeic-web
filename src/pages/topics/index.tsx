import { TopicCard } from '@/components/app/topics';
import { AppLayout } from '@/components/layouts/app';
import { Pagination } from '@/components/shared';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TTopic } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { useRouter } from 'next/router';

type Props = {
   topics: TTopic[];
   total: number;
};

const Topics: NextPageWithLayout<Props> = ({ topics, total }) => {
   const router = useRouter();
   return (
      <div className="container py-4 space-y-4">
         <h3 className="text-lg font-semibold">Topics</h3>
         <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {topics.map((topic) => {
               return (
                  <li key={topic.id}>
                     <TopicCard topic={topic} />
                  </li>
               );
            })}
         </ul>
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
      </div>
   );
};

Topics.getLayout = (page) => {
   return (
      <AppLayout title="Toeic | Topics" description="List of topics">
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: false,
})(async ({ ctx, access_token, refresh_token }) => {
   const { query } = ctx;

   const res = await http_server<{
      topics: TTopic[];
      total: number;
   }>(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      '/topics',
      {
         page: (query.page as string) || 1,
         limit: (query.limit as string) || 10,
         parentId: (query.parentId as string) || null,
      }
   );

   return {
      props: {
         topics: res.data.topics,
         total: res.data.total,
      },
   };
});

export default Topics;

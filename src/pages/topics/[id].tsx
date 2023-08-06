import { Confirm } from '@/components/app';
import { Word } from '@/components/app/topics';
import { AppLayout } from '@/components/layouts/app';
import {
   Button,
   Input,
   LoadingFullPage,
   Pagination,
} from '@/components/shared';
import { useCreateDeckFromTopic, useCreateFlashcard, useDecks } from '@/hooks';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TBaseResponse, TTopic, TWord } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { useRouter } from 'next/router';
import { useState } from 'react';

type Props = {
   total: number;
   words: TWord[];
   topic: TTopic;
};

const LIMIT = 20;

const Vocabularies: NextPageWithLayout<Props> = ({ total, words, topic }) => {
   const router = useRouter();
   const [search, setSearch] = useState('' || (router.query.name as string));

   const {
      mutateAsync: handleCreateDeckFromTopic,
      isLoading: isLoadingCreateDeckFromTopic,
   } = useCreateDeckFromTopic();

   const handleSearch = () => {
      router.push({
         pathname: router.pathname,
         query: {
            ...router.query,
            page: 1,
            limit: LIMIT,
            name: router.query.name ? undefined : search,
         },
      });
      if (router.query.name) setSearch('');
   };

   const { data } = useDecks({}, true);

   return (
      <div className="container py-4 space-y-4">
         <div className="flex items-center gap-4">
            <Input
               placeholder="Search words"
               value={search}
               onChange={(e: any) => {
                  setSearch(e.target.value);
               }}
               onKeyPress={(e: any) => {
                  if (e.key === 'Enter') {
                     handleSearch();
                  }
               }}
            />
            <Button
               variants="primary"
               onClick={handleSearch}
               className="min-w-[100px]"
               disabled={!search && !router.query.name}
            >
               {!router.query.name ? 'Search' : 'Clear'}
            </Button>
         </div>
         <div className="flex items-start justify-between gap-4">
            <div>
               <h3 className="text-lg font-semibold line-clamp-1">
                  Topic: {topic.name}
               </h3>
               <span>
                  Total words: <span className="font-semibold">{total}</span>
               </span>
            </div>
            <Confirm
               title="Learn this topic"
               description="We will create a new deck for you with all words in this topic. Are you sure?"
               onConfirm={async (close) => {
                  close?.();
                  await handleCreateDeckFromTopic({
                     topicId: topic.id,
                     name: topic.name,
                     wordIds: words.map((word) => word.id),
                  });
               }}
            >
               <Button variants="primary">Learn This Topic</Button>
            </Confirm>
         </div>
         <div>
            {words.length > 0 ? (
               <ul className="space-y-4">
                  {words.map((word) => {
                     return (
                        <li key={word.id}>
                           <Word word={word} decks={data?.decks || []} />
                        </li>
                     );
                  })}
               </ul>
            ) : (
               <div className="text-center font-medium">No words found.</div>
            )}
         </div>
         <Pagination
            total={total}
            perPage={LIMIT}
            onPaginationChange={(value) => {
               router.push({
                  pathname: router.pathname,
                  query: {
                     ...router.query,
                     page: value + 1,
                     limit: LIMIT,
                  },
               });
            }}
         />
         {isLoadingCreateDeckFromTopic && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 pointer-events-none flex flex-col gap-4"
               classNameLoading="text-primary"
               hasOverlay
            >
               <span className="font-medium">Redirecting to your deck...</span>
            </LoadingFullPage>
         )}
      </div>
   );
};

Vocabularies.getLayout = (page) => {
   return (
      <AppLayout
         title={`Toiec | ${page.props.topic.name}`}
         description={`List vocabularies of ${page.props.topic.name}`}
      >
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: false,
})(async ({ ctx, access_token, refresh_token }) => {
   const id = ctx.params?.id as string;

   try {
      const res: TBaseResponse<{
         total: number;
         words: TWord[];
         topic: TTopic;
      }> = await http_server(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         `/topics/${id}/words`,
         {
            page: ctx.query.page || 1,
            limit: ctx.query.limit || LIMIT,
            name: ctx.query.name || '',
         }
      );

      return {
         props: {
            ...res.data,
         },
      };
   } catch (error) {
      return {
         notFound: true,
      };
   }
});

export default Vocabularies;

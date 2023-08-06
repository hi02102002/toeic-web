import { AppLayout } from '@/components/layouts/app';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TBaseResponse, TDeck } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {
   deck: TDeck;
};

const Learning: NextPageWithLayout<Props> = ({ deck }) => {
   return (
      <div className="container py-4">
         <h3 className="text-lg font-semibold">
            Learning flashcard of {deck.name}
         </h3>
      </div>
   );
};

Learning.getLayout = (page) => {
   return (
      <AppLayout
         title="Toiec | Learning"
         description="This page is for learning"
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

export default Learning;

import { GrammarCard } from '@/components/app/grammars';
import { AppLayout } from '@/components/layouts/app';
import { Pagination } from '@/components/shared';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TBaseResponse, TGrammar } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {
   grammars: Array<TGrammar>;
   total: number;
};

const Grammars: NextPageWithLayout<Props> = ({ grammars, total }) => {
   console.log(grammars);

   return (
      <div className="container py-4 space-y-4">
         <h3 className="text-xl font-semibold ">Grammars</h3>
         {grammars.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
               {grammars.map((grammar) => (
                  <GrammarCard key={grammar.id} grammar={grammar} />
               ))}
            </div>
         ) : (
            <p className="text-center font-medium">
               There is no grammar to learn.
            </p>
         )}
         <Pagination
            total={total}
            onPaginationChange={(page) => {
               console.log(page);
            }}
         />
      </div>
   );
};

Grammars.getLayout = (page) => {
   return (
      <AppLayout
         title="Toiec | Grammars"
         description="This page helps you to learn grammar. You can learn grammar by topic. "
      >
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({ isProtected: true })(
   async ({ ctx, access_token, refresh_token }) => {
      const getAllGrammars = async () => {
         const res: TBaseResponse<{
            grammars: Array<TGrammar>;
            total: number;
         }> = await http_server(
            {
               accessToken: access_token as string,
               refreshToken: refresh_token as string,
            },
            '/grammars',
            {
               haveTheory: false,
            }
         );
         return res.data;
      };

      const data = await getAllGrammars();

      return {
         props: {
            ...data,
         },
      };
   }
);

export default Grammars;

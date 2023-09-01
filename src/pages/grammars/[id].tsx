import { Question } from '@/components/app/grammars';
import { AppLayout } from '@/components/layouts/app';
import { useQuestions } from '@/hooks';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TBaseResponse, TGrammar } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {
   grammar: TGrammar;
};

const Grammar: NextPageWithLayout<Props> = ({ grammar }: Props) => {
   const { data, isLoading } = useQuestions({
      grammarId: grammar.id,
   });

   return (
      <div className="container py-4 space-y-4">
         <div className="max-w-3xl mx-auto prose ">
            <h2>{grammar.name}</h2>
            <div
               className=""
               dangerouslySetInnerHTML={{
                  __html: grammar.theory,
               }}
            />
         </div>

         <div className="space-y-4 ">
            <h3 className="text-xl font-semibold">Exercises</h3>
            {data?.questions && data.questions.length > 0 ? (
               <ul className="space-y-4">
                  {data?.questions.map((question, index) => {
                     return (
                        <li key={question.id}>
                           <Question question={question} order={index + 1} />
                        </li>
                     );
                  })}
               </ul>
            ) : (
               <p className="text-center">
                  This grammar does not have any exercises
               </p>
            )}
         </div>
      </div>
   );
};

Grammar.getLayout = (page) => {
   console.log(page.props);
   return (
      <AppLayout
         title={`Toiec | ${page.props.grammar.name}`}
         description="This page helps you to learn grammar. You can learn grammar by topic. "
      >
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({
   isProtected: true,
})(async ({ ctx, access_token, refresh_token }) => {
   const id = ctx.params?.id as string;

   const getGrammar = async () => {
      const res: TBaseResponse<TGrammar> = await http_server(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         `/grammars/${id}`
      );
      return res.data;
   };

   try {
      const grammar = await getGrammar();

      return {
         props: {
            grammar,
         },
      };
   } catch (error) {
      return {
         notFound: true,
      };
   }
});

export default Grammar;

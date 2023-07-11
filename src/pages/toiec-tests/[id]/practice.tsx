import { Part, QuestionsSidebar } from '@/components/app/toiec-test';
import { AppLayout } from '@/components/layouts/app';
import { Button } from '@/components/shared';
import { PracticeProvider } from '@/contexts/practice-toiec.ctx';
import { usePracticeToiec, useSubmitTest } from '@/hooks';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TPart, TTest } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { IconLoader2 } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
type Props = {
   test: TTest;
};

const Row = ({
   index,
   part,
   style,
   setRowHeight,
}: {
   index: number;
   style: any;
   part: TPart;
   setRowHeight: (index: number, height: number) => void;
}) => {
   const rowRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (rowRef.current) {
         setRowHeight(index, rowRef.current.clientHeight);
      }
   }, [index, setRowHeight]);

   return (
      <div>
         <Part part={part} />
      </div>
   );
};

const Practice = ({ test }: Props) => {
   const { data, isLoading } = usePracticeToiec(test.id);

   return (
      <div className="container py-4 select-none">
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-semibold">{test.name}</h3>
               <Button variants="transparent" className="h-9">
                  Leave
               </Button>
            </div>
            {isLoading ? (
               <div className="flex items-center justify-center py-4">
                  <IconLoader2 className="animate-spin" />
               </div>
            ) : (
               <div className="flex gap-4 lg:flex-row flex-col-reverse">
                  <div className="flex-1">
                     {data?.parts.map((part) => {
                        return <Part key={part.id} part={part} />;
                     })}
                  </div>
                  <QuestionsSidebar
                     parts={data?.parts || []}
                     onSubmit={() => {}}
                  />
               </div>
            )}
         </div>
      </div>
   );
};

const PracticeWithProvider: NextPageWithLayout<Props> = ({ test }) => {
   return (
      <PracticeProvider testId={test.id}>
         <Practice test={test} />
      </PracticeProvider>
   );
};

PracticeWithProvider.getLayout = (page) => {
   return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withRoute({ isProtected: true })(
   async ({ ctx, access_token, refresh_token }) => {
      const id = ctx.params?.id as string;
      const getTest = async () => {
         const res = await http_server<TTest | null>(
            {
               accessToken: access_token as string,
               refreshToken: refresh_token as string,
            },
            `/tests/${id}`
         );

         return res.data;
      };

      const test = await getTest();

      if (!test) {
         return {
            notFound: true,
         };
      }

      return {
         props: {
            test,
         },
      };
   }
);

export default PracticeWithProvider;

import { Confirm } from '@/components/app';
import { Part, QuestionsSidebar } from '@/components/app/toiec-test';
import { AppLayout } from '@/components/layouts/app';
import { Button } from '@/components/shared';
import { ROUTES } from '@/constants';
import { PracticeResultProvider } from '@/contexts/practice-toiec.ctx';
import { useUser } from '@/contexts/user.ctx';
import { useToiec } from '@/hooks';
import { http_server } from '@/libs/axios';
import { usersService } from '@/services';
import { NextPageWithLayout, TTest } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { IconLoader2 } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
type Props = {
   test: TTest;
};

const Practice = ({ test }: Props) => {
   const { data, isLoading } = useToiec(test.id);
   const router = useRouter();
   const playerRef = useRef<ReactPlayer | null>(null);
   const { setUser } = useUser();

   useEffect(() => {
      usersService.startTest();
      setUser((prev) => {
         if (!prev) return prev;
         return {
            ...prev,
            isTesting: true,
         };
      });
      return () => {
         setUser((prev) => {
            if (!prev) return prev;
            return {
               ...prev,
               isTesting: false,
            };
         });
         usersService.finishTest();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <div className="container py-4 select-none">
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-semibold">{test.name}</h3>
               <Confirm
                  title="Leave test?"
                  description="You will lose all your progress"
                  textConfirm="Leave"
                  onConfirm={() => {
                     router.replace(ROUTES.TOIEC_TEST);
                  }}
               >
                  <Button variants="transparent" className="h-9">
                     Leave
                  </Button>
               </Confirm>
            </div>
            {isLoading ? (
               <div className="flex items-center justify-center py-4">
                  <IconLoader2 className="animate-spin" />
               </div>
            ) : (
               <div className="flex flex-col-reverse gap-4 lg:flex-row">
                  <div className="flex flex-col gap-4">
                     {data?.audio && (
                        <div className="flex items-center justify-center ">
                           <ReactPlayer
                              url={data?.audio}
                              controls
                              height={64}
                              playing={true}
                              ref={playerRef}
                           />
                        </div>
                     )}
                     <div className="flex-1">
                        {data?.parts.map((part) => {
                           return <Part key={part.id} part={part} />;
                        })}
                     </div>
                  </div>
                  <QuestionsSidebar parts={data?.parts || []} />
               </div>
            )}
         </div>
      </div>
   );
};

const PracticeWithProvider: NextPageWithLayout<Props> = ({ test }) => {
   return (
      <PracticeResultProvider testId={test.id} choicesResult={[]}>
         <Practice test={test} />
      </PracticeResultProvider>
   );
};

PracticeWithProvider.getLayout = (page) => {
   return (
      <AppLayout
         title="Toiec | Practice"
         description="This page is for practicing"
      >
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({ isProtected: true })(
   async ({ ctx, access_token, refresh_token, user }) => {
      if (user?.isTesting) {
         return {
            redirect: {
               destination: ROUTES.TOIEC_TEST,
               permanent: false,
            },
         };
      }

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

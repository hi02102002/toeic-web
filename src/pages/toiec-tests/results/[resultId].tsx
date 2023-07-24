import { Confirm, Part } from '@/components/app';
import { AppLayout } from '@/components/layouts/app';
import { Avatar, Button, Progress } from '@/components/shared';
import { ROUTES } from '@/constants';
import { PracticeResultProvider } from '@/contexts/practice-toiec.ctx';
import { useToiec } from '@/hooks';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TBaseResponse, TTestUser } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { IconLoader2 } from '@tabler/icons-react';
import { useRouter } from 'next/router';

type Props = {
   result: TTestUser;
};

const Result = ({ result }: Props) => {
   const router = useRouter();

   const { data, isLoading } = useToiec(result.testId, 'explain');

   return (
      <div className="container py-4 space-y-4">
         <div className="flex flex-col justify-between gap-4 md:items-center md:flex-row">
            <h3 className="text-lg font-semibold md:">
               Result of {result.test.name}
            </h3>
            <Confirm
               onConfirm={async (onClose) => {
                  await router.push(
                     `${ROUTES.TOIEC_TEST}/${result.testId}/practice`
                  );
                  onClose?.();
               }}
               description="You will have 120 minutes to complete 200 question. Good luck!"
               title="Try again test?"
               textConfirm="Start"
            >
               <Button className="w-full md:w-auto" variants="primary">
                  Try again
               </Button>
            </Confirm>
         </div>
         <div className="flex flex-col md:flex-row">
            <div className="flex-1 border">
               <div className="flex items-center h-full gap-4 p-4">
                  <Avatar
                     url={result.user.avatar}
                     className="w-16 h-16"
                     alt={result.user.name}
                  />
                  <div className="flex items-center flex-1">
                     <div className="w-full">
                        <div className="border-b border-l">
                           <div className="inline-block p-1 border-b">Name</div>
                           <span className="block p-1 font-semibold">
                              {result.user.name}
                           </span>
                        </div>
                        <div className="border-b border-l">
                           <div className="inline-block p-1 border-b">
                              Attempt
                           </div>
                           <span className="block p-1 font-semibold">
                              {result.numAttempt}
                           </span>
                        </div>
                        <div className="border-b border-l">
                           <div className="inline-block p-1 border-b">
                              Test Date
                           </div>
                           <span className="block p-1 font-semibold">
                              {new Date(result.createdAt).toDateString()}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex-1 border md:border-l-0 border-t-0 md:border-t-[1px]">
               <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col flex-1 gap-4 p-4">
                     <div className="space-y-10">
                        <div className="inline-flex font-medium border border-green-500">
                           <span className="p-2 inline-flex items-center justify-center min-w-[82px]">
                              Listening
                           </span>
                           <span className="p-2  bg-green-500 text-white min-w-[72px] inline-flex items-center justify-center ">
                              {result.listeningCorrect} / 100
                           </span>
                        </div>
                        <div className="flex items-center gap-4 font-medium">
                           <span>5</span>
                           <div className="relative flex-1">
                              <div
                                 className="absolute bottom-4 p-1 bg-green-500 translate-x-[-50%] text-white min-w-[32px] flex items-center justify-center"
                                 style={{
                                    left:
                                       (result.listeningScore / 495) * 100 +
                                       '%',
                                 }}
                              >
                                 {result.listeningScore}
                              </div>
                              <Progress
                                 value={(result.listeningScore / 495) * 100}
                                 classNameIndicator="bg-green-500"
                                 className="rounded-none"
                              />
                           </div>
                           <span>495</span>
                        </div>
                     </div>
                     <div className="space-y-10">
                        <div className="inline-flex font-medium border border-green-500">
                           <span className="p-2 inline-flex items-center justify-center  min-w-[82px]">
                              Reading
                           </span>
                           <span className="p-2 bg-green-500 text-white min-w-[72px] inline-flex items-center justify-center ">
                              {result.readingCorrect} / 100
                           </span>
                        </div>
                        <div className="flex items-center gap-4 font-medium">
                           <span>5</span>
                           <div className="relative flex-1">
                              <div
                                 className="absolute bottom-4 p-1 bg-green-500 translate-x-[-50%] text-white min-w-[32px] flex items-center justify-center"
                                 style={{
                                    left:
                                       (result.readingScore / 495) * 100 + '%',
                                 }}
                              >
                                 {result.readingScore}
                              </div>
                              <Progress
                                 value={(result.readingScore / 495) * 100}
                                 classNameIndicator="bg-green-500"
                                 className="rounded-none"
                              />
                           </div>
                           <span>495</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 font-medium border-t md:border-l md:border-t-0">
                     <span>TOTAL SCORE</span>
                     <span>{result.totalScore}</span>
                  </div>
               </div>
            </div>
         </div>
         {isLoading ? (
            <div className="flex items-center justify-center">
               <IconLoader2 className="animate-spin" />
            </div>
         ) : (
            <div>
               {data?.parts.map((part) => {
                  return <Part part={part} key={part.id} type="result" />;
               })}
            </div>
         )}
      </div>
   );
};

const ResultWithProvider: NextPageWithLayout<Props> = ({ result }) => {
   return (
      <PracticeResultProvider
         testId={result.testId}
         choicesResult={result.choices}
      >
         <Result result={result} />
      </PracticeResultProvider>
   );
};

ResultWithProvider.getLayout = (page) => {
   return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: false,
})(async ({ ctx, access_token, refresh_token }) => {
   const resultId = ctx.params?.resultId as string;

   const res: TBaseResponse<TTestUser | null> = await http_server(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      `/tests/results/${resultId}`
   );

   if (!res.data) {
      return {
         notFound: true,
      };
   }

   return {
      props: {
         result: res.data,
      },
   };
});

export default ResultWithProvider;

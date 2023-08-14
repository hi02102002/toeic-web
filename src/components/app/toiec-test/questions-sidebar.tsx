import { Button, LoadingFullPage } from '@/components/shared';
import { usePractice } from '@/contexts/practice-toiec.ctx';
import { useCountDownTime, useSubmitTest } from '@/hooks';
import { TPart } from '@/types';
import {
   calcNumberContinueQuestion,
   millisToMinutesAndSeconds,
   sumAllArr,
} from '@/utils';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { Confirm } from '../modal';

type Props = {
   parts: TPart[];
};

const Part = ({ part }: { part: TPart }) => {
   const { isQuestionChose, isMarked } = usePractice();
   const arrLengthChildQuestions: number[] = [];

   const handleScroll = (query: string) => {
      const el = document.querySelector(query) as HTMLElement;
      const appHeader = document.querySelector('#app-header') as HTMLElement;

      if (!el) {
         return;
      }

      window.scrollTo({
         behavior: 'smooth',
         top: el?.offsetTop - appHeader?.offsetHeight - 16,
      });
   };

   const numberContinueQuestion = calcNumberContinueQuestion(part.type);

   return (
      <div className="space-y-2">
         <span
            className="font-medium cursor-pointer"
            onClick={() => handleScroll(`#part-${part.id}`)}
         >
            {part.name}
         </span>
         <ul className="flex flex-wrap items-center gap-2">
            {part.questions.map((question, i) => {
               if (question.quesions.length > 0) {
                  arrLengthChildQuestions.push(
                     part.questions?.[i - 1]?.quesions.length || 0
                  );
                  return (
                     <Fragment key={question.id}>
                        {question.quesions.map((q, _i) => {
                           return (
                              <li key={q.id} className="relative">
                                 <Button
                                    variants={
                                       isQuestionChose({
                                          answerId: '',
                                          partType: part.type,
                                          questionId: q.id,
                                       })
                                          ? 'primary'
                                          : 'outline'
                                    }
                                    className="w-8 h-8 !transition-none"
                                    onClick={() =>
                                       handleScroll(`#question-${q.id}`)
                                    }
                                 >
                                    {sumAllArr(arrLengthChildQuestions) +
                                       numberContinueQuestion +
                                       _i +
                                       1}
                                 </Button>
                                 {isMarked(q.id) && (
                                    <div className="absolute w-1 h-1 bg-yellow-500 rounded-full top-1 left-1"></div>
                                 )}
                              </li>
                           );
                        })}
                     </Fragment>
                  );
               }

               return (
                  <li key={question.id} className="relative">
                     <Button
                        variants={
                           isQuestionChose({
                              answerId: '',
                              partType: part.type,
                              questionId: question.id,
                           })
                              ? 'primary'
                              : 'outline'
                        }
                        className="w-8 h-8 !transition-none"
                        onClick={() => handleScroll(`#question-${question.id}`)}
                     >
                        {numberContinueQuestion + i + 1}
                     </Button>
                     {isMarked(question.id) && (
                        <div className="absolute w-1 h-1 bg-yellow-500 rounded-full top-1 left-1"></div>
                     )}
                  </li>
               );
            })}
         </ul>
      </div>
   );
};

export const QuestionsSidebar = ({ parts }: Props) => {
   const router = useRouter();
   const { isFinished, time } = useCountDownTime();
   const { choices } = usePractice();
   const { mutateAsync: handleSubmitTest, isLoading } = useSubmitTest();

   useEffect(() => {
      if (isFinished) {
         handleSubmitTest({
            testId: router.query.id as string,
            choices,
         });
      }
   }, [isFinished, handleSubmitTest, router.query.id, choices]);

   return (
      <>
         <div className="flex-shrink-0 w-full space-y-4 lg:w-52 ">
            <span className="text-xl font-medium">{choices.length} / 200</span>
            <div>
               <span className="text-xl font-medium">
                  The rest of the time:
               </span>
               <span className="block text-xl font-medium">
                  {millisToMinutesAndSeconds(time)}
               </span>
            </div>
            <Confirm
               description="Are you sure you want to submit your test?"
               title="Are you sure?"
               textConfirm="Submit"
               onConfirm={async (close) => {
                  await handleSubmitTest({
                     testId: router.query.id as string,
                     choices,
                  });
                  close?.();
               }}
            >
               <Button variants="primary" className="w-full h-9">
                  Submit
               </Button>
            </Confirm>
            <div className="space-y-4">
               {parts.map((part, i) => {
                  return <Part key={part.id} part={part} />;
               })}
            </div>
         </div>
         {isLoading && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 "
               classNameLoading="text-primary"
            />
         )}
      </>
   );
};

export default QuestionsSidebar;

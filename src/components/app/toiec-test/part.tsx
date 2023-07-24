import { TPart } from '@/types';
import { calcNumberContinueQuestion, sumAllArr } from '@/utils';
import { Fragment } from 'react';
import Question from './question';

type Props = {
   part: TPart;
   type?: 'result' | 'practice';
};

export const Part = ({ part, type = 'practice' }: Props) => {
   const arrLengthChildQuestions: number[] = [];

   const numberContinueQuestion = calcNumberContinueQuestion(part.type);

   return (
      <div>
         {part.questions.map((question, i) => {
            if (question.quesions.length > 0) {
               arrLengthChildQuestions.push(
                  part.questions?.[i - 1]?.quesions.length || 0
               );
               const sumArrLengthChildQuestions = sumAllArr(
                  arrLengthChildQuestions
               );

               return (
                  <Fragment key={question.id}>
                     <Question
                        order={`${
                           numberContinueQuestion +
                           sumArrLengthChildQuestions +
                           1
                        } - ${
                           numberContinueQuestion +
                           sumArrLengthChildQuestions +
                           question.quesions.length
                        }
                              `}
                        question={question}
                        partType={part.type}
                        type={type}
                     />
                     <div className="space-y-4">
                        {question.quesions.map((q, _i) => {
                           return (
                              <Question
                                 question={q}
                                 order={
                                    sumArrLengthChildQuestions +
                                    numberContinueQuestion +
                                    _i +
                                    1
                                 }
                                 key={q.id}
                                 partType={part.type}
                                 type={type}
                              />
                           );
                        })}
                     </div>
                  </Fragment>
               );
            }

            return (
               <Question
                  question={question}
                  order={numberContinueQuestion + i + 1}
                  partType={part.type}
                  key={question.id}
                  type={type}
               />
            );
         })}
      </div>
   );
};

export default Part;

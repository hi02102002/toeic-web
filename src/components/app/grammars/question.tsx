import {
   Question,
   QuestionExplainAndTranscript,
   QuestionOrder,
   QuestionText,
   RadioGroup,
   RadioGroupItem,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { TQuestion } from '@/types';
import { cn } from '@/utils';
import { useEffect, useState } from 'react';

type Props = {
   question: TQuestion;
   order: number | string;
};

export const QuestionWrapper = ({ question, order }: Props) => {
   const [choose, setChoose] = useState<string | null>(null);

   const isCorrect = question.answers.find(
      (answer) => answer.id === choose
   )?.isCorrect;

   const [showExplainAndTranscript, { onToggle, onOpen }] = useDisclosure();

   useEffect(() => {
      if (choose) {
         onOpen();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [choose]);

   return (
      <div id={`question-${question.id}`}>
         <Question>
            <div className="flex items-center gap-2">
               <QuestionOrder order={order} />
               <QuestionText question={question} />
            </div>
            <RadioGroup
               onValueChange={(value) => {
                  setChoose(value);
               }}
               className={cn({
                  'pointer-events-none': choose !== null,
               })}
            >
               {question.answers.map((answer) => {
                  return (
                     <div key={answer.id} className="flex items-center gap-2">
                        <RadioGroupItem
                           value={answer.id}
                           id={`answer-${answer.id}`}
                           className={cn({
                              'text-green-500': answer.isCorrect && isCorrect,
                              'text-red-500': !answer.isCorrect && !isCorrect,
                           })}
                        />
                        <label htmlFor={`answer-${answer.id}`}>
                           {answer.content}
                        </label>
                     </div>
                  );
               })}
            </RadioGroup>
            {choose && (
               <QuestionExplainAndTranscript
                  question={question}
                  isShow={showExplainAndTranscript}
                  onToggle={onToggle}
               />
            )}
         </Question>
      </div>
   );
};

export default QuestionWrapper;

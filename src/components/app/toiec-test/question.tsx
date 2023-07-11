import { Button, RadioGroup, RadioGroupItem } from '@/components/shared';
import { usePractice } from '@/contexts/practice-toiec.ctx';
import { PartType, TQuestion } from '@/types';
import { IconFlag3, IconFlag3Filled } from '@tabler/icons-react';
import parser from 'html-react-parser';
import Image from 'next/image';

type Props = {
   question: TQuestion;
   order: number | string;
   partType: PartType;
};

export const Question = ({ question, order, partType }: Props) => {
   const { choices, handleChoose, handleSubmit, toggleMark, isMarked } =
      usePractice();

   return (
      <div id={`question-${question.id}`} className="flex flex-col gap-2">
         <div className="flex items-center justify-between">
            <span className="font-medium">Question {order}</span>
            {(question.quesions?.length === 0 || !question.quesions) && (
               <Button
                  variants="transparent"
                  className="!p-0 w-8 h-8"
                  onClick={() => toggleMark(question.id)}
               >
                  {isMarked(question.id) ? (
                     <IconFlag3Filled className="text-yellow-500 w-5 h-5" />
                  ) : (
                     <IconFlag3 className="w-5 h-5" />
                  )}
               </Button>
            )}
         </div>
         {question.audio && (
            <div className="flex items-center justify-center">
               <audio src={question.audio} controls />
            </div>
         )}
         {question.image && (
            <div className="flex items-center justify-center">
               <Image
                  src={question.image}
                  alt={question.text}
                  width={500}
                  height={500}
               />
            </div>
         )}
         {question.text && <div>{parser(question.text)}</div>}
         <div>
            {question.answers.length > 0 && (
               <RadioGroup
                  onValueChange={(value) => {
                     handleChoose({
                        answerId: value,
                        partType,
                        questionId: question.id,
                     });
                  }}
                  defaultValue={
                     choices.find((c) => c.questionId === question.id)?.answerId
                  }
               >
                  {question.answers.map((answer) => {
                     return (
                        <div
                           key={answer.id}
                           className="flex gap-2 items-center"
                        >
                           <RadioGroupItem
                              value={answer.id}
                              id={`answer-${answer.id}`}
                           />
                           <label
                              htmlFor={`answer-${answer.id}`}
                              className="cursor-pointer"
                           >
                              {answer.content}
                           </label>
                        </div>
                     );
                  })}
               </RadioGroup>
            )}
         </div>
      </div>
   );
};

export default Question;

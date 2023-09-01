import {
   Question,
   QuestionAudio,
   QuestionExplainAndTranscript,
   QuestionImage,
   QuestionMark,
   QuestionOrder,
   QuestionText,
   RadioGroup,
   RadioGroupItem,
} from '@/components/shared';
import { usePractice } from '@/contexts/practice-toiec.ctx';
import { useDisclosure } from '@/hooks';
import { PartType, TQuestion } from '@/types';
import { cn } from '@/utils';

type Props = {
   question: TQuestion;
   order: number | string;
   partType: PartType;
   type?: 'result' | 'practice';
};

export const QuestionWrapper = ({
   question,
   order,
   partType,
   type = 'practice',
}: Props) => {
   const { handleChoose, toggleMark, isMarked, choicesResult } = usePractice();
   const [showExplainAndTranscript, { onToggle }] = useDisclosure();

   return (
      <div id={`question-${question.id}`}>
         <Question>
            <div className="flex items-center justify-between">
               <QuestionOrder order={order} />
               {type !== 'result' && (
                  <QuestionMark
                     question={question}
                     isMarked={isMarked}
                     toggleMark={toggleMark}
                  />
               )}
            </div>
            {type === 'result' && <QuestionAudio question={question} />}
            <QuestionImage question={question} />
            <QuestionText question={question} />
            <div>
               {question.answers.length > 0 && (
                  <RadioGroup
                     onValueChange={(value) => {
                        handleChoose?.({
                           answerId: value,
                           partType,
                           questionId: question.id,
                        });
                     }}
                     className={cn({
                        'pointer-events-none': type === 'result',
                     })}
                  >
                     {question.answers.map((answer) => {
                        const yourChoice = choicesResult?.find(
                           (c) => c.answer.id === answer.id
                        );
                        return (
                           <div
                              key={answer.id}
                              className="flex items-center gap-2"
                           >
                              {type === 'result' ? (
                                 <>
                                    <RadioGroupItem
                                       value={answer.id}
                                       id={`answer-${answer.id}`}
                                       className={cn({
                                          'text-green-500': answer.isCorrect,
                                          'text-red-500':
                                             !answer.isCorrect && yourChoice,
                                       })}
                                       checked={
                                          answer.isCorrect ||
                                          Boolean(yourChoice)
                                       }
                                    />
                                    <label
                                       htmlFor={`answer-${answer.id}`}
                                       className={cn('cursor-pointer', {
                                          'pointer-events-none':
                                             type === 'result',
                                          ' text-red-500':
                                             !answer.isCorrect && yourChoice,
                                          'text-green-500': answer.isCorrect,
                                       })}
                                    >
                                       {answer.content}
                                    </label>
                                 </>
                              ) : (
                                 <>
                                    <RadioGroupItem
                                       value={answer.id}
                                       id={`answer-${answer.id}`}
                                    />
                                    <label htmlFor={`answer-${answer.id}`}>
                                       {answer.content}
                                    </label>
                                 </>
                              )}
                           </div>
                        );
                     })}
                  </RadioGroup>
               )}
            </div>
            {type === 'result' && (
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

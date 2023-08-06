import { Button, RadioGroup, RadioGroupItem } from '@/components/shared';
import { useAudioCtx } from '@/contexts/audio.ctx';
import { useDisclosure } from '@/hooks';
import { PartType, TChoice, TChoiceInput, TQuestion } from '@/types';
import { cn } from '@/utils';
import { IconFlag3, IconFlag3Filled } from '@tabler/icons-react';
import parser from 'html-react-parser';
import Image from 'next/image';
import ReactPlayer from 'react-player';

type Props = {
   question: TQuestion;
   order: number | string;
   partType: PartType;
   type?: 'result' | 'practice';
   handleChoose?: (choice: TChoiceInput) => void;
   choicesResult?: TChoice[];
   toggleMark?: (questionId: string) => void;
   isMarked?: (questionId: string) => boolean;
   choices?: TChoiceInput[];
};

export const Question = ({
   question,
   order,
   partType,
   type = 'practice',
   handleChoose,
   choicesResult,
   toggleMark,
   isMarked,
}: Props) => {
   const [showExplainAndTranscript, { onToggle }] = useDisclosure();
   const { currentAudioId, setCurrentAudioId } = useAudioCtx();

   const handlePlayAudio = () => {
      setCurrentAudioId(`audio-${question.id}`);
   };

   return (
      <div id={`question-${question.id}`} className="flex flex-col gap-2">
         <div className="flex items-center justify-between">
            <span className="font-medium">Question {order}</span>
            {(question.quesions?.length === 0 || !question.quesions) &&
               type !== 'result' && (
                  <Button
                     variants="transparent"
                     className="!p-0 w-8 h-8"
                     onClick={() => toggleMark?.(question.id)}
                  >
                     {isMarked?.(question.id) ? (
                        <IconFlag3Filled className="w-5 h-5 text-yellow-500" />
                     ) : (
                        <IconFlag3 className="w-5 h-5" />
                     )}
                  </Button>
               )}
         </div>
         {question.audio && type === 'result' && (
            <div className="flex items-center justify-center">
               <ReactPlayer
                  url={question.audio}
                  controls
                  config={{
                     file: {
                        forceAudio: true,
                     },
                  }}
                  height={54}
                  playing={currentAudioId === `audio-${question.id}`}
                  onPlay={handlePlayAudio}
               />
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
                                       answer.isCorrect || Boolean(yourChoice)
                                    }
                                 />
                                 <label
                                    htmlFor={`answer-${answer.id}`}
                                    className={cn('cursor-pointer', {
                                       'pointer-events-none': type === 'result',
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
         {type === 'result' && (question.explain || question.transcript) && (
            <div>
               <div onClick={onToggle} className="font-medium cursor-pointer">
                  {showExplainAndTranscript
                     ? 'Hide explain and transcript'
                     : 'Show explain and transcript'}
               </div>
               {showExplainAndTranscript && (
                  <div>
                     {question.explain && (
                        <div>
                           <span className="font-medium">Explain:</span>
                           <p>{question.explain}</p>
                        </div>
                     )}
                     {question.transcript && (
                        <div>
                           <span className="font-medium">Transcript:</span>
                           <p>{parser(question.transcript)}</p>
                        </div>
                     )}
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default Question;

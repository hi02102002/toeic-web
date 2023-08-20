import { Button } from '@/components/shared';
import { useAudioCtx } from '@/contexts/audio.ctx';
import { TQuestion } from '@/types';
import { IconFlag3, IconFlag3Filled } from '@tabler/icons-react';
import parser from 'html-react-parser';
import Image from 'next/image';
import React from 'react';
import ReactPlayer from 'react-player';

export const Question = ({ children }: { children: React.ReactNode }) => {
   return <div className="flex flex-col gap-2">{children}</div>;
};

export const QuestionAudio = ({ question }: { question: TQuestion }) => {
   const { currentAudioId, setCurrentAudioId } = useAudioCtx();

   const handlePlayAudio = () => {
      setCurrentAudioId(`audio-${question.id}`);
   };
   return question.audio ? (
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
   ) : null;
};

export const QuestionImage = ({ question }: { question: TQuestion }) => {
   return question.image ? (
      <div className="flex items-center justify-center">
         <Image
            src={question.image}
            alt={question.text}
            width={500}
            height={500}
         />
      </div>
   ) : null;
};

export const QuestionText = ({ question }: { question: TQuestion }) => {
   return question.text ? <div>{parser(question.text)}</div> : null;
};

export const QuestionExplainAndTranscript = ({
   question,
   isShow = false,
   onToggle,
}: {
   question: TQuestion;
   isShow?: boolean;
   onToggle?: () => void;
}) => {
   return question.explain || question.transcript ? (
      <div>
         <div onClick={onToggle} className="font-medium cursor-pointer">
            {isShow
               ? 'Hide explain and transcript'
               : 'Show explain and transcript'}
         </div>
         {isShow && (
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
   ) : null;
};

export const QuestionMark = ({
   question,
   toggleMark,
   isMarked,
}: {
   question: TQuestion;
   toggleMark: (questionId: string) => void;
   isMarked: (questionId: string) => boolean;
}) => {
   return question.quesions && question.quesions.length === 0 ? (
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
   ) : null;
};

export const QuestionAnswers = ({}: {}) => {
   return null;
};

export const QuestionOrder = ({ order }: { order: number | string }) => {
   return order ? <span className="font-medium">Question {order}</span> : null;
};

export default Question;

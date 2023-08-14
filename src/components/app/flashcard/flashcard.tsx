import { Button } from '@/components/shared';
import { useDisclosure, useLearnFlashcard } from '@/hooks';
import { TFlashcardWithAnswers } from '@/types';
import { cn, urlAudioWord } from '@/utils';
import { TEvaluation } from '@/utils/srs';
import { IconVolume } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';

type Props = {
   flashcard: TFlashcardWithAnswers;
   withButton?: boolean;
   withAnswer?: boolean;
};

const LIST_BUTTONS: Array<{
   label: string;
   score: TEvaluation['score'];
}> = [
   {
      label: 'Again',
      score: 2,
   },
   {
      label: 'Hard',
      score: 3,
   },
   {
      label: 'Good',
      score: 4,
   },
   {
      label: 'Easy',
      score: 5,
   },
];

const Badge = ({ isReview }: { isReview: boolean }) => {
   return (
      <div
         className={cn(
            'absolute z-30 font-medium right-4 top-4 py-1 px-2 rounded text-white',
            isReview ? 'bg-red-500' : 'bg-green-500'
         )}
      >
         {isReview ? 'Review' : 'New'}
      </div>
   );
};

const Front = ({ flashcard, withButton }: Props) => {
   const [isPlaying, { onOpen: handlePlay, onClose: handlePause }] =
      useDisclosure();

   return (
      <div className="absolute inset-0 flex flex-col items-center justify-center h-full p-4 backface-hidden ">
         {withButton && <Badge isReview={flashcard.n > 0} />}
         <div className="absolute top-4 left-4">
            <IconVolume
               onClick={(e) => {
                  e.stopPropagation();
                  handlePlay();
               }}
            />
            <div className="hidden">
               <ReactPlayer
                  url={urlAudioWord(flashcard.name as string, 1)}
                  config={{
                     file: {
                        forceAudio: true,
                     },
                  }}
                  playing={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handlePause}
               />
            </div>
         </div>
         <div className="relative aspect-auto">
            {flashcard.image && (
               <Image
                  src={flashcard.image}
                  alt={flashcard.name || 'Flashcard Image'}
                  fill
               />
            )}
         </div>
         <h3 className="text-lg font-medium">
            {flashcard.name}
            {flashcard.patchOfSpeech && (
               <span> ({flashcard.patchOfSpeech})</span>
            )}
         </h3>
         <span className="block text-center">
            {flashcard.pronunciation && <span>{flashcard.pronunciation}</span>}
         </span>
      </div>
   );
};

const Back = ({ flashcard, withButton }: Props) => {
   return (
      <div
         className={
            'h-full flex  absolute inset-0 p-4 backface-hidden items-center justify-between '
         }
         style={{
            transform: 'rotateY(-180deg)',
         }}
      >
         {withButton && <Badge isReview={flashcard.n > 0} />}
         <div className="flex-col gap-4">
            {flashcard.meaning && (
               <span>
                  <span className="font-medium">Meaning: </span>
                  {flashcard.meaning}
               </span>
            )}
            {flashcard.definition && (
               <p>
                  <span className="font-medium">Definition: </span>
                  {flashcard.definition}
               </p>
            )}
            {flashcard.note && (
               <span>
                  <span className="font-medium">Note: </span>
                  {flashcard.note}
               </span>
            )}
            {flashcard.examples && flashcard.examples.length > 0 && (
               <div>
                  <span className="font-medium">Examples: </span>
                  <ul className="list-disc list-inside">
                     {flashcard.examples.map((example) => (
                        <li key={example}>{example}</li>
                     ))}
                  </ul>
               </div>
            )}
         </div>
         {flashcard.image && (
            <div className="w-48">
               <div className="relative overflow-hidden rounded aspect-w-4 aspect-h-3">
                  <Image
                     src={flashcard.image}
                     alt={flashcard.name || 'Flashcard Image'}
                     fill
                     className="object-contain"
                  />
               </div>
            </div>
         )}
      </div>
   );
};

export const Flashcard = ({
   flashcard,
   withButton = true,
   withAnswer,
}: Props) => {
   const [
      isFlipped,
      { onToggle: onToggleFlipped, onClose: onCloseFlipped, onOpen: onFlip },
   ] = useDisclosure();

   const { mutateAsync: handleLearnFlashcard } = useLearnFlashcard();
   const [answersChosen, setAnswersChosen] = useState<Record<string, boolean>>(
      {}
   );

   const isAnswered = useMemo(
      () => answersChosen[flashcard.id],
      [answersChosen, flashcard.id]
   );

   useEffect(() => {
      if (isAnswered) {
         onFlip();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isAnswered]);

   useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isAnswered) {
         const steps = Object.keys(answersChosen).length - 1;
         const score = (5 - steps) as TEvaluation['score'];
         timer = setTimeout(() => {
            handleLearnFlashcard(score);
         }, 2000);
      }

      return () => {
         if (timer) clearTimeout(timer);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isAnswered, answersChosen]);

   useEffect(() => {
      if (flashcard.n > 0) {
         onCloseFlipped();
         setAnswersChosen({});
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [flashcard]);

   return (
      <div className="flex flex-col max-w-3xl gap-4 mx-auto">
         <div className="relative w-full h-64 ">
            <div
               className={cn(
                  'rounded shadow bg-bg h-full cursor-pointer select-none relative duration-300'
               )}
               style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  perspective: 1000,
               }}
               onClick={flashcard.n === 0 ? onToggleFlipped : undefined}
            >
               <Front flashcard={flashcard} withButton={withButton} />
               <Back flashcard={flashcard} withButton={withButton} />
            </div>
         </div>
         {withButton && !flashcard.n && (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 sm:gap-4">
               {LIST_BUTTONS.map((button) => {
                  return (
                     <Button
                        variants="primary"
                        className="w-full h-8 p-0"
                        key={button.label}
                        onClick={async () => {
                           await handleLearnFlashcard(button.score);
                           onCloseFlipped();
                        }}
                     >
                        {button.label}
                     </Button>
                  );
               })}
            </div>
         )}
         {flashcard.n > 0 &&
            flashcard.answers &&
            flashcard.answers.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flashcard.answers.map((answer) => {
                     return (
                        <div
                           key={answer.id}
                           className={cn(
                              'flex items-center p-4 rounded  gap-2 border-border border-2 bg-bg cursor-pointer select-none duration-300',
                              {
                                 'border-green-500 bg-green-50/25':
                                    answersChosen[answer.id],
                                 'pointer-events-none': isAnswered,
                                 'border-red-500 bg-red-50/25':
                                    answersChosen[answer.id] === false,
                              }
                           )}
                           onClick={() => {
                              if (isAnswered) return;
                              setAnswersChosen((prev) => ({
                                 ...prev,
                                 [answer.id]: answer.id === flashcard.id,
                              }));
                           }}
                        >
                           <span className="font-medium">
                              {answer.definition || flashcard.meaning}
                           </span>
                        </div>
                     );
                  })}
               </div>
            )}
      </div>
   );
};

export default Flashcard;

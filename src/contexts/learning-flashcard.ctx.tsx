import { useQueue } from '@/hooks/use-queue';
import { TFlashcard, TFlashcardWithAnswers } from '@/types';
import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useState,
} from 'react';

type TLearningFlashcardContext = {
   flashcards: TFlashcardWithAnswers[];
   currentFlashcard: TFlashcard | null;
   handleNext: () => void;
   handleAgain: () => void;
};

export const LearningFlashcardContext =
   createContext<TLearningFlashcardContext>({
      flashcards: [],
      currentFlashcard: null,
      handleNext: () => {},
      handleAgain: () => {},
   });

export const LearningFlashcardProvider = ({
   initFlashcards,
   children,
}: {
   children: React.ReactNode;
   initFlashcards: TFlashcardWithAnswers[];
}) => {
   const [flashcards, { dequeue, enqueue }] = useQueue(initFlashcards);
   const [currentFlashcard, setCurrentFlashcard] = useState<TFlashcard | null>(
      () => dequeue() || flashcards[0] || null
   );

   useEffect(() => {
      if (!currentFlashcard) {
         setCurrentFlashcard(dequeue() || flashcards[0]);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dequeue, currentFlashcard]);

   const handleNext = useCallback(() => {
      const nextFlashcard = dequeue();

      if (nextFlashcard) {
         setCurrentFlashcard(nextFlashcard);
      } else {
         setCurrentFlashcard(null);
      }
   }, [dequeue]);

   const handleAgain = useCallback(() => {
      if (currentFlashcard) {
         enqueue(currentFlashcard);
      }
   }, [enqueue, currentFlashcard]);

   return (
      <LearningFlashcardContext.Provider
         value={{
            flashcards,
            currentFlashcard,
            handleNext,
            handleAgain,
         }}
      >
         {children}
      </LearningFlashcardContext.Provider>
   );
};

export const useLearningFlashcardCtx = () => {
   const context = useContext(LearningFlashcardContext);
   if (context === undefined) {
      throw new Error(
         'useLearningFlashcard must be used within a LearningFlashcardProvider'
      );
   }
   return context;
};

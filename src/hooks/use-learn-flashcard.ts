import { useLearningFlashcardCtx } from '@/contexts/learning-flashcard.ctx';
import { flashcardsService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { supermemo, SuperMemoGrade, SuperMemoItem } from 'supermemo';

const calcNewValues = (item: SuperMemoItem, score: SuperMemoGrade) => {
   const {
      efactor: newEFactor,
      interval: newInterval,
      repetition: newRepetition,
   } = supermemo(item, score);

   const dueDate = new Date(
      dayjs(Date.now()).add(newInterval, 'day').format('YYYY-MM-DD')
   ).toISOString();
   const lastReviewed = new Date(
      dayjs(Date.now()).format('YYYY-MM-DD')
   ).toISOString();

   return {
      dueDate,
      lastReviewed,
      newRepetition,
      newEFactor,
      newInterval,
   };
};

export const useLearnFlashcard = () => {
   const { currentFlashcard, handleNext, handleAgain } =
      useLearningFlashcardCtx();

   return useMutation({
      mutationFn: async (score: SuperMemoGrade) => {
         if (!currentFlashcard) return;
         console.log('currentFlashcard', currentFlashcard);

         if (score === 2) {
            handleAgain();
            return;
         }

         const { n, efactor, interval } = currentFlashcard;

         const item: SuperMemoItem = {
            efactor,
            interval,
            repetition: n,
         };

         const {
            dueDate,
            lastReviewed,
            newRepetition,
            newEFactor,
            newInterval,
         } = calcNewValues(item, score);

         const res = await flashcardsService.updateFlashcard(
            currentFlashcard.id,
            {
               due: dueDate,
               lastReviewed,
               n: newRepetition,
               efactor: newEFactor,
               interval: newInterval,
            }
         );

         return res;
      },
      onSuccess: () => {
         handleNext();
      },
   });
};

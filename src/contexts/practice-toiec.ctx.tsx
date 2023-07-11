import { TChoice, TTest } from '@/types';
import React, { createContext, useContext, useState } from 'react';

type TPracticeToiecCtx = {
   choices: Array<TChoice>;
   handleChoose: (choice: TChoice) => void;
   handleSubmit: () => void;
   isQuestionChose: (choice: TChoice) => boolean;
   marks: Array<string>;
   isMarked: (questionId: string) => boolean;
   toggleMark: (questionId: string) => void;
};

export const PracticeContext = createContext<TPracticeToiecCtx>({
   choices: [],
   handleChoose(choice) {},
   handleSubmit() {},
   isQuestionChose(choice) {
      return true;
   },
   marks: [],
   isMarked(questionId) {
      return true;
   },
   toggleMark(questionId) {},
});

type Props = {
   testId: TTest['id'];
   children: React.ReactNode;
};

export const PracticeProvider = ({ children, testId }: Props) => {
   const [choices, setChoices] = useState<TChoice[]>([]);
   const [marks, setMarks] = useState<string[]>([]);

   const isQuestionChose = (choice: TChoice) => {
      return choices.some((c) => c.questionId === choice.questionId);
   };

   const isMarked = (questionId: string) => {
      return marks.some((m) => m === questionId);
   };

   const handleChoose = (choice: TChoice) => {
      if (isQuestionChose(choice)) {
         setChoices((prev) => {
            return prev.map((c) => {
               if (c.questionId === choice.questionId) {
                  return {
                     ...c,
                     answerId: choice.answerId,
                  };
               }
               return c;
            });
         });
      } else {
         setChoices((prev) => {
            return prev.concat(choice);
         });
      }
   };

   const toggleMark = (questionId: string) => {
      setMarks((prev) => {
         if (isMarked(questionId)) {
            return prev.filter((m) => m !== questionId);
         } else {
            return prev.concat(questionId);
         }
      });
   };

   const handleSubmit = () => {
      console.log(choices);
   };

   return (
      <PracticeContext.Provider
         value={{
            choices,
            handleChoose,
            handleSubmit,
            isQuestionChose,
            marks,
            isMarked,
            toggleMark,
         }}
      >
         {children}
      </PracticeContext.Provider>
   );
};

export const usePractice = () => useContext(PracticeContext);

import { TChoice, TChoiceInput, TTest } from '@/types';
import React, { createContext, useContext, useState } from 'react';

type TPracticeResultCtx = {
   choices: Array<TChoiceInput>;
   handleChoose: (choice: TChoiceInput) => void;
   handleSubmit: () => void;
   isQuestionChose: (choice: TChoiceInput) => boolean;
   marks: Array<string>;
   isMarked: (questionId: string) => boolean;
   toggleMark: (questionId: string) => void;
   choicesResult: Array<TChoice>;
};

export const PracticeResultCtx = createContext<TPracticeResultCtx>({
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
   choicesResult: [],
});

type Props = {
   testId: TTest['id'];
   children: React.ReactNode;
   choicesResult: Array<TChoice>;
};

export const PracticeResultProvider = ({
   children,
   testId,
   choicesResult,
}: Props) => {
   const [choices, setChoices] = useState<TChoiceInput[]>([]);
   const [marks, setMarks] = useState<string[]>([]);

   const isQuestionChose = (choice: TChoiceInput) => {
      return choices.some((c) => c.questionId === choice.questionId);
   };

   const isMarked = (questionId: string) => {
      return marks.some((m) => m === questionId);
   };

   const handleChoose = (choice: TChoiceInput) => {
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
      <PracticeResultCtx.Provider
         value={{
            choices,
            handleChoose,
            handleSubmit,
            isQuestionChose,
            marks,
            isMarked,
            toggleMark,
            choicesResult,
         }}
      >
         {children}
      </PracticeResultCtx.Provider>
   );
};

export const usePractice = () => {
   const ctx = useContext(PracticeResultCtx);
   if (ctx === undefined) {
      throw new Error('Ctx without provider');
   }

   return ctx;
};

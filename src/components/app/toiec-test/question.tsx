import { Question } from '@/components/shared';
import { usePractice } from '@/contexts/practice-toiec.ctx';
import { PartType, TQuestion } from '@/types';

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
   const { handleChoose, toggleMark, isMarked, choicesResult, choices } =
      usePractice();

   return (
      <Question
         question={question}
         order={order}
         partType={partType}
         type={type}
         handleChoose={handleChoose}
         toggleMark={toggleMark}
         isMarked={isMarked}
         choicesResult={choicesResult}
         choices={choices}
      />
   );
};

export default QuestionWrapper;

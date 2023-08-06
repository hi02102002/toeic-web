import { TFlashcard } from '@/types';

type Props = {
   flashcard: TFlashcard;
};

const Front = ({ flashcard }: { flashcard: TFlashcard }) => {
   return <div></div>;
};

const Back = ({ flashcard }: { flashcard: TFlashcard }) => {
   return <div></div>;
};
const Flashcard = ({ flashcard }: Props) => {
   return (
      <div>
         <Front flashcard={flashcard} />
         <Back flashcard={flashcard} />
      </div>
   );
};

export default Flashcard;

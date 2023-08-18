import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { TDeck } from '@/types';
import { IconBoxMultiple } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
   deck: TDeck;
};

export const DeckCard = ({ deck }: Props) => {
   return (
      <Link href={`${ROUTES.FLASHCARDS}/${deck.id}`} className="block h-full">
         <div className="relative h-full p-4 space-y-1 border rounded cursor-pointer border-border">
            <span className="text-lg font-semibold line-clamp-1">
               {deck.name}
            </span>
            <div className="flex items-center gap-2">
               <IconBoxMultiple className="w-4 h-4" />
               {deck._count.flashcards > 0 ? (
                  <span>
                     {deck._count.flashcards}{' '}
                     {deck._count.flashcards > 1 ? 'flashcards' : 'flashcard'}
                  </span>
               ) : (
                  <span>Not have any flashcards</span>
               )}
            </div>
         </div>
      </Link>
   );
};

export default DeckCard;

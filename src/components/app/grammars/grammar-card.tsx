import { ROUTES } from '@/constants';
import { TGrammar } from '@/types';
import { IconNotebook } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
   grammar: TGrammar;
};

export const GrammarCard = ({ grammar }: Props) => {
   return (
      <Link
         href={`${ROUTES.GRAMMARS}/${grammar.id}`}
         className="block h-full"
         title={grammar.name}
      >
         <div className="relative flex items-center h-full gap-4 p-4 border rounded cursor-pointer border-border">
            <IconNotebook className="flex-shrink-0" />
            <span className="text-lg font-semibold line-clamp-1">
               {grammar.name}
            </span>
         </div>
      </Link>
   );
};

export default GrammarCard;

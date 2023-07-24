import { ROUTES } from '@/constants';
import { TTopic } from '@/types';
import { IconBoxMultiple } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
   topic: TTopic;
};

export const TopicCard = ({ topic }: Props) => {
   return (
      <Link
         href={`${ROUTES.VOCABULARIES}/${topic.id}`}
         className="h-full block"
      >
         <div className="border border-border p-4 rounded relative cursor-pointer space-y-1 h-full">
            <span className="text-lg font-semibold line-clamp-1">
               {topic.name}
            </span>
            <div className="flex items-center gap-2">
               <IconBoxMultiple className="w-4 h-4" />
               <span>
                  {topic._count.topics}{' '}
                  {topic._count.topics > 1 ? 'Sub topics' : 'Sub topic'}
               </span>
            </div>
            <div className="flex items-center gap-2">
               <IconBoxMultiple className="w-4 h-4" />
               <span>
                  {topic._count.words}{' '}
                  {topic._count.words > 1 ? 'Words' : 'Word'}
               </span>
            </div>
         </div>
      </Link>
   );
};

export default TopicCard;

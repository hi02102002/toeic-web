import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { TTest } from '@/types';
import { isNew } from '@/utils';
import { IconClockHour2 } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Confirm } from '../modal';

type Props = {
   test: TTest;
};

export const ToiecTestCard = ({ test }: Props) => {
   const router = useRouter();
   const { user } = useUser();

   return (
      <Confirm
         onConfirm={async (onClose) => {
            if (user?.isTesting) {
               toast.error(
                  'You are testing another test. Please reload page. Or try again later'
               );
               return;
            }
            await router.push(`${ROUTES.TOIEC_TEST}/${test.id}/practice`);
            onClose?.();
         }}
         description="You will have 120 minutes to complete 200 question. Good luck!"
         title="Start test?"
         textConfirm="Start"
      >
         <div className="border border-border p-4 rounded relative cursor-pointer">
            <span className="text-lg font-semibold">{test.name}</span>

            <div className="text-muted-foreground">
               <div className="flex items-center gap-1">
                  <IconClockHour2 className="w-4 h-4" />
                  120 minutes
               </div>
               <span>7 Parts | 200 Questions</span>
            </div>
            {isNew(test.createdAt) && (
               <span className="h-4 right-[-1px] top-[-1px] absolute px-2 rounded-tr rounded-bl text-white text-xs flex items-center justify-center bg-red-500">
                  New
               </span>
            )}
         </div>
      </Confirm>
   );
};

export default ToiecTestCard;

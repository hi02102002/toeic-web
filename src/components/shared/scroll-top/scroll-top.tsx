import { Button } from '@/components/shared';
import { cn } from '@/utils';
import * as Portal from '@radix-ui/react-portal';
import { IconArrowUp } from '@tabler/icons-react';
import { useWindowScroll } from '@uidotdev/usehooks';

export const ScrollTop = () => {
   const [{ y }, scrollTo] = useWindowScroll();

   return (
      <Portal.Portal
         className={cn(
            'opacity-0 translate-y-10 invisible fixed right-4 bottom-4 transition-all   ',
            {
               'opacity-100 visible translate-y-0': y >= 300,
            }
         )}
      >
         <Button
            className="w-9 h-9"
            variants="primary"
            onClick={() => {
               scrollTo({ left: 0, top: 0, behavior: 'smooth' });
            }}
         >
            <IconArrowUp className="flex-shrink-0" />
         </Button>
      </Portal.Portal>
   );
};

export default ScrollTop;

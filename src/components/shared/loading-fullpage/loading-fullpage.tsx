import { cn } from '@/utils';
import { IconLoader2 } from '@tabler/icons-react';

export type LoadingFullPageProps = {
   classNameLoading?: string;
   classNameOverlay?: string;
   hasOverlay?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

import * as Portal from '@radix-ui/react-portal';
import { useEffect } from 'react';
export const LoadingFullPage = ({
   className,
   classNameLoading,
   classNameOverlay,
   children,
   hasOverlay,
   ...props
}: LoadingFullPageProps) => {
   // useEffect(() => {
   //    const body = document.querySelector('body');
   //    if (body) {
   //       body.style.overflow = 'hidden';
   //    }

   //    return () => {
   //       if (body) {
   //          body.style.overflow = 'unset';
   //       }
   //    };
   // }, []);

   return (
      <Portal.Root>
         <div
            className={cn(
               'fixed inset-0 bg-transparent z-[1000] pointer-events-none]',
               classNameOverlay
            )}
         />
         <div
            className={cn(
               'h-screen p-4 flex items-center justify-center bg-bg overflow-hidden pointer-events-none',
               className
            )}
            {...props}
         >
            <IconLoader2
               className={cn(
                  'w-6 h-6 animate-spin text-foreground relative z-20',
                  classNameLoading
               )}
            />
            {children}
         </div>
      </Portal.Root>
   );
};

export default LoadingFullPage;

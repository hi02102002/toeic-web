import { cn } from '@/utils';
import { IconLoader2 } from '@tabler/icons-react';

export type LoadingFullPageProps = {
   classNameLoading?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const LoadingFullPage = ({
   className,
   classNameLoading,
   ...props
}: LoadingFullPageProps) => {
   return (
      <div
         className={cn(
            'h-screen p-4 flex items-center justify-center bg-bg',
            className
         )}
         {...props}
      >
         <IconLoader2
            className={cn(
               'w-6 h-6 animate-spin text-foreground',
               classNameLoading
            )}
         />
      </div>
   );
};

export default LoadingFullPage;

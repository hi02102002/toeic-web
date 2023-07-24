import { cn } from '@/utils';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

const Progress = React.forwardRef<
   React.ElementRef<typeof ProgressPrimitive.Root>,
   React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
      classNameIndicator?: string;
   }
>(({ className, value, classNameIndicator, ...props }, ref) => (
   <ProgressPrimitive.Root
      ref={ref}
      className={cn(
         'relative h-2 w-full rounded bg-primary/20 overflow-hidden',
         className
      )}
      {...props}
   >
      <ProgressPrimitive.Indicator
         className={cn(
            'h-full w-full flex-1 bg-primary transition-all relative',
            classNameIndicator
         )}
         style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      ></ProgressPrimitive.Indicator>
   </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

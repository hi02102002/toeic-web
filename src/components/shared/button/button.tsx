import { cn } from '@/utils';
import { IconLoader2 } from '@tabler/icons-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

export const button = tv({
   base: 'outline-0 focus:outline-0 active:outline-0 border-0 rounded transition-[background-color] font-medium flex items-center justify-center',
   variants: {
      variants: {
         default: '',
         primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
         secondary:
            'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
         outline:
            'bg-transparent hover:bg-accent text-accent-foreground/70 border-accent border-2',
         transparent:
            'bg-transparent hover:bg-accent hover:text-accent-foreground/70',
         danger: 'bg-red-500 hover:bg-red-500/90 text-white',
      },
      sizes: {
         sm: 'h-9 px-4',
         md: 'h-10 px-4',
         lg: 'px-5 py-4 text-lg',
      },
      disabled: {
         true: 'opacity-70 pointer-events-none select-none',
      },
   },
   compoundVariants: [
      {
         disabled: 'true',
         variants: 'outline',
         className: 'bg-accent text-accent-foreground',
      },
   ],
   defaultVariants: {
      sizes: 'md',
   },
});

type Props = {
   leftIcon?: React.ReactNode;
   rightIcon?: React.ReactNode;
   isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
   VariantProps<typeof button>;

const Button = forwardRef<HTMLButtonElement, Props>(
   (
      {
         className,
         variants,
         sizes,
         disabled,
         children,
         isLoading,
         leftIcon,
         ...props
      }: Props,
      ref
   ) => {
      return (
         <button
            ref={ref}
            className={cn(
               button({
                  variants,
                  sizes,
                  disabled: disabled || isLoading,
               }),
               className
            )}
            disabled={disabled || isLoading}
            {...props}
         >
            {!isLoading && leftIcon ? (
               <div className="mr-2">{leftIcon}</div>
            ) : null}

            {isLoading && <IconLoader2 className="w-5 h-5 mr-2 animate-spin" />}
            {children}
         </button>
      );
   }
);

Button.displayName = 'Button';
export default Button;

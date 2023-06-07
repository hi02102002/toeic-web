import { IconLoader2 } from '@tabler/icons-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
   base: 'outline-0 focus:outline-0 active:outline-0 border-0 rounded-md transition-all font-medium flex items-center justify-center',
   variants: {
      variants: {
         primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
         secondary:
            'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
         outline:
            'bg-transparent hover:bg-accent text-accent-foreground/70 border-accent border-2',
      },
      sizes: {
         sm: 'h-9 py-2 px-4',
         md: 'px-4 py-3 text-base',
         lg: 'px-5 py-4 text-lg',
      },
      disabled: {
         true: 'opacity-70 pointer-events-none select-none bg-accent text-accent-foreground',
      },
   },
   defaultVariants: {
      colors: 'primary',
      sizes: 'sm',
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
            className={button({
               className,
               variants,
               sizes,
               disabled: disabled || isLoading,
            })}
            disabled={disabled || isLoading}
            {...props}
         >
            {!isLoading && leftIcon ? (
               <div className="mr-2">{leftIcon}</div>
            ) : null}

            {isLoading && <IconLoader2 className="animate-spin w-5 h-5 mr-2" />}
            {children}
         </button>
      );
   }
);

Button.displayName = 'Button';
export default Button;

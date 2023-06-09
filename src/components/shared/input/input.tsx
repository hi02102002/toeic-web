import { useDisclosure } from '@/hooks';
import { cn } from '@/utils';
import { IconEye, IconEyeClosed } from '@tabler/icons-react';
import { HtmlHTMLAttributes, InputHTMLAttributes, forwardRef } from 'react';
import { VariantProps, tv } from 'tailwind-variants';

const input = tv({
   base: cn(
      'px-3 rounded border-2 border-input placeholder:text-muted-foreground w-full placeholder:leading-none relative transition-all',
      'focus:border-primary outline-0'
   ),
   variants: {
      sizes: {
         sm: 'h-9',
         md: 'h-10',
         lg: 'h-11',
      },
      error: {
         true: 'border-red-500 focus:border-red-500',
      },
   },
   defaultVariants: {
      sizes: 'md',
   },
});

type Props = {} & InputHTMLAttributes<HTMLInputElement> &
   VariantProps<typeof input>;

const Input = forwardRef<HTMLInputElement, Props>(
   ({ className, sizes, type, error, ...props }: Props, ref) => {
      const isPassword = type === 'password';

      const [isShowPass, { onToggle: onToggleShowPass }] = useDisclosure();

      return (
         <div className="relative">
            <input
               className={cn(input({ sizes, error }), className, {
                  'pr-9': isPassword,
               })}
               {...props}
               type={isPassword && isShowPass ? 'password' : 'text'}
               ref={ref}
            />
            {isPassword && (
               <div
                  onClick={onToggleShowPass}
                  className="absolute flex items-center justify-center bg-white cursor-pointer right-[3px] top-[2px] bottom-[2px] w-[33px]"
               >
                  {isShowPass ? (
                     <IconEyeClosed className="w-4 h-4 text-muted-foreground" />
                  ) : (
                     <IconEye className="w-4 h-4 text-muted-foreground" />
                  )}
               </div>
            )}
         </div>
      );
   }
);

const InputWrapper = ({
   className,
   children,
   ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
   return (
      <div className={cn('space-y-1', className)} {...props}>
         {children}
      </div>
   );
};

const InputLabel = ({
   className,
   children,
   required,
   ...props
}: HtmlHTMLAttributes<HTMLLabelElement> & {
   required?: boolean;
}) => {
   return (
      <label
         className={cn(
            'font-medium text-sm  select-none',
            {
               'after:content-["*"] after:text-red-500 after:ml-2': required,
            },
            className
         )}
         {...props}
      >
         {children}
      </label>
   );
};

const InputMessage = ({
   children,
   className,
   ...props
}: HtmlHTMLAttributes<HTMLLabelElement>) => {
   return (
      <span
         className={cn('text-sm text-muted-foreground  select-none', className)}
         {...props}
      >
         {children}
      </span>
   );
};

Input.displayName = 'Input';

export { InputLabel, InputMessage, InputWrapper, Input };

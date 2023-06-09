import { cn } from '@/utils';
import Image from 'next/image';
import { HtmlHTMLAttributes, forwardRef, useState } from 'react';
import { VariantProps, tv } from 'tailwind-variants';

const avatar = tv({
   base: 'rounded-full object-cover overflow-hidden relative aspect-square ',
   variants: {
      sizes: {
         sm: 'h-8 w-8',
         md: 'h-10 w-10 text-lg',
         lg: 'h-16 w-16',
      },
      noUrl: {
         true: 'bg-accent text-accent-foreground flex items-center justify-center font-medium',
      },
   },
   defaultVariants: {
      sizes: 'md',
   },
});

type Props = {
   url?: string;
   alt?: string;
} & VariantProps<typeof avatar> &
   HtmlHTMLAttributes<HTMLDivElement>;

const Avatar = forwardRef<HTMLDivElement, Props>(
   ({ alt, url, className, sizes, ...props }, ref) => {
      const [error, setError] = useState(false);

      return (
         <div
            className={cn(avatar({ sizes, noUrl: !url || error }), className)}
            {...props}
            ref={ref}
         >
            {url && !error ? (
               <Image
                  src={url}
                  alt={alt || 'Avatar'}
                  fill
                  onError={() => setError(true)}
                  placeholder="blur"
                  blurDataURL={url}
               />
            ) : (
               <span>{alt?.charAt(0) || 'A'}</span>
            )}
         </div>
      );
   }
);

Avatar.displayName = 'Avatar';

export default Avatar;

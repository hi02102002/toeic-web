import { cn } from '@/utils';
import NLink, { LinkProps } from 'next/link';
import React from 'react';
import { tv } from 'tailwind-variants';

const link = tv({
   base: 'underline underline-offset-4 text-muted-foreground inline-block cursor-pointer',
});

type Props = {
   className?: string;
   children: React.ReactNode;
   href?: string;
} & Omit<LinkProps, 'href'>;

export const Link = ({ className, children, href, ...props }: Props) => {
   console.log('href', href);
   if (href) {
      return (
         <NLink {...props} className={cn(link(), className)} href={href}>
            {children}
         </NLink>
      );
   }

   return (
      <span {...props} className={cn(link(), className)}>
         {children}
      </span>
   );
};

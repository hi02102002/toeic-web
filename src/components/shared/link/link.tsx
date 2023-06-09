import { cn } from '@/utils';
import NLink, { LinkProps } from 'next/link';
import React from 'react';
import { tv } from 'tailwind-variants';

const link = tv({
   base: 'underline underline-offset-4 text-muted-foreground inline-block',
});

type Props = {
   className?: string;
   children: React.ReactNode;
} & LinkProps;

export const Link = ({ className, children, ...props }: Props) => {
   return (
      <NLink {...props} className={cn(link(), className)}>
         {children}
      </NLink>
   );
};

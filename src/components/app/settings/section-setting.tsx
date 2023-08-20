import { cn } from '@/utils';
import React from 'react';

type Props = {
   children: React.ReactNode;
};

type SectionSettingTitleProps = {
   title: string;
   className?: string;
};

export const SectionSettingTitle = ({
   title,
   className,
}: SectionSettingTitleProps) => {
   return <h3 className={cn('text-lg font-semibold', className)}>{title}</h3>;
};

type SectionSettingDescriptionProps = {
   description: string;
   className?: string;
};

export const SectionSettingDescription = ({
   description,
   className,
}: SectionSettingDescriptionProps) => {
   return (
      <p className={cn('text-sm text-muted-foreground', className)}>
         {description}
      </p>
   );
};

type SectionSettingTextRequireProps = {
   text: string;
   className?: string;
};

export const SectionSettingTextRequired = ({
   text,
   className,
}: SectionSettingTextRequireProps) => {
   return (
      <p className={cn('text-sm text-muted-foreground', className)}>{text}</p>
   );
};

type SectionSettingBottomProps = {
   children: React.ReactNode;
   className?: string;
};

export const SectionSettingBottom = ({
   children,
   className,
}: SectionSettingBottomProps) => {
   return (
      <div
         className={cn(
            'flex  justify-between p-4 border-t border-border flex-col md:flex-row md:items-center items-start gap-4',
            className
         )}
      >
         {children}
      </div>
   );
};

export const SectionSetting = ({ children }: Props) => {
   return <div className="rounded border-border border bg-bg">{children}</div>;
};

export const SectionSettingBody = ({ children }: Props) => {
   return <div className="p-4">{children}</div>;
};

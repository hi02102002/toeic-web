import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/shared';
import { DialogTrigger } from '@radix-ui/react-dialog';
import parser from 'html-react-parser';
import React from 'react';

type Props = {
   children: React.ReactNode;
   paragraph: string;
};

export const ViewParagraph = ({ children, paragraph }: Props) => {
   return (
      <Dialog>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent className="w-full !max-w-2xl">
            <DialogHeader>
               <DialogTitle>View Paragraph</DialogTitle>
            </DialogHeader>
            <div className="prose max-w-full">{parser(paragraph)}</div>
         </DialogContent>
      </Dialog>
   );
};

export default ViewParagraph;

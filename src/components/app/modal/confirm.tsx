import {
   Button,
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { DialogDescription } from '@radix-ui/react-dialog';
import React from 'react';

type Props = {
   children: React.ReactNode;
   title: string;
   description: string;
   onConfirm?: (close?: () => void) => void;
   type?: 'danger' | 'primary';
   textConfirm?: string;
};

export const Confirm = ({
   children,
   title,
   description,
   onConfirm,
   type = 'primary',
   textConfirm = 'Confirm',
}: Props) => {
   const [isOpenConfirm, { onClose: onCloseConfirm, onOpen: onOpenConfirm }] =
      useDisclosure();

   return (
      <Dialog
         open={isOpenConfirm}
         onOpenChange={(open) => {
            if (open) {
               onOpenConfirm();
            } else {
               onCloseConfirm();
            }
         }}
      >
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <Button onClick={onCloseConfirm} variants="outline">
                  Cancel
               </Button>
               <Button
                  variants={type}
                  onClick={() => {
                     onConfirm?.(onCloseConfirm);
                  }}
               >
                  {textConfirm}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default Confirm;

import {
   Button,
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   Input,
   InputLabel,
   InputWrapper,
   TextArea,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import React from 'react';

type Props = {
   children: React.ReactNode;
   title?: string;
   description?: string;
   onConfirm?: ({ json, close }: { close?: () => void; json: string }) => void;
};

export const ImportJson = ({
   children,
   description = '',
   title = '',
   onConfirm,
}: Props) => {
   const [isOpen, { onClose: onClose, onOpen: onOpen }] = useDisclosure();
   const [content, setContent] = React.useState('');
   return (
      <Dialog
         open={isOpen}
         onOpenChange={(open) => {
            if (open) {
               onOpen();
            } else {
               onClose();
            }
         }}
      >
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title || 'Import JSON'}</DialogTitle>
               <DialogDescription>
                  {description || 'Import your JSON file to save your data'}
               </DialogDescription>
            </DialogHeader>
            <InputWrapper>
               <InputLabel required>File</InputLabel>
               <Input
                  placeholder="File"
                  type="file"
                  onChange={(e: any) => {
                     const file = e.target.files[0];

                     if (!file) return;

                     const reader = new FileReader();

                     reader.readAsText(file, 'UTF-8');

                     reader.onload = (readerEvent) => {
                        setContent(readerEvent.target?.result as string);
                     };

                     reader.onerror = (readerEvent) => {
                        console.log(readerEvent.target?.error);
                     };
                  }}
               />
            </InputWrapper>
            <InputWrapper>
               <InputLabel>File content</InputLabel>
               <TextArea
                  placeholder="File content"
                  disabled
                  className="resize-none"
                  value={content}
                  onChange={(e) => {
                     setContent(e.target.value);
                  }}
               />
            </InputWrapper>
            <DialogFooter>
               <Button variants="outline" onClick={onClose}>
                  Cancel{' '}
               </Button>
               <Button
                  variants="primary"
                  onClick={() => {
                     onConfirm?.({
                        json: content,
                        close: () => {
                           onClose();
                           setContent('');
                        },
                     });
                  }}
                  disabled={content === ''}
               >
                  Import
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ImportJson;

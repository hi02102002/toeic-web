import { useCallback, useState } from 'react';

export const useDisclosure = (
   initState = false,
   callbacks?: {
      close?: () => void;
      open?: () => void;
   }
) => {
   const [isOpen, setIsOpen] = useState<boolean>(initState);

   const { close, open } = callbacks || {};

   const onOpen = useCallback(() => {
      setIsOpen((prev) => {
         if (!prev) {
            open?.();

            return true;
         }

         return prev;
      });
   }, [open]);

   const onClose = useCallback(() => {
      setIsOpen((prev) => {
         if (prev) {
            close?.();

            return false;
         }
         return prev;
      });
   }, [close]);

   const onToggle = useCallback(() => {
      if (isOpen) {
         return onClose();
      }

      return onOpen();
   }, [isOpen, onClose, onOpen]);

   return [isOpen, { onClose, onOpen, onToggle }] as const;
};

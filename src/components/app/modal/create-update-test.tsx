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
   InputMessage,
   InputWrapper,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

const schema = zod.object({
   name: zod.string().nonempty('Test name is required'),
   audio: zod.any().refine((value) => value.length > 0, 'Audio is required'),
});

type FormValues = zod.infer<typeof schema>;

type Props = {
   onSubmit: (
      values: FormValues,
      resetForm?: () => void,
      close?: () => void
   ) => void;
   onClose?: () => void;
   onOpen?: () => void;
   open?: boolean;
   defaultValues?: FormValues;
   children: React.ReactNode;
   type?: 'create' | 'update';
   testName?: string;
};

export const CreateUpdateTest = ({
   onSubmit,
   defaultValues,
   children,
   type = 'create',
   testName,
   ...props
}: Props) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues || {
         name: '',
      },
   });

   const [openMenu, { onClose, onOpen }] = useDisclosure(props.open || false, {
      close: () => {
         reset({ name: '' });
         props.onClose?.();
      },
      open() {
         props.onOpen?.();
      },
   });

   const { ref: audioRef, ...audioProps } = register('audio');
   const audioInputRef = useRef<HTMLInputElement | null>(null);

   useEffect(() => {
      if (defaultValues?.audio) {
         const file = new File([], defaultValues?.audio);

         const data = new DataTransfer();

         data.items.add(file);

         if (audioInputRef.current) audioInputRef.current.files = data.files;
      }
   });

   return (
      <Dialog
         open={openMenu}
         onOpenChange={(open) => {
            if (open) onOpen?.();
            else onClose?.();
         }}
      >
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>
                  {type === 'create' ? 'Create test' : 'Update test'}
               </DialogTitle>
               <DialogDescription>
                  {type === 'create' ? (
                     'Create new test'
                  ) : (
                     <>
                        Update test <strong>{testName}</strong>
                     </>
                  )}
               </DialogDescription>
            </DialogHeader>
            <InputWrapper>
               <InputLabel required>Test name</InputLabel>
               <Input
                  placeholder="Test name"
                  {...register('name')}
                  error={!!errors.name?.message}
               />
               {errors.name && (
                  <InputMessage className="text-red-500">
                     {errors.name.message}
                  </InputMessage>
               )}
            </InputWrapper>
            <InputWrapper>
               <InputLabel required>Audio</InputLabel>
               <input
                  type="file"
                  {...audioProps}
                  ref={(e) => {
                     audioRef(e);
                     audioInputRef.current = e;
                  }}
               />
               {errors.audio && (
                  <InputMessage className="text-red-500">
                     {errors.audio?.message as string}
                  </InputMessage>
               )}
            </InputWrapper>
            <DialogFooter>
               <Button variants="secondary" onClick={onClose}>
                  Close
               </Button>
               <Button
                  variants="primary"
                  onClick={
                     onSubmit
                        ? handleSubmit((data) =>
                             onSubmit(
                                data,
                                () => {
                                   reset({ name: '' });
                                },
                                onClose
                             )
                          )
                        : undefined
                  }
               >
                  {type === 'create' ? 'Create' : 'Update'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default CreateUpdateTest;

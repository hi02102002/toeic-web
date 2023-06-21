import {
   Button,
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   InputLabel,
   InputMessage,
   InputWrapper,
   TextArea,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
   onSubmit: ({
      values,
      close,
      resetForm,
   }: {
      values: FormValues;
      resetForm?: () => void;
      close?: () => void;
   }) => void;

   defaultValues?: FormValues;
   children: React.ReactNode;
   type?: 'create' | 'update';
};

const schema = z.object({
   audio: z.any().refine((value) => value.length > 0, 'Audio is required'),
   image: z.any().optional(),
   transcript: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const CreateUpdateQuestionPart34 = ({
   children,
   onSubmit,
   type = 'create',
   defaultValues,
}: Props) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues || {
         transcript: '',
         audio: undefined,
      },
   });

   const {
      control,
      register,
      handleSubmit,
      reset,
      formState: { errors, isDirty },
   } = form;

   const [isOpen, { onClose, onOpen }] = useDisclosure();

   const audioInputRef = useRef<HTMLInputElement | null>(null);
   const imageInputRef = useRef<HTMLInputElement | null>(null);

   const { ref: audioRef, ...audioProps } = register('audio');
   const { ref: imageRef, ...imageProps } = register('image');

   useEffect(() => {
      if (defaultValues?.image) {
         const file = new File([], defaultValues?.image);

         const data = new DataTransfer();

         data.items.add(file);

         if (imageInputRef.current) imageInputRef.current.files = data.files;
      }
      if (defaultValues?.audio) {
         const file = new File([], defaultValues?.audio);

         const data = new DataTransfer();

         data.items.add(file);

         if (audioInputRef.current) audioInputRef.current.files = data.files;
      }
   });

   return (
      <Dialog
         open={isOpen}
         onOpenChange={(open) => {
            if (open) onOpen();
            else onClose();
         }}
      >
         <DialogTrigger asChild>
            <div>{children}</div>
         </DialogTrigger>
         <DialogContent className="my-4">
            <Form {...form}>
               <form
                  className="space-y-4"
                  onSubmit={handleSubmit((data) => {
                     onSubmit({
                        values: data,
                        resetForm: () => {
                           reset();
                        },
                        close: () => {
                           onClose();
                        },
                     });
                  })}
               >
                  <DialogHeader>
                     <DialogTitle>
                        {type === 'create' ? 'Create' : 'Update'} Question
                     </DialogTitle>
                  </DialogHeader>
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
                  <InputWrapper>
                     <InputLabel>Image</InputLabel>
                     <input
                        type="file"
                        {...imageProps}
                        ref={(e) => {
                           imageRef(e);
                           imageInputRef.current = e;
                        }}
                     />
                     {errors.image && (
                        <InputMessage className="text-red-500">
                           {errors.image?.message as string}
                        </InputMessage>
                     )}
                  </InputWrapper>
                  <FormField
                     name="transcript"
                     control={control}
                     render={({ field }) => {
                        return (
                           <FormItem className="w-full">
                              <FormLabel>Transcript</FormLabel>
                              <FormControl>
                                 <TextArea
                                    placeholder="Enter transcript"
                                    className="w-full resize-none"
                                    {...field}
                                 />
                              </FormControl>
                           </FormItem>
                        );
                     }}
                  />
                  <DialogFooter>
                     <Button
                        variants="secondary"
                        type="button"
                        onClick={onClose}
                     >
                        Cancel
                     </Button>
                     <Button
                        variants="primary"
                        disabled={!isDirty && type === 'update'}
                     >
                        {type === 'create' ? 'Create' : 'Save changes'}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default CreateUpdateQuestionPart34;

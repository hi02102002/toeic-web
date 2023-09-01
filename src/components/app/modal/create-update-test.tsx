import {
   Button,
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Input,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
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
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues || {
         name: '',
      },
   });
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
   } = form;

   const [openMenu, { onClose, onOpen }] = useDisclosure(props.open || false, {
      close: () => {
         reset({ name: '' });
         props.onClose?.();
      },
      open() {
         props.onOpen?.();
      },
   });

   const [typeAudio, setTypeAudio] = useState<'file' | 'url'>('file');

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
            <Form {...form}>
               <form
                  className="space-y-4"
                  onSubmit={handleSubmit((values) => {
                     onSubmit(
                        values,
                        () => {
                           reset({ name: '' });
                        },
                        onClose
                     );
                  })}
               >
                  <FormField
                     name="name"
                     control={control}
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Test name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Test name"
                                    {...field}
                                    error={fieldState.error?.message}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />

                  <FormField
                     name="audio"
                     control={control}
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Audio</FormLabel>
                              <FormControl>
                                 <>
                                    {typeAudio === 'file' && (
                                       <Input
                                          type="file"
                                          {...audioProps}
                                          ref={(e) => {
                                             audioRef(e);
                                             audioInputRef.current = e;
                                          }}
                                          error={!!errors.name?.message}
                                          placeholder="Audio file"
                                       />
                                    )}
                                    {typeAudio === 'url' && (
                                       <Input
                                          placeholder="Audio link"
                                          {...field}
                                          error={fieldState.error?.message}
                                       />
                                    )}
                                 </>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Button
                        variants="primary"
                        className="w-full"
                        onClick={() => {
                           setTypeAudio('file');
                           if (type === 'create') {
                              reset({ audio: '' });
                           }
                        }}
                     >
                        Using file
                     </Button>
                     <Button
                        variants="primary"
                        className="w-full"
                        onClick={() => {
                           setTypeAudio('url');
                           if (type === 'create') {
                              reset({ audio: '' });
                           }
                        }}
                     >
                        Using link{' '}
                     </Button>
                  </div>
                  <DialogFooter>
                     <Button variants="secondary" onClick={onClose}>
                        Close
                     </Button>
                     <Button variants="primary" type="submit">
                        {type === 'create' ? 'Create' : 'Update'}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default CreateUpdateTest;

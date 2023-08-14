import {
   Button,
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   Editor,
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
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
type Props = {
   children: React.ReactNode;
   type?: 'create' | 'update';
   onSubmit: (values: FormValues, onClose?: () => void) => void;
   defaultValues?: FormValues;
};

const schema = z.object({
   name: z.string().nonempty('Title is required'),
   theory: z.string().nonempty('Theory is required'),
});

type FormValues = z.infer<typeof schema>;

export const CreateUpdateGrammar = ({
   children,
   type = 'create',
   onSubmit,
   defaultValues,
}: Props) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues || {
         name: '',
         theory: '',
      },
   });
   const {
      control,
      handleSubmit,
      reset,
      formState: { isDirty },
   } = form;

   const [open, { onClose, onOpen }] = useDisclosure(false, {
      close() {
         reset({
            name: '',
            theory: '',
         });
      },
   });

   return (
      <Dialog
         open={open}
         onOpenChange={(open) => {
            if (open) {
               onOpen();
            } else {
               onClose();
            }
         }}
      >
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent className="!max-w-2xl">
            <DialogHeader>
               <DialogTitle>
                  {type === 'create'
                     ? 'Create grammar lesson'
                     : 'Update grammar lesson'}
               </DialogTitle>
               <DialogDescription>
                  Create grammar lesson to explain the theory.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-4"
                  onSubmit={handleSubmit((data) => onSubmit(data, onClose))}
                  id="grammar"
               >
                  <FormField
                     control={control}
                     name="name"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Title</FormLabel>
                              <FormControl>
                                 <Input {...field} error={!!fieldState.error} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     control={control}
                     name="theory"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Theory</FormLabel>
                              <FormControl>
                                 <Editor
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!fieldState.error}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
               </form>
               <DialogFooter>
                  <Button variants="outline" type="button" onClick={onClose}>
                     Cancel
                  </Button>
                  <Button
                     variants="primary"
                     disabled={!isDirty && type === 'update'}
                     type="submit"
                     form="grammar"
                  >
                     {type === 'create' ? 'Create' : 'Save changes'}
                  </Button>
               </DialogFooter>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default CreateUpdateGrammar;

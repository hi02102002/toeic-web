import {
   Button,
   Dialog,
   DialogContent,
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
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
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
   text: z.string().nonempty({
      message: 'Content is required',
   }),
});

type FormValues = z.infer<typeof schema>;

export const CreateUpdateQuestionPart67 = ({
   children,
   onSubmit,
   type = 'create',
   defaultValues,
}: Props) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues || {
         text: '',
      },
   });

   const {
      control,
      handleSubmit,
      reset,
      formState: { errors, isDirty },
   } = form;

   const [isOpen, { onClose, onOpen }] = useDisclosure();

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
                  <FormField
                     control={control}
                     name="text"
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Content</FormLabel>
                              <FormControl>
                                 <Editor
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.text}
                                 />
                              </FormControl>
                              <FormMessage />
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

export default CreateUpdateQuestionPart67;

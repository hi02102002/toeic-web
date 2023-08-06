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
   FormMessage,
   Input,
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
   name: z.string().nonempty('Name is required'),
});

type FormValues = z.infer<typeof schema>;

export const CreateUpdateDeck = ({
   children,
   onSubmit,
   type = 'create',
   defaultValues,
}: Props) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues || {
         name: '',
      },
   });

   const {
      handleSubmit,
      control,
      formState: { isDirty },
   } = form;

   const [isOpen, { onClose, onOpen }] = useDisclosure(false, {
      close() {
         form.reset({
            name: '',
         });
      },
   });

   return (
      <Dialog
         open={isOpen}
         onOpenChange={(open) => {
            if (open) onOpen();
            else onClose();
         }}
      >
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent className="my-4">
            <Form {...form}>
               <form
                  className="space-y-4"
                  onSubmit={handleSubmit((data) => {
                     onSubmit({
                        values: data,
                        close: onClose,
                     });
                  })}
               >
                  <DialogHeader>
                     <DialogTitle>
                        {type === 'create' ? 'Create' : 'Update'} deck
                     </DialogTitle>
                  </DialogHeader>

                  <FormField
                     name="name"
                     control={control}
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem className="w-full">
                              <FormLabel required>Name</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="Name"
                                    error={!!fieldState.error?.message}
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
                        type="submit"
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

export default CreateUpdateDeck;

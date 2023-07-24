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
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

const schema = zod.object({
   name: zod.string().nonempty('Topic name is required'),
   hasChildren: zod
      .boolean()
      .default(false)
      .transform((value) => {
         if (typeof value === 'string') {
            if (value === 'true') return true;
            else return false;
         }
         return value;
      }),
});

type FormValues = zod.infer<typeof schema>;

type Props = {
   onSubmit: (values: FormValues, close?: () => void) => void;
   defaultValues?: FormValues;
   children: React.ReactNode;
   type?: 'create' | 'update';
   testName?: string;
};

export const CreateUpdateTopic = ({
   defaultValues,
   children,
   type = 'create',
   onSubmit,
}: Props) => {
   const form = useForm<FormValues>({
      defaultValues: {
         name: defaultValues?.name || '',
         hasChildren: defaultValues?.hasChildren || false,
      },
      resolver: zodResolver(schema),
   });

   const { isDirty } = form.formState;

   const [isOpen, { onClose, onOpen }] = useDisclosure(false, {
      close() {
         form.reset({
            name: defaultValues?.name || '',
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
         <DialogContent>
            <Form {...form}>
               <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit((values) => {
                     onSubmit(values, onClose);
                  })}
               >
                  <DialogHeader>
                     <DialogTitle>
                        {type === 'create' ? 'Create' : 'Update'} Topic
                     </DialogTitle>
                  </DialogHeader>
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel required>Topic name</FormLabel>
                           <FormControl>
                              <Input placeholder="Topic name" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="hasChildren"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel required>Have children topic?</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={'false'}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value={'false'}>No</SelectItem>
                                 <SelectItem value={'true'}>Yes</SelectItem>
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
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

export default CreateUpdateTopic;

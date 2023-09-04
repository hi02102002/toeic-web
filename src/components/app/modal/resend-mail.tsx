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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
   children: React.ReactNode;
   title?: string;
   description?: string;
   onSubmit?: ({}: { values: FormValues; onClose?: () => void }) => void;
};

const schema = z.object({
   email: z
      .string()
      .email({
         message: 'Invalid email',
      })
      .nonempty({
         message: 'Email is required',
      }),
});

type FormValues = z.infer<typeof schema>;

export const ResendMail = ({
   children,
   description = 'Re-enter the email address below to resend the confirmation link',
   title = "Didn't get the email?",
   onSubmit,
}: Props) => {
   const form = useForm<FormValues>({
      defaultValues: {
         email: '',
      },
      resolver: zodResolver(schema),
   });
   const [isOpen, { onOpen, onClose }] = useDisclosure(false, {
      close() {
         form.reset({
            email: '',
         });
      },
   });

   useEffect(() => {
      const email = window.localStorage.getItem('email');

      if (email) {
         form.setValue('email', email);
      }
   });

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
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="flex flex-col space-y-3"
                  id="resend-mail-form"
                  onSubmit={form.handleSubmit((values) => {
                     onSubmit?.({ values, onClose });
                  })}
               >
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field, fieldState }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Email</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="Enter your email"
                                    error={!!fieldState.error?.message}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
               </form>
            </Form>
            <DialogFooter>
               <Button
                  variants="outline"
                  sizes="md"
                  type="button"
                  onClick={onClose}
               >
                  Cancel
               </Button>
               <Button
                  variants="primary"
                  sizes="md"
                  type="submit"
                  form="resend-mail-form"
               >
                  Submit
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ResendMail;

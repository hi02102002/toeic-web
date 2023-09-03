import {
   Button,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Input,
} from '@/components/shared';
import { ROUTES } from '@/constants';
import { useRequestResetPassword } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandTether } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
   email: z.string().nonempty('Email is required').email('Invalid email'),
});

type FormValues = z.infer<typeof schema>;

const ForgotPassword = () => {
   const router = useRouter();
   const form = useForm<FormValues>({
      defaultValues: {
         email: '',
      },
      resolver: zodResolver(schema),
   });

   const {
      mutateAsync: handleRequestResetPassword,
      isLoading: isLoadingRequestResetPassword,
   } = useRequestResetPassword();

   const onSubmit = async (values: FormValues) => {
      await handleRequestResetPassword(values.email);
   };

   const { control, handleSubmit } = form;

   return (
      <div className="flex items-center justify-center min-h-screen px-4">
         <div className="w-full max-w-sm">
            <div className="space-y-6">
               <div className="flex flex-col items-center space-y-2 text-center">
                  <IconBrandTether />
                  <h1 className="text-2xl font-semibold">
                     Forgot your password?
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Enter your email to get again your password.
                  </p>
               </div>
               <Form {...form}>
                  <form
                     className="flex flex-col space-y-3"
                     onSubmit={handleSubmit(onSubmit)}
                  >
                     <FormField
                        control={control}
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
                     <Button
                        variants="primary"
                        sizes="md"
                        type="submit"
                        isLoading={isLoadingRequestResetPassword}
                     >
                        Send email reset password
                     </Button>
                     <Button
                        variants="outline"
                        sizes="md"
                        type="button"
                        onClick={() => router.push(ROUTES.LOGIN)}
                        isLoading={isLoadingRequestResetPassword}
                     >
                        Back to login
                     </Button>
                  </form>
               </Form>
            </div>
         </div>
      </div>
   );
};

export default ForgotPassword;

import ResendMail from '@/components/app/modal/resend-mail';
import {
   Button,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Input,
   Link,
   LoadingFullPage,
} from '@/components/shared';
import { ROUTES } from '@/constants';
import { useRequestResetPassword, useResetPassword } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandTether } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

const schema = z
   .object({
      password: z.string().nonempty('Password is required'),
      confirmPassword: z.string().nonempty('Confirm password is required'),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'], // path of error
   });

type FormValues = z.infer<typeof schema>;

const ResetPassword = () => {
   const router = useRouter();
   const form = useForm<FormValues>({
      defaultValues: {
         password: '',
         confirmPassword: '',
      },
      resolver: zodResolver(schema),
   });

   const {
      mutateAsync: handleResetPassword,
      isLoading: isLoadingResetPassword,
   } = useResetPassword();
   const {
      mutateAsync: handleRequestResetPassword,
      isLoading: isLoadingRequestResetPassword,
   } = useRequestResetPassword();

   const onSubmit = async (values: FormValues) => {
      if (!router.query.token) {
         toast.error("Missing token, can't reset password");
         return;
      }

      await handleResetPassword({
         password: values.password,
         token: router.query.token as string,
         confirmPassword: values.confirmPassword,
      });
   };

   const { control, handleSubmit } = form;

   return (
      <div className="flex items-center justify-center min-h-screen px-4">
         <div className="w-full max-w-sm">
            <div className="space-y-6">
               <div className="flex flex-col items-center space-y-2 text-center">
                  <IconBrandTether />
                  <h1 className="text-2xl font-semibold">
                     Reset your password
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Enter your new password to reset your password.
                  </p>
               </div>
               <Form {...form}>
                  <form
                     className="flex flex-col space-y-3"
                     onSubmit={handleSubmit(onSubmit)}
                  >
                     <FormField
                        control={control}
                        name="password"
                        render={({ field, fieldState }) => {
                           return (
                              <FormItem>
                                 <FormLabel required>New password</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       placeholder="Enter your password"
                                       error={!!fieldState.error?.message}
                                       type="password"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           );
                        }}
                     />
                     <FormField
                        control={control}
                        name="confirmPassword"
                        render={({ field, fieldState }) => {
                           return (
                              <FormItem>
                                 <FormLabel required>
                                    Confirm password
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       placeholder="Enter your confirm password"
                                       error={!!fieldState.error?.message}
                                       type="password"
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
                        isLoading={isLoadingResetPassword}
                     >
                        Reset your password
                     </Button>
                     <Button
                        variants="outline"
                        sizes="md"
                        type="button"
                        onClick={() => router.push(ROUTES.LOGIN)}
                        isLoading={isLoadingResetPassword}
                     >
                        Back to login
                     </Button>
                     <ResendMail
                        title="Resend email verification"
                        description="Enter your email below to receive a new reset password link."
                        onSubmit={async ({ values, onClose }) => {
                           await handleRequestResetPassword(values.email);
                           onClose?.();
                        }}
                     >
                        <div>
                           <Link className="text-center w-full">
                              Did&apos;t receive the email? Check your spam
                              filter, or back to request another.
                           </Link>
                        </div>
                     </ResendMail>
                  </form>
               </Form>
            </div>
         </div>
         {isLoadingRequestResetPassword && (
            <LoadingFullPage
               className="backdrop-blur-sm z-[10000] fixed inset-0 bg-transparent"
               classNameLoading="text-primary"
            />
         )}
      </div>
   );
};

export default ResetPassword;

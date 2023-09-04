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
import { useRequestVerifyAccount, useVerifyAccount } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandTether } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
   code: z
      .string()
      .nonempty('Code is required')
      .min(6, 'Code at least 6 digits')
      .max(6, 'Code only 6 digits')
      .regex(/^[0-9]+\d*$/, 'Invalid code'),
});

type FormValues = z.infer<typeof schema>;

const VerifyAccount = () => {
   const router = useRouter();
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
   });

   const { control, handleSubmit } = form;

   const {
      mutate: handleRequestVerifyAccount,
      isLoading: isLoadingRequestVerifyAccount,
   } = useRequestVerifyAccount();

   const {
      mutateAsync: handleVerifyAccount,
      isLoading: isLoadingVerifyAccount,
   } = useVerifyAccount();

   const onSubmit = async (values: FormValues) => {
      const code = Number.parseInt(values.code);
      await handleVerifyAccount(code);
   };

   return (
      <div className="flex items-center justify-center min-h-screen px-4">
         <div className="w-full max-w-sm">
            <div className="space-y-6">
               <div className="flex flex-col items-center space-y-2 text-center">
                  <IconBrandTether />
                  <h1 className="text-2xl font-semibold">
                     Verify your account
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Please enter the 6-digit code we sent to your email
                  </p>
               </div>
               <div className="space-y-3">
                  <Form {...form}>
                     <form
                        className="flex flex-col space-y-3"
                        onSubmit={handleSubmit(onSubmit)}
                        id="verify-account-form"
                     >
                        <FormField
                           control={control}
                           name="code"
                           render={({ field, fieldState }) => {
                              console.log(fieldState);
                              return (
                                 <FormItem>
                                    <FormLabel required>Code</FormLabel>
                                    <FormControl>
                                       <Input
                                          {...field}
                                          placeholder="Enter your code"
                                          error={!!fieldState.error?.message}
                                          maxLength={6}
                                          minLength={6}
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
                           form="verify-account-form"
                           isLoading={isLoadingVerifyAccount}
                        >
                           Submit
                        </Button>
                        <Button
                           variants="outline"
                           sizes="md"
                           type="button"
                           onClick={() => router.push(ROUTES.LOGIN)}
                        >
                           Back to login
                        </Button>
                     </form>
                  </Form>
                  <ResendMail
                     title="Resend email verification"
                     description="Enter your email below to receive a new code to verify your email"
                     onSubmit={async ({ values, onClose }) => {
                        handleRequestVerifyAccount(values.email);
                        onClose?.();
                     }}
                  >
                     <div>
                        <Link className="block text-center">
                           Did&apos;t receive the email? Resend
                        </Link>
                     </div>
                  </ResendMail>
               </div>
            </div>
         </div>
         {isLoadingRequestVerifyAccount && (
            <LoadingFullPage
               className="backdrop-blur-sm z-[10000] fixed inset-0 bg-transparent"
               classNameLoading="text-primary"
            />
         )}
      </div>
   );
};

export default VerifyAccount;

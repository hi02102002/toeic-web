import { Confirm } from '@/components/app';
import {
   SectionSetting,
   SectionSettingBody,
   SectionSettingBottom,
   SectionSettingDescription,
   SectionSettingTextRequired,
   SectionSettingTitle,
} from '@/components/app/settings';
import { SettingsLayout } from '@/components/layouts/settings';
import {
   Avatar,
   Button,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Input,
   LoadingFullPage,
} from '@/components/shared';
import { useUser } from '@/contexts/user.ctx';
import { useChangePassword, useDeleteAccount, useUpdateProfile } from '@/hooks';
import { NextPageWithLayout, Provider, Role } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

type Props = {};

const schemaName = zod.object({
   name: zod
      .string()
      .max(32, 'Name must be at most 32 characters')
      .nonempty("Name can't be empty"),
});

const schemaEmail = zod.object({
   email: zod.string().email('Invalid email').nonempty("Email can't be empty"),
});

const schemaPassword = zod
   .object({
      oldPassword: zod.string().nonempty("Password can't be empty"),
      newPassword: zod
         .string()
         .nonempty("Password can't be empty")
         .min(8, ' Password must be at least 8 characters'),
      confirmPassword: zod
         .string()
         .nonempty("Password can't be empty")
         .min(8, 'Password must be at least 8 characters'),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'], // path of error
   });

type FormName = zod.infer<typeof schemaName>;
type FormEmail = zod.infer<typeof schemaEmail>;
type FormPassword = zod.infer<typeof schemaPassword>;

const Account: NextPageWithLayout<Props> = (props: Props) => {
   const { user } = useUser();
   const formName = useForm<FormName>({
      resolver: zodResolver(schemaName),
      defaultValues: {
         name: user?.name,
      },
   });

   const name = formName.watch('name');

   const formEmail = useForm<FormEmail>({
      resolver: zodResolver(schemaEmail),
      defaultValues: {
         email: user?.email || '',
      },
   });

   const email = formEmail.watch('email');

   const formPassword = useForm<FormPassword>({
      resolver: zodResolver(schemaPassword),
   });

   const { mutateAsync: _handleUpdateName, isLoading: isLoadingUpdateName } =
      useUpdateProfile();

   const {
      mutateAsync: handleChangePassword,
      isLoading: isLoadingUpdatePassword,
   } = useChangePassword();

   const {
      mutateAsync: handleDeleteAccount,
      isLoading: isLoadingDeleteAccount,
   } = useDeleteAccount();

   const handleUpdateName = (data: FormName) => {
      _handleUpdateName({
         name: data.name,
      });
   };

   const handleUpdateEmail = (data: FormEmail) => {};

   const handleUpdatePassword = async (data: FormPassword) => {
      const { oldPassword, newPassword, confirmPassword } = data;
      await handleChangePassword({
         oldPassword,
         newPassword,
         confirmPassword,
      });
      formPassword.reset({
         oldPassword: '',
         newPassword: '',
         confirmPassword: '',
      });
   };

   return (
      <div className="w-full space-y-4">
         <SectionSetting>
            <SectionSettingBody>
               <div className="space-y-2">
                  <SectionSettingTitle title="Your Name" />
                  <SectionSettingDescription description="Please enter your full name, or a display name you are comfortable with." />
                  <Form {...formName}>
                     <form
                        id="form-name"
                        onSubmit={formName.handleSubmit(handleUpdateName)}
                     >
                        <FormField
                           control={formName.control}
                           name="name"
                           render={({ field }) => {
                              return (
                                 <FormItem>
                                    <FormLabel required>Your name</FormLabel>
                                    <FormControl>
                                       <Input
                                          placeholder="Your name"
                                          classNameContainer=" w-72"
                                          {...field}
                                          error={Boolean(
                                             formName.formState.errors.name
                                          )}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              );
                           }}
                        />
                     </form>
                  </Form>
               </div>
            </SectionSettingBody>
            <SectionSettingBottom>
               <SectionSettingTextRequired text="Please use 32 characters at maximum." />
               <Button
                  className="w-full md:w-auto"
                  variants="primary"
                  type="submit"
                  form="form-name"
                  disabled={!formName.formState.isDirty || name === user?.name}
                  isLoading={isLoadingUpdateName}
               >
                  Save
               </Button>
            </SectionSettingBottom>
         </SectionSetting>
         {user?.provider === Provider.LOCAL && (
            <SectionSetting>
               <SectionSettingBody>
                  <div className="space-y-2">
                     <SectionSettingTitle title="Your Email" />
                     <SectionSettingDescription description="Please enter the email address you want to use to log in with Toiec." />
                     <Form {...formEmail}>
                        <form
                           id="form-email"
                           onSubmit={formEmail.handleSubmit(handleUpdateEmail)}
                        >
                           <FormField
                              control={formEmail.control}
                              name="email"
                              render={({ field }) => {
                                 return (
                                    <FormItem>
                                       <FormLabel required>
                                          Your email
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             placeholder="Your email"
                                             classNameContainer=" w-72"
                                             {...field}
                                             error={Boolean(
                                                formEmail.formState.errors.email
                                             )}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 );
                              }}
                           />
                        </form>
                     </Form>
                  </div>
               </SectionSettingBody>
               <SectionSettingBottom>
                  <SectionSettingTextRequired text="We will email you to verify the change." />
                  <Button
                     className="w-full md:w-auto"
                     variants="primary"
                     type="submit"
                     form="form-email"
                     disabled={
                        !formEmail.formState.isDirty || email === user?.email
                     }
                  >
                     Save
                  </Button>
               </SectionSettingBottom>
            </SectionSetting>
         )}

         <SectionSetting>
            <SectionSettingBody>
               <div className="flex justify-between gap-4 md:flex-row flex-col ">
                  <div className="space-y-2">
                     <SectionSettingTitle title="Your Avatar" />
                     <SectionSettingDescription description="Click on the avatar to upload a custom one from your files." />
                  </div>
                  <Avatar
                     url={user?.avatar}
                     className="w-24 h-24"
                     alt={user?.name}
                  />
               </div>
            </SectionSettingBody>
            <SectionSettingBottom>
               <SectionSettingTextRequired text="An avatar is optional but strongly recommended." />
            </SectionSettingBottom>
         </SectionSetting>
         {user?.provider === Provider.LOCAL && (
            <SectionSetting>
               <SectionSettingBody>
                  <div className="flex justify-between gap-4 md:flex-row flex-col ">
                     <div className="space-y-2">
                        <SectionSettingTitle title="Change Password" />
                        <SectionSettingDescription
                           description="
                     Change your password to something you can remember. We recommend using a password manager to generate a strong password."
                        />
                        <Form {...formPassword}>
                           <form
                              className="space-y-4"
                              id="form-password"
                              onSubmit={formPassword.handleSubmit(
                                 handleUpdatePassword
                              )}
                           >
                              <FormField
                                 control={formPassword.control}
                                 name="oldPassword"
                                 render={({ field }) => {
                                    return (
                                       <FormItem>
                                          <FormLabel required>
                                             Old Password
                                          </FormLabel>
                                          <FormControl>
                                             <Input
                                                placeholder="Old Password"
                                                classNameContainer=" w-72"
                                                {...field}
                                                error={Boolean(
                                                   formPassword.formState.errors
                                                      .oldPassword
                                                )}
                                                type="password"
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    );
                                 }}
                              />
                              <FormField
                                 control={formPassword.control}
                                 name="newPassword"
                                 render={({ field }) => {
                                    return (
                                       <FormItem>
                                          <FormLabel required>
                                             New Password{' '}
                                          </FormLabel>
                                          <FormControl>
                                             <Input
                                                placeholder="New Password"
                                                classNameContainer=" w-72"
                                                {...field}
                                                error={Boolean(
                                                   formPassword.formState.errors
                                                      .newPassword
                                                )}
                                                type="password"
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    );
                                 }}
                              />
                              <FormField
                                 control={formPassword.control}
                                 name="confirmPassword"
                                 render={({ field }) => {
                                    return (
                                       <FormItem>
                                          <FormLabel required>
                                             Confirm Password{' '}
                                          </FormLabel>
                                          <FormControl>
                                             <Input
                                                placeholder="Confirm Password"
                                                classNameContainer=" w-72"
                                                {...field}
                                                error={Boolean(
                                                   formPassword.formState.errors
                                                      .confirmPassword
                                                )}
                                                type="password"
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    );
                                 }}
                              />
                           </form>
                        </Form>
                     </div>
                  </div>
               </SectionSettingBody>
               <SectionSettingBottom>
                  <SectionSettingTextRequired text="We recommend using a password manager to generate a strong password." />
                  <Button
                     className="w-full md:w-auto"
                     variants="primary"
                     type="submit"
                     form="form-password"
                     isLoading={isLoadingUpdatePassword}
                  >
                     Save
                  </Button>
               </SectionSettingBottom>
            </SectionSetting>
         )}
         {!user?.roles.includes(Role.ADMIN) && (
            <SectionSetting>
               <SectionSettingBody>
                  <div className="space-y-2">
                     <SectionSettingTitle title="Delete Personal Account" />
                     <SectionSettingDescription description="Permanently remove your Personal Account and all of its contents, result test,... from the Toiec. This action is not reversible, so please continue with caution." />
                  </div>
               </SectionSettingBody>
               <SectionSettingBottom className="justify-end">
                  <Confirm
                     title="Delete Account"
                     description="Are you sure you want to delete your account? This action is not reversible, so please continue with caution."
                     onConfirm={async (close) => {
                        await handleDeleteAccount();
                        close?.();
                     }}
                     textConfirm="Delete Account"
                     type="danger"
                  >
                     <Button className="w-full md:w-auto" variants="danger">
                        Delete Account
                     </Button>
                  </Confirm>
               </SectionSettingBottom>
            </SectionSetting>
         )}
         {isLoadingDeleteAccount && (
            <LoadingFullPage
               className="backdrop-blur-sm z-[10000] fixed inset-0 bg-transparent"
               classNameLoading="text-primary"
            />
         )}
      </div>
   );
};

Account.getLayout = (page) => {
   return <SettingsLayout>{page}</SettingsLayout>;
};

export const getServerSideProps = withRoute({ isProtected: true })();

export default Account;

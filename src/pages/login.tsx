import {
   Button,
   Input,
   InputLabel,
   InputMessage,
   InputWrapper,
   Link,
} from '@/components/shared';
import { ROUTES } from '@/constants';
import { auth } from '@/libs/firebase';
import { TBaseResponse, TUser } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { zodResolver } from '@hookform/resolvers/zod';
import {
   IconBrandFacebook,
   IconBrandGoogle,
   IconBrandTether,
   IconChevronLeft,
} from '@tabler/icons-react';
import axios from 'axios';
import {
   AuthProvider,
   FacebookAuthProvider,
   GoogleAuthProvider,
   signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

const schema = z.object({
   email: z.string().nonempty('Email is required').email('Invalid email'),
   password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password at least 8 character.'),
});

type FormValues = z.infer<typeof schema>;

type Props = {};

const Login = (props: Props) => {
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormValues>({
      defaultValues: {
         email: '',
         password: '',
      },
      resolver: zodResolver(schema),
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const handelLogin = async (values: FormValues) => {
      try {
         setIsLoading(true);

         const {
            data,
            message,
         }: TBaseResponse<{
            accessToken: string;
            refreshToken: string;
         }> = await axios
            .post('/api/login', values, {
               withCredentials: true,
            })
            .then((r) => r.data);
         toast.success(message);
         setIsLoading(false);
         router.push('/');
      } catch (error: any) {
         toast.error(
            error?.response?.data?.message ||
               'Something went wrong. Please try again.'
         );
         setIsLoading(false);
      }
   };

   const handleLoginWithSocial = async (authProvider: AuthProvider) => {
      try {
         setIsLoading(true);

         const res = await signInWithPopup(auth, authProvider);

         const dto: Pick<TUser, 'avatar' | 'email' | 'name' | 'provider'> = {
            avatar: res.user?.photoURL || '',
            email: res.user?.email,
            name: res.user?.displayName || '',
            provider: res?.providerId || 'local',
         };

         const {
            data,
            message,
         }: TBaseResponse<{
            accessToken: string;
            refreshToken: string;
         }> = await axios
            .post('/api/login-social', dto, {
               withCredentials: true,
            })
            .then((r) => r.data);
         toast.success(message);
         setIsLoading(false);
         router.push(ROUTES.HOME);
      } catch (error: any) {
         toast.error(
            error?.response?.data?.message ||
               'Something went wrong. Please try again.'
         );
         await auth.signOut().then(() => {
            console.log('logout');
         });
         setIsLoading(false);
      }
   };

   return (
      <div className="relative flex items-center justify-center min-h-screen px-4">
         <Button
            leftIcon={<IconChevronLeft />}
            className="absolute top-4 left-4"
            variants="transparent"
            onClick={() => {
               router.push(ROUTES.HOME);
            }}
         >
            Back
         </Button>
         <div className="w-full max-w-sm">
            <div className="space-y-6">
               <div className="flex flex-col items-center space-y-2 text-center">
                  <IconBrandTether />
                  <h1 className="text-2xl font-semibold">Welcome back</h1>
                  <p className="text-sm text-muted-foreground">
                     Enter your email and password to sign in to your account.
                  </p>
               </div>
               <div className="flex flex-col space-y-6">
                  <form
                     className="flex flex-col space-y-3"
                     onSubmit={handleSubmit(handelLogin)}
                  >
                     <InputWrapper>
                        <InputLabel required>Email</InputLabel>
                        <Input
                           placeholder="Your email"
                           {...register('email')}
                           error={!!errors.email?.message}
                        />
                        {errors.email?.message && (
                           <InputMessage className="text-red-500">
                              {errors.email?.message}
                           </InputMessage>
                        )}
                     </InputWrapper>
                     <InputWrapper>
                        <InputLabel required>Password</InputLabel>
                        <Input
                           placeholder="Your password"
                           type="password"
                           {...register('password')}
                           error={!!errors.password?.message}
                        />
                        {errors.password?.message && (
                           <InputMessage className="text-red-500">
                              {errors.password?.message}
                           </InputMessage>
                        )}
                     </InputWrapper>
                     <Link
                        href={ROUTES.FORGOT_PASSWORD}
                        className="self-end text-sm"
                     >
                        Forgot your password?
                     </Link>
                     <Button
                        variants="primary"
                        className="w-full"
                        sizes="md"
                        type="submit"
                        isLoading={isLoading}
                     >
                        Login with Email
                     </Button>
                  </form>
                  <div className="relative flex items-center justify-center">
                     <div className="absolute inset-0 flex items-center justify-center w-full z-[1] ">
                        <div className="h-[1px] bg-slate-200 w-full"></div>
                     </div>
                     <span className="text-sm bg-white text-muted-foreground z-[2] px-1">
                        OR CONTINUE WITH
                     </span>
                  </div>
                  <div className="space-y-3">
                     <Button
                        leftIcon={<IconBrandGoogle className="w-5 h-5" />}
                        variants="outline"
                        className="w-full"
                        sizes="md"
                        onClick={() =>
                           handleLoginWithSocial(new GoogleAuthProvider())
                        }
                        isLoading={isLoading}
                     >
                        Continue with Google
                     </Button>
                     <Button
                        leftIcon={<IconBrandFacebook className="w-5 h-5" />}
                        variants="outline"
                        className="w-full"
                        sizes="md"
                        onClick={() =>
                           handleLoginWithSocial(new FacebookAuthProvider())
                        }
                        isLoading={isLoading}
                     >
                        Continue with Facebook
                     </Button>
                  </div>
                  <Link href={ROUTES.REGISTER} className="text-sm text-center">
                     Don&lsquo;t have an account? Register
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export const getServerSideProps = withRoute({
   isProtected: false,
})();

export default Login;

import {
   Button,
   Input,
   InputLabel,
   InputMessage,
   InputWrapper,
   Link,
} from '@/components/shared';
import { BASE_URL, ROUTES } from '@/constants';
import { withRoute } from '@/utils/withRoute';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandTether } from '@tabler/icons-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

const schema = z
   .object({
      email: z.string().nonempty('Email is required').email('Invalid email'),
      password: z
         .string()
         .nonempty('Password is required')
         .min(8, 'Password at least 8 character.'),
      confirmPassword: z.string().nonempty('Confirm password is required'),
      name: z.string().nonempty('Name is required'),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'], // path of error
   });

type FormValues = z.infer<typeof schema>;

const Register = () => {
   const {
      register,
      formState: { errors },
      handleSubmit,
   } = useForm<FormValues>({
      defaultValues: {
         email: '',
         password: '',
         confirmPassword: '',
         name: '',
      },
      resolver: zodResolver(schema),
   });

   const [isLoading, setIsLoading] = useState<boolean>(false);
   const router = useRouter();

   const handelRegister = async (values: FormValues) => {
      try {
         setIsLoading(true);
         await axios.post(`${BASE_URL}/auth/register`, values);
         toast.success('Register success');
         setIsLoading(false);
         router.push(ROUTES.LOGIN);
      } catch (error: any) {
         toast.error(error?.response?.data?.message || 'Something went wrong');
         setIsLoading(false);
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen p-4">
         <div className="w-full max-w-sm">
            <div className="space-y-6">
               <div className="flex flex-col items-center space-y-2 text-center">
                  <IconBrandTether />
                  <h1 className="text-2xl font-semibold">Create an account</h1>
                  <p className="text-sm text-muted-foreground">
                     Enter your information below to create your account.
                  </p>
               </div>
               <div className="flex flex-col space-y-6">
                  <form
                     className="flex flex-col space-y-3"
                     onSubmit={handleSubmit(handelRegister)}
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
                        <InputLabel required>Full name</InputLabel>
                        <Input
                           placeholder="Your name"
                           {...register('name')}
                           error={!!errors.name?.message}
                        />
                        {errors.name?.message && (
                           <InputMessage className="text-red-500">
                              {errors.name?.message}
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
                     <InputWrapper>
                        <InputLabel required>Confirm password</InputLabel>
                        <Input
                           placeholder="Confirm password"
                           type="password"
                           {...register('confirmPassword')}
                           error={!!errors.confirmPassword?.message}
                        />
                        {errors.confirmPassword?.message && (
                           <InputMessage className="text-red-500">
                              {errors.confirmPassword?.message}
                           </InputMessage>
                        )}
                     </InputWrapper>
                     <Button
                        variants="primary"
                        className="w-full"
                        sizes="md"
                        isLoading={isLoading}
                     >
                        Create your account
                     </Button>
                  </form>
                  <Link href={ROUTES.LOGIN} className="text-sm text-center">
                     Already have an account? Login
                  </Link>
                  <p className="text-sm text-center text-muted-foreground">
                     By clicking continue, you agree to our Terms of Service and
                     Privacy Policy.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export const getServerSideProps = withRoute({
   isProtected: false,
})();

export default Register;

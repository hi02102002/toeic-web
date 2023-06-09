import {
   Button,
   Input,
   InputLabel,
   InputWrapper,
   Link,
} from '@/components/shared';
import { IconBrandTether } from '@tabler/icons-react';

type Props = {};

const Register = (props: Props) => {
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
                  <form className="flex flex-col space-y-3">
                     <InputWrapper>
                        <InputLabel required>Email</InputLabel>
                        <Input placeholder="Your email" />
                     </InputWrapper>
                     <InputWrapper>
                        <InputLabel required>Full name</InputLabel>
                        <Input placeholder="Your name" />
                     </InputWrapper>
                     <InputWrapper>
                        <InputLabel required>Password</InputLabel>
                        <Input placeholder="Your password" type="password" />
                     </InputWrapper>
                     <InputWrapper>
                        <InputLabel required>Confirm password</InputLabel>
                        <Input placeholder="Confirm password" type="password" />
                     </InputWrapper>
                     <Button
                        variants="primary"
                        className="w-full"
                        sizes="md"
                        type="button"
                     >
                        Create your account
                     </Button>
                  </form>
                  <Link href="/" className="text-sm text-center">
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

export default Register;

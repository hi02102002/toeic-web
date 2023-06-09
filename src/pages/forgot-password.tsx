import { Button, Input, InputLabel, InputWrapper } from '@/components/shared';
import { IconBrandTether } from '@tabler/icons-react';

type Props = {};

const Login = (props: Props) => {
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
               <form className="flex flex-col space-y-3">
                  <InputWrapper>
                     <InputLabel required>Email</InputLabel>
                     <Input placeholder="Your email" />
                  </InputWrapper>
                  <Button variants="primary" sizes="md">
                     Send email reset password
                  </Button>
                  <Button variants="outline" sizes="md" type="button">
                     Back to login
                  </Button>
               </form>
            </div>
         </div>
      </div>
   );
};

export default Login;

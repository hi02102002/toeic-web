import { Button } from '@/components/shared';
import Link from 'next/link';

const NotFound = () => {
   return (
      <div className="flex items-center justify-center p-4 flex-col min-h-screen">
         <h1 className="text-4xl font-bold">404</h1>
         <span className="mt-2 text-2xl font-semibold">Page not found</span>
         <p className="mt-2">The page you are looking for does not exist.</p>
         <Link href="/">
            <Button className="mt-4" variants="primary">
               Go back home
            </Button>
         </Link>
      </div>
   );
};

export default NotFound;

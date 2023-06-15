import { Button } from '@/components/shared';
import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { cn } from '@/utils';
import { IconArrowUpRight, IconBrandTether } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Header = () => {
   const { user } = useUser();
   const router = useRouter();

   const [scrollY, setScrollY] = useState<number>(0);

   useEffect(() => {
      const handleScroll = () => {
         setScrollY(window.scrollY);
      };

      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <header
         className={cn(
            'h-header flex items-center fixed top-0 left-0 right-0 border-b border-transparent transition-all',
            {
               'backdrop-blur-sm border-b border-border': scrollY > 300,
            }
         )}
      >
         <div className="container w-full flex items-center justify-between">
            <Link
               href={ROUTES.HOME}
               className="inline-flex items-center gap-2 "
            >
               <IconBrandTether className="w-6 h-6" />
               <span className="text-xl font-semibold">Toiec</span>
            </Link>
            <div>
               {user ? (
                  <Link href="/dashboard" className="flex items-center gap-2">
                     Dashboard
                     <IconArrowUpRight className="w-4 h-4 " />
                  </Link>
               ) : (
                  <Button
                     sizes="sm"
                     className="min-w-[100px]"
                     variants="primary"
                     onClick={() => router.push(ROUTES.LOGIN)}
                  >
                     Login
                  </Button>
               )}
            </div>
         </div>
      </header>
   );
};

export default Header;

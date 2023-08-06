import {
   Avatar,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuPortal,
   DropdownMenuTrigger,
   LoadingFullPage,
} from '@/components/shared';
import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { useElSize } from '@/hooks';
import { useLogout } from '@/hooks/use-logout';
import { Role } from '@/types';
import { cn } from '@/utils';
import {
   IconAdjustments,
   IconBrandTether,
   IconLayoutKanban,
   IconLogout,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
   {
      label: 'Dashboard',
      href: ROUTES.DASHBOARD,
   },
   {
      label: 'Toiec Tests',
      href: ROUTES.TOIEC_TEST,
   },
   {
      label: 'Topics',
      href: ROUTES.TOPICS,
   },
   {
      label: 'Flashcards',
      href: ROUTES.FLASHCARDS,
   },
   {
      label: 'Grammars',
      href: ROUTES.GRAMMAR,
   },
   {
      label: 'Blogs',
      href: ROUTES.BLOGS,
   },
];

const AppHeader = () => {
   const { user } = useUser();
   const router = useRouter();

   const [scrollY, setScrollY] = useState<number>(0);

   const { ref: sectionUserRef, size } = useElSize<HTMLDivElement>();

   const { mutateAsync: handleLogout, isLoading: isLoadingLogout } =
      useLogout();

   const handleNavigate = (href: string) => {
      router.push(href);
   };

   useEffect(() => {
      const handleScroll = () => {
         setScrollY(window.scrollY);
      };

      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <>
         <header
            className={cn(
               'flex items-center sticky top-0 left-0 right-0 border-b border-transparent transition-all bg-white z-50',
               {
                  'border-b border-border': scrollY > 100,
               }
            )}
            id="app-header"
         >
            <div className="container w-full">
               <div className="flex items-center justify-between h-header">
                  <Link
                     href={ROUTES.HOME}
                     className="inline-flex items-center gap-2 "
                  >
                     <IconBrandTether className="w-6 h-6" />
                     <span className="text-xl font-semibold">Toiec</span>
                  </Link>
                  {user && (
                     <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                           <div
                              className="flex items-center gap-2 p-1 rounded cursor-pointer select-none hover:bg-accent"
                              ref={sectionUserRef}
                           >
                              <Avatar
                                 url={user.avatar as string}
                                 alt={user.name}
                                 sizes="sm"
                                 className="bg-gray-50"
                              />
                              <div className="flex-col items-start block sm:flex ">
                                 <span className="text-sm font-semibold">
                                    {user.name}
                                 </span>
                                 <span className="text-xs text-muted-foreground line-clamp-1 ">
                                    {user.email}
                                 </span>
                              </div>
                           </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                           <DropdownMenuContent
                              style={{
                                 width: size.width,
                              }}
                           >
                              <div className="flex flex-col items-start py-1.5 px-2">
                                 <span className="text-sm font-semibold">
                                    {user.name}
                                 </span>
                                 <span className="text-xs text-muted-foreground line-clamp-1 ">
                                    {user.email}
                                 </span>
                              </div>
                              {user.roles.some((r) => r === Role.ADMIN) && (
                                 <DropdownMenuItem
                                    className="font-medium"
                                    onClick={() => handleNavigate(ROUTES.ADMIN)}
                                 >
                                    <IconLayoutKanban className="w-4 h-4 mr-2" />
                                    Admin
                                 </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                 className="font-medium"
                                 onClick={() => handleNavigate(ROUTES.SETTINGS)}
                              >
                                 <IconAdjustments className="w-4 h-4 mr-2" />
                                 Setting
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 className="font-medium"
                                 onClick={() => handleLogout()}
                              >
                                 <IconLogout className="w-4 h-4 mr-2" />
                                 Logout
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenuPortal>
                     </DropdownMenu>
                  )}
               </div>
               <nav className="h-12">
                  <ul className="flex items-center gap-2">
                     {NAV_LINKS.map((link) => {
                        const isActive = router.pathname.includes(link.href);

                        return (
                           <li key={link.href}>
                              <Link href={link.href}>
                                 <span
                                    className={cn(
                                       'py-2 relative inline-block font-medium',
                                       'after:content-[" "] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-primary after:w-full after:opacity-0 after:transition-all after:duration-300 after:ease-in-out',
                                       'hover:after:opacity-100',
                                       {
                                          'after:opacity-100': isActive,
                                       }
                                    )}
                                 >
                                    {link.label}
                                 </span>
                              </Link>
                           </li>
                        );
                     })}
                  </ul>
               </nav>
            </div>
         </header>
         {isLoadingLogout && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0"
               classNameLoading="text-primary"
            />
         )}
      </>
   );
};

export default AppHeader;

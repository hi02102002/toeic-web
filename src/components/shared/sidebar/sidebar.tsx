import {
   Avatar,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuPortal,
   DropdownMenuTrigger,
   LoadingFullPage,
   Sheet,
   SheetContent,
   SheetTrigger,
} from '@/components/shared';
import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { useDisclosure, useElSize } from '@/hooks';
import { useLogout } from '@/hooks/use-logout';
import { Role, TNavLink } from '@/types';
import { cn } from '@/utils';
import {
   IconAdjustments,
   IconArrowBack,
   IconLayoutKanban,
   IconLogout,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
   navLinks: Array<TNavLink>;
   children: React.ReactNode;
};

export const Sidebar = ({ children, navLinks }: Props) => {
   const router = useRouter();
   const { user } = useUser();
   const routerAdmin = router.pathname.includes('admin');
   const [isOpen, { onOpen: handleOpen, onClose: handleClose }] =
      useDisclosure();

   const { ref: sectionUserRef, size } = useElSize<HTMLDivElement>();
   const { mutateAsync: handleLogout, isLoading: isLoadingLogout } =
      useLogout();

   const handleNavigate = (href: string) => {
      router.push(href);
      handleClose();
   };

   const isAdmin = user?.roles.includes(Role.ADMIN);

   return (
      <>
         <Sheet
            open={isOpen}
            onOpenChange={(open) => {
               if (open) {
                  handleOpen();
               } else {
                  handleClose();
               }
            }}
         >
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent className="flex flex-col justify-between bg-bg">
               <ul className="flex flex-col items-center gap-2 py-4">
                  {navLinks.map((link) => {
                     const isActive = router.pathname === link.href;

                     return (
                        <li key={link.href} onClick={handleClose}>
                           <Link href={link.href}>
                              <span
                                 className={cn(
                                    'py-2 relative inline-block',
                                    'after:content-[" "] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-primary after:w-full after:opacity-0 after:transition-all after:duration-300 after:ease-in-out',
                                    'hover:after:opacity-100 font-medium',
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
               <div>
                  {user && (
                     <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none" asChild>
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
                              <div className="flex-col items-start">
                                 <span className="text-sm font-semibold">
                                    {user.name} {isAdmin && `(${user.roles})`}
                                 </span>
                                 <span className="text-xs text-muted-foreground line-clamp-1 ">
                                    {user.email}
                                 </span>
                              </div>
                           </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                           <DropdownMenuContent
                              align="end"
                              style={{
                                 width: size?.width || '100%',
                              }}
                           >
                              <div className="flex flex-col items-start py-1.5 px-2">
                                 <span className="text-sm font-semibold">
                                    {user.name} ({user.roles})
                                 </span>
                                 <span className="text-xs text-muted-foreground line-clamp-1 ">
                                    {user.email}
                                 </span>
                              </div>
                              {isAdmin && !routerAdmin && (
                                 <DropdownMenuItem
                                    className="font-medium"
                                    onClick={() => {
                                       handleNavigate(ROUTES.ADMIN);
                                    }}
                                 >
                                    <IconLayoutKanban className="w-4 h-4 mr-2" />
                                    Admin
                                 </DropdownMenuItem>
                              )}
                              {isAdmin && routerAdmin && (
                                 <DropdownMenuItem
                                    className="font-medium"
                                    onClick={() =>
                                       handleNavigate(ROUTES.DASHBOARD)
                                    }
                                 >
                                    <IconArrowBack className="w-4 h-4 mr-2" />
                                    Back to site
                                 </DropdownMenuItem>
                              )}

                              {!routerAdmin && (
                                 <DropdownMenuItem
                                    className="font-medium"
                                    onClick={() =>
                                       handleNavigate(ROUTES.SETTINGS)
                                    }
                                 >
                                    <IconAdjustments className="w-4 h-4 mr-2" />
                                    Setting
                                 </DropdownMenuItem>
                              )}

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
            </SheetContent>
         </Sheet>
         {isLoadingLogout && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0"
               classNameLoading="text-primary"
            />
         )}
      </>
   );
};

export default Sidebar;

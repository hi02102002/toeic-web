import { useWindowSize } from '@/hooks';
import { cn } from '@/utils';
import {
   IconAB2,
   IconLayoutDashboard,
   IconLogout,
   IconNotebook,
   IconUsersGroup,
   IconVocabulary,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../../shared';

const LIST_ITEMS: Array<{
   name: string;
   icon: React.ReactNode;
   path: string;
}> = [
   {
      name: 'Dashboard',
      icon: <IconLayoutDashboard />,
      path: '/admin',
   },
   {
      name: 'Users',
      icon: <IconUsersGroup />,
      path: '/admin/users',
   },
   {
      name: 'Tests',
      icon: <IconAB2 />,
      path: '/admin/tests',
   },
   {
      name: 'Grammars',
      icon: <IconNotebook />,
      path: '/admin/grammars',
   },
   {
      name: 'Vocabularies',
      icon: <IconVocabulary />,
      path: '/admin/vocabularies',
   },
];

type Props = {
   className?: string;
   onClose?: () => void;
   isOpen?: boolean;
};

export const AdminSidebar = ({ className, onClose, isOpen }: Props) => {
   const router = useRouter();
   const { width } = useWindowSize();

   const isMobile = width < 768;

   console.log(isMobile && !isOpen);

   return (
      <>
         <div
            className={cn('inset-0 fixed bg-black/50', {
               'opacity-0 pointer-events-none invisible': !(isOpen && isMobile),
               'opacity-100 pointer-events-auto visible': isOpen && isMobile,
            })}
            onClick={onClose}
         ></div>
         <aside
            className={cn(
               'min-h-screen px-4 border-r w-sidebar border-border fixed left-0 top-0 bottom-0 translate-x-[-100%] md:translate-x-0 transition-transform bg-bg',
               className
            )}
         >
            <div className="flex items-center justify-center h-header">
               <Link href="/admin">
                  <span className="text-2xl font-extrabold text-primary">
                     Admin
                  </span>
               </Link>
            </div>
            <ul className="py-4 space-y-1">
               {LIST_ITEMS.map((el) => {
                  const isActive = router.pathname === el.path;
                  return (
                     <li key={el.name}>
                        <Link href={el.path} className="block">
                           <Button
                              variants={isActive ? 'primary' : 'default'}
                              leftIcon={el.icon}
                              className={cn('w-full justify-start', {
                                 'hover:bg-primary hover:text-primary-foreground ':
                                    !isActive,
                              })}
                           >
                              <span>{el.name}</span>
                           </Button>
                        </Link>
                     </li>
                  );
               })}
               <li>
                  <Button
                     variants="default"
                     leftIcon={<IconLogout />}
                     className={cn(
                        'w-full justify-start hover:bg-primary hover:text-primary-foreground'
                     )}
                  >
                     <span>Back to website</span>
                  </Button>
               </li>
            </ul>
         </aside>
      </>
   );
};

export default AdminSidebar;

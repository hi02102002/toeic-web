import { cn } from '@/utils';
import {
   IconAB2,
   IconLayoutDashboard,
   IconNotebook,
   IconUsersGroup,
   IconVocabulary,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../shared';

type Props = {};

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

export const AdminSidebar = (props: Props) => {
   const router = useRouter();

   return (
      <aside className="min-h-screen px-4 border-r w-sidebar border-border">
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
         </ul>
      </aside>
   );
};

export default AdminSidebar;

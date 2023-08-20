import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { Role } from '@/types';
import { cn } from '@/utils';
import {
   IconBrandPaypal,
   IconFileSettings,
   IconUser,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV_ITEMS = [
   {
      name: 'Account',
      href: ROUTES.SETTINGS,
      icon: IconUser,
      roles: [Role.ADMIN, Role.USER],
   },
   {
      name: 'Payment',
      href: ROUTES.SETTINGS_PAYMENT,
      icon: IconBrandPaypal,
      roles: [Role.USER],
   },
   {
      name: 'Learning',
      href: ROUTES.SETTINGS_LEARNING,
      icon: IconFileSettings,
      roles: [Role.ADMIN, Role.USER],
   },
];

const Sidebar = () => {
   const { user } = useUser();
   const router = useRouter();
   return (
      <aside className=" md:w-56 ">
         <ul>
            {NAV_ITEMS.map((item, index) => {
               if (
                  user &&
                  !item.roles.some((role) => user.roles.includes(role))
               ) {
                  return null;
               }

               const Icon = item.icon;
               const isActive = router.pathname === item.href;

               return (
                  <li key={index} title={item.name}>
                     <Link
                        href={item.href}
                        className={cn(
                           'flex items-center gap-2 p-2 font-medium rounded hover:bg-primary-foreground',
                           {
                              'bg-primary-foreground': isActive,
                           }
                        )}
                     >
                        <Icon />
                        <span className="md:block hidden">{item.name}</span>
                     </Link>
                  </li>
               );
            })}
         </ul>
      </aside>
   );
};

export default Sidebar;

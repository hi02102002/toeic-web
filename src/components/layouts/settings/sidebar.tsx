import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { Role } from '@/types';
import {
   IconBrandPaypal,
   IconFileSettings,
   IconSquareAsterisk,
   IconUser,
} from '@tabler/icons-react';
import Link from 'next/link';

const NAV_ITEMS = [
   {
      name: 'Account',
      href: ROUTES.SETTINGS_ACCOUNT,
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
      name: 'Change Password',
      href: ROUTES.SETTINGS_PASSWORD,
      icon: IconSquareAsterisk,
      roles: [Role.ADMIN, Role.USER],
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
   return (
      <aside className="sticky left-0 w-56 ">
         <ul>
            {NAV_ITEMS.map((item, index) => {
               if (
                  user &&
                  !item.roles.some((role) => user.roles.includes(role))
               ) {
                  return null;
               }

               const Icon = item.icon;

               return (
                  <li key={index}>
                     <Link
                        href={item.href}
                        className="flex items-center gap-2 p-2 font-medium rounded hover:bg-primary-foreground"
                     >
                        <Icon />
                        <span>{item.name}</span>
                     </Link>
                  </li>
               );
            })}
         </ul>
      </aside>
   );
};

export default Sidebar;

import { Header } from '@/components/shared';
import { ROUTES } from '@/constants';
import { TNavLink } from '@/types';

type Props = {
   children: React.ReactNode;
};

const NAV_LINKS: Array<TNavLink> = [
   {
      label: 'Dashboard',
      href: ROUTES.ADMIN,
   },
   {
      label: 'Users',
      href: ROUTES.ADMIN_USERS,
   },
   {
      label: 'Toiec Tests',
      href: ROUTES.ADMIN_TOIEC_TESTS,
   },
   {
      label: 'Topics',
      href: ROUTES.ADMINT_TOPICS,
   },
   {
      label: 'Grammars',
      href: ROUTES.ADMIN_GRAMMARS,
   },
];

export const AdminLayout = ({ children }: Props) => {
   return (
      <div>
         <Header navLinks={NAV_LINKS} />
         <div className="container">{children}</div>
      </div>
   );
};

export default AdminLayout;

import { useWindowSize } from '@/hooks';
import AdminHeader from './admin-header';

type Props = {
   children: React.ReactNode;
};

export const AdminLayout = ({ children }: Props) => {
   const { width } = useWindowSize();

   return (
      <div>
         <AdminHeader />
         <div className="container">{children}</div>
      </div>
   );
};

export default AdminLayout;

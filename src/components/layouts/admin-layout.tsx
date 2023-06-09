import AdminHeader from './admin-header';
import AdminSidebar from './admin-sidebar';

type Props = {};

const AdminLayout = (props: Props) => {
   return (
      <div>
         <AdminHeader />
         <AdminSidebar />
      </div>
   );
};

export default AdminLayout;

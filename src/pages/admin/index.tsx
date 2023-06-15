import { AdminLayout } from '@/components/layouts/admin';
import { NextPageWithLayout } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {};

const Admin: NextPageWithLayout = (props: Props) => {
   return <div></div>;
};

Admin.getLayout = (page) => {
   return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})();

export default Admin;

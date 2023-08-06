import { AppLayout } from '@/components/layouts/app';
import { NextPageWithLayout } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {};

const Dashboard: NextPageWithLayout = (props: Props) => {
   return <div>Dashboard</div>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
})();

Dashboard.getLayout = (page) => {
   return (
      <AppLayout title="Toiec | Dashboard" description="Dashboard">
         {page}
      </AppLayout>
   );
};

export default Dashboard;

import { AppLayout } from '@/components/layouts/app';
import { NextPageWithLayout } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {};

const Grammars: NextPageWithLayout<Props> = (props) => {
   return (
      <div className="container py-4">
         <h3 className="text-lg font-semibold">Grammars</h3>
      </div>
   );
};

Grammars.getLayout = (page) => {
   return (
      <AppLayout
         title="Grammars"
         description="This page helps you to learn grammar. You can learn grammar by topic. "
      >
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({ isProtected: true })();

export default Grammars;

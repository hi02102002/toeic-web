import { AppLayout } from '@/components/layouts/app';
import { useTests } from '@/hooks';
import { NextPageWithLayout } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {};

const ToiecTests: NextPageWithLayout = (props: Props) => {
   const { data } = useTests();

   console.log(data);

   return <div></div>;
};

ToiecTests.getLayout = (page) => {
   return <AppLayout>{page}</AppLayout>;
};
export const getServerSideProps = withRoute({
   isProtected: true,
})();

export default ToiecTests;

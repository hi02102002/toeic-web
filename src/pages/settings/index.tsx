import { SettingsLayout } from '@/components/layouts/settings';
import { NextPageWithLayout } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {};

const Setting: NextPageWithLayout = (props: Props) => {
   return <div className="py-4 ">Setting</div>;
};

Setting.getLayout = (page) => {
   return <SettingsLayout>{page}</SettingsLayout>;
};

export default Setting;

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: false,
})();

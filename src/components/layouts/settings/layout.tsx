import { AppLayout } from '../app';
import Sidebar from './sidebar';

type Props = {
   children: React.ReactNode;
};

const SettingsLayout = ({ children }: Props) => {
   return (
      <AppLayout
         title="Settings"
         description="Manage your account settings and set email preferences."
      >
         <div className="container flex gap-4 py-4">
            <div>
               <Sidebar />
            </div>
            <div className="h-[100000px]">{children}</div>
         </div>
      </AppLayout>
   );
};

export default SettingsLayout;

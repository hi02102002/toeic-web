import { Avatar } from '../shared';

type Props = {};

const AdminHeader = (props: Props) => {
   return (
      <header className="fixed top-0 right-0 flex items-center border-b h-header left-sidebar border-border">
         <div className="flex w-full px-4">
            <div className="ml-auto">
               <div className="flex items-center gap-2">
                  <Avatar alt="Hoang Huy" />
                  <div className="flex flex-col ">
                     <span className="font-semibold">Hoang Huy</span>
                     <span className="text-sm">Admin</span>
                  </div>
               </div>
            </div>
         </div>
      </header>
   );
};

export default AdminHeader;

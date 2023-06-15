import AppHeader from './header';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <>
         <AppHeader />
         {children}
      </>
   );
};

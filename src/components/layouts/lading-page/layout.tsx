import Header from './header';

export const LadingPageLayout = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   return (
      <>
         <Header />
         {children}
      </>
   );
};

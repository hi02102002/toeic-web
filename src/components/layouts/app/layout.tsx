import { NextSeo } from 'next-seo';
import AppHeader from './header';

type Props = {
   children: React.ReactNode;
   title: string;
   description: string;
};

export const AppLayout = ({ children, description, title }: Props) => {
   return (
      <>
         <NextSeo title={title} description={description} />
         <AppHeader />
         {children}
      </>
   );
};

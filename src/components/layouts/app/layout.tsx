import { Header } from '@/components/shared';
import { ROUTES } from '@/constants';
import { TNavLink } from '@/types';
import { NextSeo } from 'next-seo';
const NAV_LINKS: Array<TNavLink> = [
   {
      label: 'Dashboard',
      href: ROUTES.DASHBOARD,
   },
   {
      label: 'Toiec Tests',
      href: ROUTES.TOIEC_TEST,
   },
   {
      label: 'Topics',
      href: ROUTES.TOPICS,
   },
   {
      label: 'Flashcards',
      href: ROUTES.FLASHCARDS,
   },
   {
      label: 'Grammars',
      href: ROUTES.GRAMMARS,
   },
   {
      label: 'Blogs',
      href: ROUTES.BLOGS,
   },
];
type Props = {
   children: React.ReactNode;
   title: string;
   description: string;
};

export const AppLayout = ({ children, description, title }: Props) => {
   return (
      <>
         <NextSeo title={title} description={description} />
         <Header navLinks={NAV_LINKS} />
         {children}
      </>
   );
};

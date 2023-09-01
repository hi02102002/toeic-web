import { LadingPageLayout } from '@/components/layouts/lading-page';
import { Button } from '@/components/shared';
import { useUser } from '@/contexts/user.ctx';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TBaseResponse, TDeck } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

const Home: NextPageWithLayout = () => {
   const { user } = useUser();
   const router = useRouter();

   return (
      <section className="flex items-center justify-center min-h-screen">
         <div className="container">
            <div className="flex flex-col items-center max-w-5xl gap-3 py-8 mx-auto lg:py-32 md:py-12 ">
               <h1 className="text-3xl font-bold text-center sm:text-5xl md:text-6xl lg:text-7xl">
                  An amazing website for{' '}
                  <span className="text-blue-500">TOEIC</span> test-takers
               </h1>
               <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-center mx-auto">
                  Unlock Your TOEIC Success: Master the Language, Conquer the
                  Test!
               </p>
               <Button
                  onClick={() => {
                     router.push(user ? '/dashboard' : '/login');
                  }}
                  className="w-36"
                  variants="primary"
               >
                  Get started
               </Button>
            </div>
         </div>
      </section>
   );
};

Home.getLayout = (page) => <LadingPageLayout>{page}</LadingPageLayout>;

export const getServerSideProps = withRoute({
   isProtected: false,
})();

export default Home;

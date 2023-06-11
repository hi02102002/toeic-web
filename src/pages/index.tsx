import { Button } from '@/components/shared';
import { http } from '@/libs/axios';
import { withRoute } from '@/utils/withRoute';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
   const handelMe = async () => {
      const res = await http.get('/auth/me');

      console.log(res);
   };

   return (
      <Button variants="primary" onClick={handelMe}>
         Button
      </Button>
   );
}

export const getServerSideProps = withRoute({
   isProtected: true,
})();

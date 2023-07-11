import { AppLayout } from '@/components/layouts/app';
import { http_server } from '@/libs/axios';
import { NextPageWithLayout, TBaseResponse, TTestUser } from '@/types';
import { withRoute } from '@/utils/withRoute';

type Props = {
   result: TTestUser;
};

const Result: NextPageWithLayout<Props> = ({ result }) => {
   console.log(result);
   return (
      <div className="container py-4">
         <h3 className="text-lg font-semibold">Result of {result.test.name}</h3>
         <div></div>
      </div>
   );
};

Result.getLayout = (page) => {
   return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: false,
})(async ({ ctx, access_token, refresh_token }) => {
   const resultId = ctx.params?.resultId as string;

   const res: TBaseResponse<TTestUser | null> = await http_server(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      `/tests/results/${resultId}`
   );

   console.log(res);

   if (!res.data) {
      return {
         notFound: true,
      };
   }

   return {
      props: {
         result: res.data,
      },
   };
});

export default Result;

import { UserProvider } from '@/contexts/user.ctx';
import '@/styles/globals.css';
import { AppPropsWithLayout } from '@/types';
import {
   Hydrate,
   QueryClient,
   QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NextProgress from 'next-progress';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

const ScrollTop = dynamic(
   () => import('@/components/shared').then((v) => v.ScrollTop),
   {
      ssr: false,
   }
);

export default function App({ Component, pageProps }: AppPropsWithLayout) {
   const getLayout = Component.getLayout ?? ((page) => page);
   const [queryClient] = useState(() => new QueryClient());

   return (
      <>
         <NextProgress
            options={{ showSpinner: false }}
            color="rgb(39, 39 ,42)"
         />
         <Toaster position="top-center" />
         <UserProvider initUser={pageProps.user}>
            <QueryClientProvider client={queryClient}>
               <Hydrate state={pageProps.dehydratedState}>
                  {getLayout(<Component {...pageProps} />)}
               </Hydrate>
               <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
         </UserProvider>
         <ScrollTop />
      </>
   );
}

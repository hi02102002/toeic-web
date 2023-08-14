import { AudioCtxProvider } from '@/contexts/audio.ctx';
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
import 'swiper/css';
import 'swiper/css/virtual';
import 'swiper/css/effect-creative';
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
         <QueryClientProvider client={queryClient}>
            <UserProvider initUser={pageProps.user}>
               <Hydrate state={pageProps.dehydratedState}>
                  <AudioCtxProvider>
                     {getLayout(<Component {...pageProps} />)}
                  </AudioCtxProvider>
               </Hydrate>
               <ReactQueryDevtools initialIsOpen={false} />
            </UserProvider>
         </QueryClientProvider>
         <ScrollTop />
      </>
   );
}

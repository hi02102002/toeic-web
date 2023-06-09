import '@/styles/globals.css';
import NextProgress from 'next-progress';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
   return (
      <>
         <NextProgress
            options={{ showSpinner: false }}
            color="rgb(39, 39 ,42)"
         />
         <Toaster position="top-center" />
         <Component {...pageProps} />
      </>
   );
}

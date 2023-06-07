import { Button } from '@/components/shared';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
   return <Button variants="primary">Button</Button>;
}

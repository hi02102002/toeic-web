import Image from 'next/image';
import Link from 'next/link';

type Props = {
   image: string;
   title: string;
   description: string;
   href: string;
};

export const FeatureCard = ({ image, title, description, href }: Props) => {
   return (
      <Link href={href}>
         <div className="relative h-full p-4 border rounded cursor-pointer border-border flex items-center gap-4">
            <div className="w-16 h-16 flex-shrink-0">
               <div className="aspect-1 relative">
                  <Image src={image} alt={title} fill className="rounded" />
               </div>
            </div>
            <div className="space-y-2">
               <h3 className="text-lg font-semibold">{title}</h3>
               <p className="text-muted-foreground">{description}</p>
            </div>
         </div>
      </Link>
   );
};

export default FeatureCard;

import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '../dialog';

type Props = {
   src: string;
   alt: string;
   width: number;
   height: number;
};

export const ImageClickAble = ({ alt, height, src, width }: Props) => {
   return (
      <Dialog>
         <DialogTrigger>
            <div className="cursor-pointer">
               <Image
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  className="object-contain rounded"
               />
            </div>
         </DialogTrigger>
         <DialogContent
            className="bg-transparent border-0 shadow-none h-[80vh]"
            classNameClose="hidden"
         >
            <div className="aspect-square">
               <Image src={src} alt={alt} fill className="object-contain" />
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default ImageClickAble;

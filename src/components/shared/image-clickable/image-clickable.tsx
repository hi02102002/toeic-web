import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '../dialog';

type Props = {
   src: string;
   alt: string;
   width: number;
   height: number;
   widthImageModal?: number;
   heightImageModal?: number;
};

export const ImageClickAble = ({
   alt,
   height,
   src,
   width,
   widthImageModal = 500,
   heightImageModal = 500,
}: Props) => {
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
            className="bg-transparent border-0 shadow-none !max-w-none flex items-center justify-center w-max !p-0"
            classNameClose="hidden"
            style={{
               width: widthImageModal,
            }}
         >
            <Image
               src={src}
               alt={alt}
               width={widthImageModal}
               height={heightImageModal}
               className="object-contain"
            />
         </DialogContent>
      </Dialog>
   );
};

export default ImageClickAble;

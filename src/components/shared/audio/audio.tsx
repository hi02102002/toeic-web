import { IconVolume } from '@tabler/icons-react';
import { useState } from 'react';
import ReactPlayer from 'react-player';

export const Audio = ({ src }: { src: string }) => {
   const [isPlaying, setIsPlaying] = useState(false);
   return (
      <div className="cursor-pointer">
         <div className="hidden">
            <ReactPlayer
               url={src}
               controls={true}
               width="100%"
               height="100%"
               playing={isPlaying}
               onEnded={() => {
                  setIsPlaying(false);
               }}
            />
         </div>
         <IconVolume
            className="w-5 h-5"
            onClick={() => {
               setIsPlaying(true);
            }}
         />
      </div>
   );
};

export default Audio;

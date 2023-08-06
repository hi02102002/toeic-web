import {
   Dispatch,
   SetStateAction,
   createContext,
   useContext,
   useState,
} from 'react';

export type TAudioCtx = {
   currentAudioId: string | null;
   setCurrentAudioId: Dispatch<SetStateAction<string | null>>;
};

export const AudioCtx = createContext<TAudioCtx>({
   currentAudioId: null,
   setCurrentAudioId: () => {},
});

export const AudioCtxProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);

   return (
      <AudioCtx.Provider
         value={{
            currentAudioId,
            setCurrentAudioId,
         }}
      >
         {children}
      </AudioCtx.Provider>
   );
};

export const useAudioCtx = () => {
   const ctx = useContext(AudioCtx);

   if (!ctx) {
      throw new Error('useAudioCtx must be used within AudioCtxProvider');
   }

   return ctx;
};

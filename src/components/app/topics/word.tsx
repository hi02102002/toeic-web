import {
   Audio as AudioWord,
   Button,
   LoadingFullPage,
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from '@/components/shared';
import { useCreateFlashcard } from '@/hooks';
import { TDeck, TWord } from '@/types';
import { IconPlus } from '@tabler/icons-react';
import Image from 'next/image';
import ListDeck from '../modal/list-deck';

type Props = {
   word: TWord;
   decks: TDeck[];
};

export const Word = ({ word, decks }: Props) => {
   const {
      mutateAsync: handleCreateFlashcard,
      isLoading: isLoadingCreateFlashcard,
   } = useCreateFlashcard();

   return (
      <>
         <div className="relative p-4 border rounded border-border">
            <div>
               <div className="flex items-center justify-between">
                  <span className="font-medium">
                     {word.name} ({word.patchOfSpeech})
                  </span>
                  <TooltipProvider>
                     <Tooltip>
                        <ListDeck
                           decks={decks}
                           onSubmit={async ({ values, close }) => {
                              await handleCreateFlashcard({
                                 ...values,
                                 wordId: word.id,
                              });
                              close?.();
                           }}
                        >
                           <TooltipTrigger>
                              <Button
                                 variants="outline"
                                 className="p-0 w-9 h-9"
                              >
                                 <IconPlus className="w-5 h-5" />
                              </Button>
                           </TooltipTrigger>
                        </ListDeck>
                        <TooltipContent>
                           <p className="font-medium">Add to your deck</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               </div>
               <div className="flex items-center gap-4 justify-between">
                  <div>
                     <div className="flex flex-col gap-1">
                        {word.pronunciation && (
                           <span>{word.pronunciation}</span>
                        )}
                        {word.audios && word.audios.length > 0 && (
                           <ul className="flex items-center gap-2">
                              {word.audios.map((audio) => {
                                 return (
                                    <li
                                       key={audio.src}
                                       className="flex items-center gap-1"
                                    >
                                       <span>{audio.region}</span>
                                       <AudioWord src={audio.src} />
                                    </li>
                                 );
                              })}
                           </ul>
                        )}
                        {word.definition && (
                           <div className="flex flex-col gap-1">
                              <span className="font-medium">Definition: </span>
                              <span>{word.definition}</span>
                           </div>
                        )}
                        {word.note && (
                           <div className="flex flex-col gap-1">
                              <span className="font-medium">Note: </span>
                              <span>{word.note}</span>
                           </div>
                        )}
                     </div>
                     {word.examples && word.examples.length > 0 && (
                        <div className="flex flex-col gap-1">
                           <span className="font-medium">Examples: </span>
                           <ul>
                              {word.examples.map((example) => {
                                 return <li key={example}>{example}</li>;
                              })}
                           </ul>
                        </div>
                     )}
                  </div>
                  {word.image && (
                     <div className="w-48">
                        <div className="overflow-hidden rounded aspect-w-4 aspect-h-3">
                           <Image
                              src={word.image}
                              alt={word.name}
                              fill
                              className="object-contain"
                           />
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
         {isLoadingCreateFlashcard && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 pointer-events-none flex flex-col gap-4"
               classNameLoading="text-primary"
               hasOverlay
            />
         )}
      </>
   );
};

export default Word;

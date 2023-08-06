import { Confirm, CreateUpdateWordFlashcard } from '@/components/app';
import {
   Audio as AudioFlashcard,
   Button,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/shared';
import { TFlashcard } from '@/types';
import { urlAudioWord } from '@/utils';
import { IconDots, IconEdit, IconTrashX } from '@tabler/icons-react';
import Image from 'next/image';

type Props = {
   flashcard: TFlashcard;
   onRemove: (id: string) => Promise<void>;
   onUpdate: (data: {
      name: string;
      definition: string;
      image?: any;
      meaning?: string | undefined;
      examples?: string[] | undefined;
      note?: string | undefined;
      patchOfSpeech?: string | undefined;
      pronunciation?: string | undefined;
   }) => Promise<void>;
};

export const FlashcardCard = ({ flashcard, onRemove, onUpdate }: Props) => {
   const defaultValues = {
      name: flashcard.name as string,
      definition: flashcard.definition as string,
      examples: flashcard.examples,
      note: flashcard.note,
      pronunciation: flashcard.pronunciation,
      patchOfSpeech: flashcard.patchOfSpeech,
      image: flashcard.image,
      meaning: flashcard.meaning,
   };

   return (
      <div className="relative p-4 border rounded border-border">
         <div>
            <div className="flex items-center justify-between">
               <span className="font-medium">
                  {flashcard.name}{' '}
                  {flashcard.patchOfSpeech
                     ? `(${flashcard.patchOfSpeech})`
                     : ''}
               </span>
               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Button
                        className="p-0 rounded-full w-9 h-9"
                        variants="outline"
                     >
                        <IconDots />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <CreateUpdateWordFlashcard
                        title="Update flashcard"
                        onSubmit={async ({ values, close }) => {
                           await onUpdate(values);
                           close?.();
                        }}
                        type="update"
                        defaultValues={defaultValues}
                     >
                        <DropdownMenuItem
                           className="flex items-center gap-2"
                           onSelect={(e) => {
                              e.preventDefault();
                           }}
                        >
                           <IconEdit className="w-5 h-5" />
                           Update
                        </DropdownMenuItem>
                     </CreateUpdateWordFlashcard>
                     <Confirm
                        title="Delete flashcard?"
                        description="Are you sure you want to delete this flashcard?"
                        onConfirm={async (close) => {
                           await onRemove(flashcard.id);
                           close?.();
                        }}
                        textConfirm="Delete"
                     >
                        <DropdownMenuItem
                           className="flex items-center gap-2"
                           onSelect={(e) => {
                              e.preventDefault();
                           }}
                        >
                           <IconTrashX className="w-5 h-5" />
                           Delete
                        </DropdownMenuItem>
                     </Confirm>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
            <div className="flex flex-col gap-1">
               {flashcard.pronunciation && (
                  <span>{flashcard.pronunciation}</span>
               )}

               {flashcard.name && (
                  <ul className="flex items-center gap-2">
                     <li className="flex items-center gap-1">
                        <span>UK</span>
                        <AudioFlashcard src={urlAudioWord(flashcard.name, 1)} />
                     </li>
                     <li className="flex items-center gap-1">
                        <span>US</span>
                        <AudioFlashcard src={urlAudioWord(flashcard.name, 2)} />
                     </li>
                  </ul>
               )}
               {flashcard.definition && (
                  <div className="flex flex-col gap-1">
                     <span className="font-medium">Definition: </span>
                     <span>{flashcard.definition}</span>
                  </div>
               )}
               {flashcard.note && (
                  <div className="flex flex-col gap-1">
                     <span className="font-medium">Note: </span>
                     <span>{flashcard.note}</span>
                  </div>
               )}
            </div>
            {flashcard.image && (
               <div className="overflow-hidden rounded aspect-w-4 aspect-h-3">
                  <Image
                     src={flashcard.image}
                     alt={flashcard.name || ''}
                     fill
                     className="object-contain"
                  />
               </div>
            )}
            {flashcard.examples && flashcard.examples.length > 0 && (
               <div className="flex flex-col gap-1">
                  <span className="font-medium">Examples: </span>
                  <ul>
                     {flashcard.examples.map((example) => {
                        return <li key={example}>{example}</li>;
                     })}
                  </ul>
               </div>
            )}
         </div>
      </div>
   );
};

export default FlashcardCard;

import {
   Button,
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   LoadingFullPage,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/shared';
import { useCreateDeck, useDisclosure } from '@/hooks';
import { TDeck } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import CreateUpdateDeck from './create-update-deck';

type Props = {
   children: React.ReactNode;
   decks: TDeck[];
   onSubmit: ({
      values,
      close,
   }: {
      values: FormValues;
      close?: () => void;
   }) => void;
};

const schema = z.object({
   deckId: z.string().nonempty(),
});

type FormValues = z.infer<typeof schema>;

const ListDeck = ({ children, decks, onSubmit }: Props) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
   });
   const { handleSubmit, control } = form;
   const { mutateAsync: handleCreateDeck, isLoading: isLoadingCreateDeck } =
      useCreateDeck({}, false);

   const [isOpen, { onClose, onOpen }] = useDisclosure(false, {
      close: () => {
         form.reset();
      },
   });

   return (
      <>
         <Dialog
            open={isOpen}
            onOpenChange={(open) => {
               if (open) {
                  onOpen();
               } else {
                  onClose();
               }
            }}
         >
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Choose a deck</DialogTitle>
               </DialogHeader>
               {decks.length === 0 ? (
                  <>
                     <p className="text-center">
                        You don&apos;t have any deck. Please create a deck
                        first.
                     </p>
                     <CreateUpdateDeck
                        onSubmit={async ({ values, close }) => {
                           await handleCreateDeck(values.name);
                           close?.();
                        }}
                     >
                        <Button variants="primary">Create a deck</Button>
                     </CreateUpdateDeck>
                  </>
               ) : (
                  <Form {...form}>
                     <form
                        className="space-y-4"
                        onSubmit={handleSubmit(async (values) => {
                           await onSubmit({ values, close: onClose });
                        })}
                     >
                        <FormField
                           control={control}
                           name="deckId"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel required>Deck</FormLabel>
                                 <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select deck" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {decks.map((deck) => {
                                          return (
                                             <SelectItem
                                                key={deck.id}
                                                value={deck.id}
                                             >
                                                {deck.name}
                                             </SelectItem>
                                          );
                                       })}
                                    </SelectContent>
                                 </Select>

                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <DialogFooter>
                           <Button variants="outline" onClick={onClose}>
                              Cancel
                           </Button>
                           <Button variants="primary" type="submit">
                              Submit
                           </Button>
                        </DialogFooter>
                     </form>
                  </Form>
               )}
            </DialogContent>
         </Dialog>
         {isLoadingCreateDeck && (
            <LoadingFullPage
               className="bg-transparent backdrop-blur-sm z-[1000] fixed inset-0 pointer-events-none flex flex-col gap-4"
               classNameLoading="text-primary"
               hasOverlay
            />
         )}
      </>
   );
};

export default ListDeck;

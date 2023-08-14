import {
   Button,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Input,
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { Portal } from '@radix-ui/react-portal';
import { Editor } from '@tiptap/react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

type Props = {
   editor: Editor;
   children: React.ReactNode;
};

const schema = zod.object({
   rows: zod
      .number()
      .min(1)
      .max(10)
      .refine((val) => val !== undefined, { message: 'Rows is required' }),
   cols: zod
      .number()
      .min(1)
      .max(10)
      .refine((val) => val !== undefined, {
         message: 'Cols is required',
      }),
});

type FormValues = zod.infer<typeof schema>;

export const RowColTableEditor = ({ editor, children }: Props) => {
   const form = useForm<FormValues>();
   const [isOpen, { onClose, onOpen }] = useDisclosure();

   const { control, handleSubmit } = form;

   const handleInsertTable = (data: FormValues) => {
      const { cols, rows } = data;
      editor.chain().focus().insertTable({ rows, cols }).run();
      onClose();
   };

   return (
      <Popover
         open={isOpen}
         onOpenChange={(open) => {
            if (open) {
               onOpen();
            } else {
               onClose();
            }
         }}
      >
         <PopoverTrigger>{children}</PopoverTrigger>
         <Portal>
            <PopoverContent>
               <Form {...form}>
                  <form
                     className="flex flex-col gap-4"
                     id="table"
                     onSubmit={handleSubmit(handleInsertTable)}
                  >
                     <FormField
                        control={control}
                        name="cols"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel required>Rows</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Cols"
                                    {...field}
                                    type="number"
                                    min={1}
                                    max={10}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={control}
                        name="rows"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel required>Rows</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Rows"
                                    {...field}
                                    type="number"
                                    min={1}
                                    max={10}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="flex items-center justify-end">
                        <Button
                           sizes="sm"
                           variants="primary"
                           form="table"
                           type="submit"
                        >
                           Insert
                        </Button>
                     </div>
                  </form>
               </Form>
            </PopoverContent>
         </Portal>
      </Popover>
   );
};

export default RowColTableEditor;

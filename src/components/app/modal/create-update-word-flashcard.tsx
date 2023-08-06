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
   Input,
   InputLabel,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
   TextArea,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconX } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
   onSubmit: ({
      values,
      close,
   }: {
      values: FormValues;
      close?: () => void;
   }) => void;

   defaultValues?: FormValues;
   children: React.ReactNode;
   type?: 'create' | 'update';
   title?: string;
};

const schema = z.object({
   image: z.any().optional(),
   name: z.string().nonempty({
      message: 'Name is required',
   }),
   definition: z.string().nonempty({
      message: 'Definition is required',
   }),
   meaning: z.string().optional(),
   examples: z
      .array(z.string())
      .max(5, 'You can only add 5 example')
      .optional(),
   note: z.string().optional(),
   patchOfSpeech: z.string().optional(),
   pronunciation: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const CreateUpdateWordFlashcard = ({
   children,
   onSubmit,
   defaultValues,
   type,
   title,
}: Props) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues,
   });

   const { control, handleSubmit } = form;

   const {
      fields: examplesFields,

      remove: removeExample,
      append: appendExample,
   } = useFieldArray({
      name: 'examples',
      control,
      rules: {
         required: true,
      },
   });

   const [isOpen, { onClose, onOpen }] = useDisclosure(false, {
      close() {
         form.reset({
            examples: [],
            patchOfSpeech: '',
            image: undefined,
            name: '',
            definition: '',
            meaning: '',
            note: '',
            pronunciation: '',
         });
      },
      open() {
         form.setValue('examples', defaultValues?.examples || []);
         form.setValue('patchOfSpeech', defaultValues?.patchOfSpeech || '');
         form.setValue('image', defaultValues?.image || undefined);
         form.setValue('name', defaultValues?.name || '');
         form.setValue('definition', defaultValues?.definition || '');
         form.setValue('meaning', defaultValues?.meaning || '');
         form.setValue('note', defaultValues?.note || '');
         form.setValue('pronunciation', defaultValues?.pronunciation || '');
      },
   });

   const imageRef = useRef<HTMLInputElement | null>(null);

   useEffect(() => {
      if (defaultValues?.image) {
         const file = new File([], defaultValues.image);

         const data = new DataTransfer();

         data.items.add(file);

         if (imageRef.current) imageRef.current.files = data.files;
      }
   });

   return (
      <Dialog
         open={isOpen}
         onOpenChange={(open) => {
            if (open) onOpen();
            else onClose();
         }}
      >
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-4"
                  onSubmit={handleSubmit((values) => {
                     onSubmit?.({ values, close: onClose });
                  })}
               >
                  <FormField
                     name="name"
                     control={control}
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Name</FormLabel>
                              <FormControl>
                                 <Input placeholder="Name" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     name="definition"
                     control={control}
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel required>Definition</FormLabel>
                              <FormControl>
                                 <TextArea
                                    placeholder="Definition"
                                    {...field}
                                    className="resize-none"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     name="pronunciation"
                     control={control}
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel>Pronunciation</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Pronunciation"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     control={control}
                     name="image"
                     render={({
                        field: { ref, onChange, value, ...field },
                     }) => {
                        return (
                           <FormItem>
                              <FormLabel>Image</FormLabel>
                              <FormControl>
                                 <Input
                                    type="file"
                                    accept="image/*"
                                    {...field}
                                    ref={(el) => {
                                       ref(el);
                                       imageRef.current = el;
                                    }}
                                    onChange={(e: any) => {
                                       onChange(e.target.files);
                                    }}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />

                  <FormField
                     name="patchOfSpeech"
                     control={control}
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel>Patch of speech</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select patch of speech" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value="">None</SelectItem>
                                    <SelectItem value="a">Adjective</SelectItem>
                                    <SelectItem value="n">Noun</SelectItem>
                                    <SelectItem value="v">Verb</SelectItem>
                                    <SelectItem value="adv">Adverb</SelectItem>
                                    <SelectItem value="pre">
                                       Preposition
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />

                  <FormField
                     name="meaning"
                     control={control}
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel>Meaning</FormLabel>
                              <FormControl>
                                 <Input placeholder="Meaning" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <FormField
                     name="note"
                     control={control}
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel>Note</FormLabel>
                              <FormControl>
                                 <TextArea
                                    placeholder="Note"
                                    {...field}
                                    className="resize-none"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <div className="space-y-2">
                     <InputLabel>Examples</InputLabel>
                     <div className="space-y-4">
                        {examplesFields.map((field, index) => {
                           return (
                              <FormField
                                 key={field.id}
                                 name={`examples.${index}`}
                                 control={control}
                                 render={({ field }) => {
                                    return (
                                       <FormItem>
                                          <div className="flex items-center gap-4">
                                             <FormControl>
                                                <Input
                                                   placeholder={`Example ${
                                                      index + 1
                                                   }`}
                                                   {...field}
                                                />
                                             </FormControl>
                                             <Button
                                                variants="danger"
                                                className="flex-shrink-0 w-10 h-10 p-0"
                                                type="button"
                                                onClick={() => {
                                                   removeExample(index);
                                                }}
                                             >
                                                <IconX />
                                             </Button>
                                          </div>
                                          <FormMessage />
                                       </FormItem>
                                    );
                                 }}
                                 rules={{
                                    required: true,
                                 }}
                              />
                           );
                        })}
                     </div>
                     {examplesFields.length < 5 && (
                        <Button
                           onClick={() => {
                              appendExample('');
                           }}
                           className="w-full"
                           type="button"
                        >
                           {examplesFields.length === 0
                              ? 'Add example'
                              : 'Add another example'}
                        </Button>
                     )}
                  </div>
                  <DialogFooter>
                     <Button variants="outline" type="button" onClick={onClose}>
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        variants="primary"
                        disabled={type === 'update' && !form.formState.isDirty}
                     >
                        {type === 'create' ? 'Create' : 'Save changes'}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default CreateUpdateWordFlashcard;

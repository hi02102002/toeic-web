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
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
   TextArea,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
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
};

const schema = z.object({
   answers: z.array(
      z.object({
         content: z.string().nonempty('Answer is required'),
         isCorrect: z.boolean().default(false),

         id: z.string().optional(),
      })
   ),
   explain: z.string().optional(),
   text: z.string().nonempty('Question is required'),
});

type FormValues = z.infer<typeof schema>;

export const CreateUpdateCommonQuestion = ({
   children,
   onSubmit,
   type = 'create',
   defaultValues,
}: Props) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues || {
         answers: [
            {
               content: '',
               isCorrect: false,
            },
            {
               content: '',
               isCorrect: false,
            },
            {
               content: '',
               isCorrect: false,
            },
            {
               content: '',
               isCorrect: false,
            },
         ],
         explain: '',
      },
   });

   const {
      control,
      register,
      handleSubmit,
      reset,
      formState: { errors, isDirty },
   } = form;

   const { fields } = useFieldArray({
      control,
      name: 'answers',
   });

   const [isOpen, { onClose, onOpen }] = useDisclosure(false, {
      close() {
         reset();
      },
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
         <DialogContent className="my-4">
            <DialogHeader>
               <DialogTitle>
                  {type === 'create' ? 'Create' : 'Update'} Question
               </DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form
                  className="space-y-4"
                  onSubmit={handleSubmit((data) => {
                     onSubmit({
                        values: data,

                        close: onClose,
                     });
                  })}
               >
                  <FormField
                     name="text"
                     control={control}
                     render={({ field }) => {
                        return (
                           <FormItem className="w-full">
                              <FormLabel required>Question</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter question"
                                    className="w-full resize-none"
                                    {...field}
                                    error={Boolean(errors.text?.message)}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />

                  {fields.map((field, index) => {
                     return (
                        <div className="flex gap-3" key={field.id}>
                           <FormField
                              name={`answers.${index}.content`}
                              control={control}
                              render={({ field }) => {
                                 return (
                                    <FormItem className="w-full">
                                       <FormLabel required>
                                          Answer {index + 1}
                                       </FormLabel>
                                       <FormControl>
                                          <Input
                                             placeholder="Enter answer"
                                             className="w-full"
                                             {...field}
                                             error={Boolean(
                                                errors.answers?.[index]?.content
                                             )}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 );
                              }}
                           />
                           <FormField
                              name={`answers.${index}.isCorrect`}
                              control={control}
                              render={({ field }) => {
                                 return (
                                    <FormItem>
                                       <FormLabel required>Correct</FormLabel>
                                       <Select
                                          onValueChange={(value) => {
                                             field.onChange(
                                                value === 'true' ? true : false
                                             );
                                          }}
                                          defaultValue={
                                             field.value === true
                                                ? 'true'
                                                : 'false'
                                          }
                                       >
                                          <FormControl>
                                             <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Correct" />
                                             </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                             <SelectItem value="true">
                                                True
                                             </SelectItem>
                                             <SelectItem value="false">
                                                False
                                             </SelectItem>
                                          </SelectContent>
                                       </Select>
                                       <FormMessage />
                                    </FormItem>
                                 );
                              }}
                           />
                        </div>
                     );
                  })}
                  <FormField
                     name="explain"
                     control={control}
                     render={({ field }) => {
                        return (
                           <FormItem className="w-full">
                              <FormLabel>Explain</FormLabel>
                              <FormControl>
                                 <TextArea
                                    placeholder="Enter explain"
                                    className="w-full resize-none"
                                    {...field}
                                 />
                              </FormControl>
                           </FormItem>
                        );
                     }}
                  />
                  <DialogFooter>
                     <Button
                        variants="secondary"
                        type="button"
                        onClick={onClose}
                     >
                        Cancel
                     </Button>
                     <Button
                        variants="primary"
                        disabled={!isDirty && type === 'update'}
                        type="submit"
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

export default CreateUpdateCommonQuestion;

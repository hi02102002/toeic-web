import {
   Button,
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   Input,
   InputLabel,
   InputWrapper,
   LoadingFullPage,
} from '@/components/shared';
import { useDisclosure } from '@/hooks';
import { useUploadFile } from '@/hooks/use-upload-file';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
type Props = {
   children: React.ReactNode;
   editor: Editor | null;
};

export const UploadImageTiptap = ({ children, editor }: Props) => {
   const [using, setUsing] = useState<'url' | 'file' | undefined>(undefined);

   const [url, setUrl] = useState<string | undefined>(undefined);
   const [file, setFile] = useState<File | undefined>(undefined);
   const [isOpen, { onOpen, onClose }] = useDisclosure(false, {
      close() {
         setUsing(undefined);
         setUrl(undefined);
      },
   });
   const { mutateAsync: uploadFile, isLoading: isLoadingUpload } =
      useUploadFile((res) => {
         editor?.chain().focus().setImage({ src: res.url }).run();
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
                  <DialogTitle>Upload Image</DialogTitle>
               </DialogHeader>
               {using ? (
                  <>
                     <div className="space-y-3">
                        <Button
                           variants="outline"
                           onClick={() => {
                              setUsing(undefined);
                              setUrl(undefined);
                              setFile(undefined);
                           }}
                        >
                           Back
                        </Button>
                        {using === 'url' ? (
                           <div>
                              <InputWrapper>
                                 <InputLabel required>Image url</InputLabel>
                                 <Input
                                    type="text"
                                    placeholder="https://example.com/image.png"
                                    value={url}
                                    onChange={(e: any) =>
                                       setUrl(e.target.value)
                                    }
                                 />
                              </InputWrapper>
                           </div>
                        ) : (
                           <div>
                              <InputWrapper>
                                 <InputLabel required>Image file</InputLabel>
                                 <input
                                    type="file"
                                    onChange={(e: any) =>
                                       setFile(e.target.files?.[0])
                                    }
                                 />
                              </InputWrapper>
                           </div>
                        )}
                     </div>
                     <DialogFooter>
                        <Button variants="outline">Cancel</Button>
                        <Button
                           variants="primary"
                           onClick={async () => {
                              if (using === 'url') {
                                 editor
                                    ?.chain()
                                    .focus()
                                    .setImage({ src: url as string })
                                    .run();
                              } else {
                                 await uploadFile(file as File);
                              }
                              onClose();
                           }}
                           disabled={!url && !file}
                        >
                           Upload
                        </Button>
                     </DialogFooter>
                  </>
               ) : (
                  <div className="flex items-center w-full gap-3">
                     <Button
                        variants="primary"
                        onClick={() => setUsing('url')}
                        className="w-full"
                     >
                        Using url
                     </Button>
                     <Button
                        variants="primary"
                        onClick={() => setUsing('file')}
                        className="w-full"
                     >
                        Using file
                     </Button>
                  </div>
               )}
            </DialogContent>
         </Dialog>

         {isLoadingUpload && (
            <LoadingFullPage className="backdrop-blur-sm z-[10000] fixed inset-0 bg-transparent" />
         )}
      </>
   );
};

export default UploadImageTiptap;

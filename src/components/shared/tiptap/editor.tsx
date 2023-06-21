import { cn } from '@/utils';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './toolbar';

type Props = {
   onChange?: (content: string) => void;
   value?: string;
   error?: boolean;
};

export const Editor = ({ value, onChange, error }: Props) => {
   const editor = useEditor({
      extensions: [
         StarterKit.configure({
            heading: {
               levels: [3, 4, 5, 6],
            },
         }),
         TextAlign.configure({
            types: ['heading', 'paragraph'],
         }),
         Image,
         Highlight,
      ],
      content: value || '',
      onUpdate({ editor }) {
         onChange &&
            onChange(
               !editor.state.doc.textContent.trim().length
                  ? ''
                  : editor.getHTML()
            );
      },
   });

   return (
      <div
         className={cn(
            'border-2 rounded border-border focus-within:border-primary',
            {
               'border-red-500 focus-within:border-red-500': error,
            }
         )}
      >
         <Toolbar editor={editor} />
         <EditorContent editor={editor} className="px-2 prose" />
      </div>
   );
};

export default Editor;

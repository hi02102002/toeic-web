import { cn } from '@/utils';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './toolbar';
import Underline from '@tiptap/extension-underline';
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
               levels: [2, 3, 4, 5, 6],
            },
         }),
         TextAlign.configure({
            types: ['heading', 'paragraph'],
         }),
         Image,
         Highlight,
         Table.configure({
            resizable: true,
         }),
         TableRow,
         TableHeader,
         TableCell,
         Underline,
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
            'border-2 rounded border-input focus-within:border-primary',
            {
               'border-red-500 focus-within:border-red-500': error,
            }
         )}
      >
         <Toolbar editor={editor} />
         <EditorContent editor={editor} className="w-full px-2 prose" />
      </div>
   );
};

export default Editor;

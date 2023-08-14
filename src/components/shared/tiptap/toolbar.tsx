import { RowColTableEditor, UploadImageTiptap } from '@/components/app';
import { cn } from '@/utils';
import {
   IconAlignCenter,
   IconAlignLeft,
   IconAlignRight,
   IconBold,
   IconH2,
   IconH3,
   IconH4,
   IconH5,
   IconHighlight,
   IconItalic,
   IconList,
   IconListNumbers,
   IconPhoto,
   IconQuote,
   IconStrikethrough,
   IconTable,
   IconUnderline,
} from '@tabler/icons-react';
import { Editor } from '@tiptap/react';
import { ButtonHTMLAttributes } from 'react';

type Props = {
   editor: Editor | null;
};

const ButtonToggle = ({
   children,
   className,
   ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
   isActivated?: boolean;
}) => {
   return (
      <button
         className={cn(
            'rounded hover:bg-muted transition-all w-9 h-9 flex items-center justify-center',
            className,
            props.isActivated ? 'bg-primary text-white hover:bg-primary/90' : ''
         )}
         type="button"
         {...props}
      >
         {children}
      </button>
   );
};

export const Toolbar = ({ editor }: Props) => {
   if (!editor) return null;

   return (
      <div className="flex flex-wrap items-center gap-2 p-2 border-b-2 border-border ">
         <ButtonToggle
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActivated={editor.isActive('textAlign', { align: 'left' })}
         >
            <IconAlignLeft className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActivated={editor.isActive('textAlign', { align: 'center' })}
         >
            <IconAlignCenter className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActivated={editor.isActive('textAlign', { align: 'right' })}
         >
            <IconAlignRight className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActivated={editor.isActive('bold')}
         >
            <IconBold className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActivated={editor.isActive('italic')}
         >
            <IconItalic className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActivated={editor.isActive('underline')}
         >
            <IconUnderline className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActivated={editor.isActive('strike')}
         >
            <IconStrikethrough className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() => editor.commands.toggleHighlight()}
            isActivated={editor.isActive('highlight')}
         >
            <IconHighlight className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() =>
               editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActivated={editor.isActive('heading', { level: 2 })}
         >
            <IconH2 className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() =>
               editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActivated={editor.isActive('heading', { level: 3 })}
         >
            <IconH3 className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() =>
               editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            isActivated={editor.isActive('heading', { level: 4 })}
         >
            <IconH4 className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() =>
               editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            isActivated={editor.isActive('heading', { level: 5 })}
         >
            <IconH5 className="w-5 h-5" />
         </ButtonToggle>

         <ButtonToggle
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActivated={editor.isActive('bulletList')}
         >
            <IconList className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActivated={editor.isActive('orderedList')}
         >
            <IconListNumbers className="w-5 h-5" />
         </ButtonToggle>
         <ButtonToggle
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActivated={editor.isActive('blockquote')}
         >
            <IconQuote className="w-5 h-5" />
         </ButtonToggle>
         <UploadImageTiptap editor={editor}>
            <div>
               <ButtonToggle>
                  <IconPhoto className="w-5 h-5" />
               </ButtonToggle>
            </div>
         </UploadImageTiptap>
         <RowColTableEditor editor={editor}>
            <div>
               <ButtonToggle>
                  <IconTable className="w-5 h-5" />
               </ButtonToggle>
            </div>
         </RowColTableEditor>
      </div>
   );
};

export default Toolbar;

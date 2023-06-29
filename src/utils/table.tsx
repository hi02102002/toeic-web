import { ViewParagraph } from '@/components/app';
import { Checkbox, ImageClickAble } from '@/components/shared';
import { TQuestion } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
export const tableQuestionColumns: Record<string, ColumnDef<TQuestion>> = {
   id: {
      accessorKey: 'id',
      header: ({ table }) => (
         <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
               table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
         />
      ),
      cell: ({ row }) => (
         <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
         />
      ),
      enableSorting: false,
      enableHiding: false,
   },
   image: {
      accessorKey: 'image',
      header: 'Image',
      cell({ row }) {
         return row.original.image ? (
            <ImageClickAble
               src={row.getValue('image')}
               alt={row.getValue('image')}
               width={50}
               height={50}
            />
         ) : (
            <span>N/A</span>
         );
      },
   },
   audio: {
      accessorKey: 'audio',
      header: 'Audio',
      cell({ row }) {
         return <audio controls src={row.getValue('audio')} />;
      },
   },
   createdAt: {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell({ row }) {
         return (
            <span className="whitespace-nowrap break-keep">
               {new Date(row.getValue('createdAt')).toLocaleString()}
            </span>
         );
      },
   },
   text: {
      accessorKey: 'text',
      header: 'Question',
      cell({ row }) {
         return (
            <span className="line-clamp-2 whitespace-nowrap">
               {row.original.text.length > 0 ? row.original.text : 'N/A'}
            </span>
         );
      },
   },
   paragraph: {
      accessorKey: 'text',
      header: 'Paragraph',
      cell({ row }) {
         return (
            <ViewParagraph paragraph={row.original.text || 'N/A'}>
               <span className="font-medium cursor-pointer">
                  View paragraph
               </span>
            </ViewParagraph>
         );
      },
   },
};

import { AppLayout } from '@/components/layouts/app';
import { Link } from '@/components/shared';
import { DataTable } from '@/components/shared/table';
import { ROUTES } from '@/constants';
import { useResultsTest } from '@/hooks';
import { NextPageWithLayout, TTestUser } from '@/types';
import { calcPageCount } from '@/utils';
import { withRoute } from '@/utils/withRoute';
import {
   ColumnDef,
   PaginationState,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

type Props = {};

const ResultTest: NextPageWithLayout<Props> = (props) => {
   const { data, isLoading } = useResultsTest();
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });

   const columns: ColumnDef<TTestUser>[] = [
      {
         accessorKey: 'test.name',
         header: 'Name Test',
      },
      {
         accessorKey: 'Test date',
         header: 'Test date',
         cell: ({ row }) => {
            return (
               <span>
                  {new Date(row.original.createdAt).toLocaleDateString()}
               </span>
            );
         },
      },
      {
         accessorKey: 'listeningScore',
         header: 'Listening score',
      },
      {
         accessorKey: 'readingScore',
         header: 'Reading score',
      },
      {
         accessorKey: 'totalScore',
         header: 'Total score',
      },
      {
         accessorKey: 'action',
         header: 'Action',
         cell: ({ row }) => {
            return (
               <Link
                  href={`${ROUTES.TOIEC_TEST}/results/${row.original.id}`}
                  className="font-medium text-primary"
               >
                  View detail
               </Link>
            );
         },
      },
   ];

   const table = useReactTable({
      columns,
      data: data?.results || [],
      getCoreRowModel: getCoreRowModel(),
      state: {
         pagination,
      },
      onPaginationChange: setPagination,
      manualPagination: true,
      pageCount: calcPageCount(data?.total || 0, pagination.pageSize),
   });

   return (
      <div className="container py-4 space-y-4">
         <h3 className="text-xl font-semibold">Results test</h3>

         <DataTable table={table} isLoading={isLoading} />
      </div>
   );
};

ResultTest.getLayout = (page) => {
   return (
      <AppLayout
         title="Toiec | Result Test"
         description="This page contains all your result test, you test before"
      >
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({
   isProtected: true,
})();

export default ResultTest;

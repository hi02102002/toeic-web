import { AdminLayout } from '@/components/layouts/admin';
import {
   Button,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   ImageClickAble,
   Input,
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from '@/components/shared';
import { DataTable } from '@/components/shared/table';
import { ROUTES } from '@/constants';
import { useDebounce, useUsers } from '@/hooks';
import { useUpdateUser } from '@/hooks/use-update-user';
import { NextPageWithLayout, TUser, TUserQuery, UserStatus } from '@/types';
import { calcPageCount } from '@/utils';
import { withRoute } from '@/utils/withRoute';
import {
   IconBan,
   IconDots,
   IconEye,
   IconRotateClockwise,
   IconX,
} from '@tabler/icons-react';
import {
   ColumnDef,
   PaginationState,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Users: NextPageWithLayout = () => {
   const router = useRouter();
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
   });
   const [search, setSearch] = useState<string>('');
   const debounceSearch = useDebounce(search, 500);
   const [status, setStatus] = useState<UserStatus | 'ALL'>('ALL');

   const q: TUserQuery = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      name: debounceSearch,
      status,
   };

   const { data, isLoading } = useUsers(q);
   const { mutateAsync: handleUpdateUser, isLoading: isLoadingUpdateUser } =
      useUpdateUser(q);

   const columns: ColumnDef<TUser>[] = [
      {
         accessorKey: 'avatar',
         header: 'Avatar',
         cell({ row }) {
            return row.original.avatar ? (
               <ImageClickAble
                  alt={row.original.name}
                  height={50}
                  width={50}
                  src={row.original.avatar as string}
               />
            ) : (
               <span>N/A</span>
            );
         },
      },
      {
         accessorKey: 'email',
         header: 'Email',
      },
      {
         accessorKey: 'name',
         header: 'Name',
      },
      {
         accessorKey: 'status',
         header: 'Status',
      },
      {
         accessorKey: 'roles',
         header: 'Role',
      },

      {
         accessorKey: 'actions',
         header: 'Actions',
         cell({ row }) {
            return (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <IconDots className="w-4 h-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={() => {
                           router.push(
                              `${ROUTES.ADMIN_USERS}/${row.original.id}`
                           );
                        }}
                     >
                        <IconEye className="w-4 h-4 mr-2" />
                        View
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={(e) => {
                           if (row.original.status === UserStatus.BLOCKED) {
                              handleUpdateUser({
                                 id: row.original.id,
                                 data: {
                                    status: UserStatus.ACTIVE,
                                 },
                              });
                           } else {
                              handleUpdateUser({
                                 id: row.original.id,
                                 data: {
                                    status: UserStatus.BLOCKED,
                                 },
                              });
                           }
                        }}
                     >
                        {row.original.status === UserStatus.BLOCKED ? (
                           <>
                              <IconRotateClockwise className="w-4 h-4 mr-2" />
                              Unlock
                           </>
                        ) : (
                           <>
                              <IconBan className="w-4 h-4 mr-2" />
                              Ban
                           </>
                        )}
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            );
         },
      },
   ];

   const table = useReactTable({
      columns,
      data: data?.users || [],
      getCoreRowModel: getCoreRowModel(),
      state: {
         pagination,
      },
      onPaginationChange: setPagination,
      manualPagination: true,
      pageCount: calcPageCount(data?.total || 0, pagination.pageSize),
   });

   return (
      <div className="py-4 space-y-4">
         <h3 className="text-xl font-semibold">Users</h3>
         <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-col items-center w-full gap-4 sm:flex-row ">
               <Input
                  placeholder="Search"
                  classNameContainer="sm:max-w-xs w-full"
                  value={search}
                  onChange={(e: any) => setSearch(e.target.value)}
               />
               {search && (
                  <Button
                     leftIcon={<IconX />}
                     variants="outline"
                     onClick={() => setSearch('')}
                     className="w-full sm:w-auto"
                  >
                     Reset
                  </Button>
               )}
            </div>
            <Select
               defaultValue="ALL"
               onValueChange={(value) => {
                  setStatus(value as UserStatus | 'ALL');
               }}
            >
               <SelectTrigger className="sm:w-[180px] w-full">
                  <SelectValue placeholder="Select a fruit" />
               </SelectTrigger>
               <SelectContent>
                  <SelectGroup>
                     <SelectLabel>Status</SelectLabel>
                     <SelectItem value="ALL">All</SelectItem>
                     <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                     <SelectItem value={UserStatus.BLOCKED}>Block</SelectItem>
                  </SelectGroup>
               </SelectContent>
            </Select>
         </div>
         <DataTable table={table} showSelect={false} isLoading={isLoading} />
      </div>
   );
};

Users.getLayout = (page) => {
   return (
      <AdminLayout
         title="Admin | Users"
         description="Manage users, block, unblock, view user"
      >
         {page}
      </AdminLayout>
   );
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: true,
})();

export default Users;

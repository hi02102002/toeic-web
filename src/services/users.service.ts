import { http } from '@/libs/axios';
import { TBaseResponse, TUser, TUserDto, TUserQuery } from '@/types';

export class UsersService {
   getAllUsers(q?: TUserQuery): Promise<
      TBaseResponse<{
         users: TUser[];
         total: number;
      }>
   > {
      return http.get('/users', {
         params: {
            ...q,
            page: q?.page || 1,
            limit: q?.limit || 5,
         },
      });
   }

   async updateUser(
      id: string,
      data: Partial<TUserDto>
   ): Promise<TBaseResponse<TUser>> {
      return http.patch(`/users/${id}`, data);
   }
}

export const usersService = new UsersService();

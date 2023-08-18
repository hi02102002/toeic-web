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

   updateUser(
      id: string,
      data: Partial<TUserDto>
   ): Promise<TBaseResponse<TUser>> {
      return http.patch(`/users/${id}`, data);
   }

   getMe(): Promise<TBaseResponse<TUser>> {
      return http.get('/auth/me');
   }

   startTest(): Promise<TBaseResponse<TUser>> {
      return http.post('/users/start-test');
   }

   finishTest(): Promise<TBaseResponse<TUser>> {
      return http.post('/users/finish-test');
   }
}

export const usersService = new UsersService();

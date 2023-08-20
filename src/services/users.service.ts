import { http } from '@/libs/axios';
import {
   TBaseResponse,
   TPasswordChangeDto,
   TProfileDto,
   TUser,
   TUserDto,
   TUserLearningSetting,
   TUserLearningSettingDto,
   TUserQuery,
} from '@/types';

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

   getSetting(): Promise<TBaseResponse<TUserLearningSetting>> {
      return http.get(`/settings`);
   }

   updateSetting(
      data: TUserLearningSettingDto
   ): Promise<TBaseResponse<TUserLearningSetting>> {
      return http.patch(`/settings`, data);
   }

   updateProfile(data: TProfileDto): Promise<TBaseResponse<TUser>> {
      return http.patch(`/auth/update-profile`, data);
   }

   changePassword(data: TPasswordChangeDto) {
      return http.post('/users/change-password', data);
   }

   deletePersonalAccount() {
      return http.delete('/users/personal-account');
   }
}

export const usersService = new UsersService();

export enum Role {
   ADMIN = 'ADMIN',
   USER = 'USER',
}

export type TUser = {
   id: string;
   name: string;
   email: string | null;
   password: string | null;
   createdAt?: Date;
   updatedAt?: Date;
   avatar: string | null;
   provider: string;
   role: Role;
};

export type TBaseResponse<T = unknown> = {
   message: string;
   data: T;
};

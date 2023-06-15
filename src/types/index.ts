import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export enum Role {
   ADMIN = 'ADMIN',
   USER = 'USER',
}

export enum PartType {
   PART1 = 'PART1',
   PART2 = 'PART2',
   PART3 = 'PART3',
   PART4 = 'PART4',
   PART5 = 'PART5',
   PART6 = 'PART6',
   PART7 = 'PART7',
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

export type TTest = {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
   parts: TPart[];
};

export type TPart = {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
   testId: string;
   type: PartType;
};

export type TBaseResponse<T = unknown> = {
   message: string;
   data: T;
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
   getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
   Component: NextPageWithLayout;
};

export type TTestQuery = Partial<{
   name: string;
   limit: number;
   page: number;
   orderBy: string;
   asc: boolean;
}>;

import { ROUTES, URL_KEYS } from '@/constants';
import { http_server } from '@/libs/axios';
import { Role, TUser } from '@/types';
import { getCookies } from 'cookies-next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
type Options = {
   isProtected?: boolean;
   onlyAdmin?: boolean;
};

export type WithRoute<
   T extends { [key: string]: any } = { [key: string]: any }
> = (
   options?: Options
) => (
   gssp?: (options: {
      ctx: GetServerSidePropsContext;
      user?: TUser | null;
      access_token?: string | null;
      refresh_token?: string | null;
   }) => Promise<GetServerSidePropsResult<T>>
) => (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<T>>;

const ROUTES_AUTH = [
   ROUTES.LOGIN,
   ROUTES.REGISTER,
   ROUTES.FORGOT_PASSWORD,
   ROUTES.RESET_PASSWORD,
];

export const withRoute: WithRoute = (options) => (gssp) => async (ctx) => {
   const { req, res } = ctx;

   let { access_token, refresh_token } = getCookies({
      req,
      res,
   });

   if ((!access_token || !refresh_token) && options?.isProtected) {
      return {
         redirect: {
            destination: ROUTES.LOGIN,
            permanent: false,
         },
      };
   }

   const user = await http_server<TUser>(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      URL_KEYS.ME
   )
      .then((r) => r?.data)
      .catch(() => null);

   if (!user && options?.isProtected) {
      return {
         redirect: {
            destination: ROUTES.LOGIN,
            permanent: false,
         },
      };
   }

   if (user && ROUTES_AUTH.includes(ctx.resolvedUrl)) {
      return {
         redirect: {
            destination: ROUTES.HOME,
            permanent: false,
         },
      };
   }

   if (user && options?.onlyAdmin && user.role !== Role.ADMIN) {
      return {
         redirect: {
            destination: ROUTES.HOME,
            permanent: false,
         },
      };
   }

   if (gssp) {
      const result = await gssp({
         ctx,
         user,
         access_token,
         refresh_token,
      });

      if ('props' in result) {
         return {
            ...result,
            props: {
               ...(result.props as Record<any, any>),
               user,
            },
         };
      }

      return result;
   }

   return {
      props: {
         user,
      },
   };
};

import { ROUTES, ROUTES_AUTH } from '@/constants';
import { http_server } from '@/libs/axios';
import { Role, TUser } from '@/types';
import { deleteCookie, getCookies, setCookie } from 'cookies-next';
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

export const withRoute: WithRoute = (options) => (gssp) => async (ctx) => {
   const { req, res } = ctx;

   const prevPath = req.headers.referer || ROUTES.DASHBOARD;

   let { access_token, refresh_token } = getCookies({
      req,
      res,
   });

   setCookie('prevPath', prevPath, {
      res,
      req,
   });

   const handleNavigateLogin = () => {
      return {
         redirect: {
            destination: ROUTES.LOGIN,
            permanent: false,
         },
      };
   };

   if ((!access_token || !refresh_token) && options?.isProtected) {
      deleteCookie('access_token', {
         res,
         req,
      });
      deleteCookie('refresh_token', {
         res,
         req,
      });
      return handleNavigateLogin();
   }

   const user = await http_server<TUser>(
      {
         accessToken: access_token as string,
         refreshToken: refresh_token as string,
      },
      '/auth/me'
   )
      .then((r) => r?.data)
      .catch(() => null);

   if (!user && options?.isProtected) {
      return handleNavigateLogin();
   }

   if (user && ROUTES_AUTH.some((r) => ctx.resolvedUrl.includes(r))) {
      return {
         redirect: {
            destination: ROUTES.DASHBOARD,
            permanent: false,
         },
      };
   }

   if (
      user &&
      options?.onlyAdmin &&
      !user.roles.some((r) => r === Role.ADMIN)
   ) {
      return {
         redirect: {
            destination: ROUTES.DASHBOARD,
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

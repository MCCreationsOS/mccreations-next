import createMiddleware from 'next-intl/middleware';
import {routing} from '../i18n/routing';
import { CustomMiddleware } from './chain';
import { NextRequest } from 'next/server';

const I18NMiddleware =  createMiddleware(routing);
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};

export function withI18n(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        return I18NMiddleware(request);
    }
}

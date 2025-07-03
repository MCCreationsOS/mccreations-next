import createMiddleware from 'next-intl/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { CustomMiddleware } from './chain'
import { routing } from '@/i18n/routing';
 
const I18nMiddleware = createMiddleware(routing)

 
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}

export function withI18nMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    return I18nMiddleware(request)
  }
}
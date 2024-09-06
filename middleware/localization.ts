import createMiddleware from 'next-intl/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { CustomMiddleware } from './chain'
import { Locales } from "@/app/api/types"
 
const I18nMiddleware = createMiddleware({
  locales: Locales,
  defaultLocale: 'en-US'
})

 
export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|monitoring).*)']
}

export function withI18nMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    return I18nMiddleware(request)
  }
}
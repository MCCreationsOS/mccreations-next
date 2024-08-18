import { createI18nMiddleware } from 'next-international/middleware'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { CustomMiddleware } from './chain'
 
const I18nMiddleware = createI18nMiddleware({
  locales: ['en-US', 'zh-CN'],
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
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
import { CustomMiddleware } from "./chain"

export function withRedirectMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
      if(request.nextUrl.pathname.startsWith("/content/")) {
        const redirectURL = new URL(request.url)
        redirectURL.pathname = `/maps/${request.nextUrl.pathname.substring(request.nextUrl.pathname.lastIndexOf("/") + 1)}`
        return NextResponse.redirect(redirectURL)
      }
      return middleware(request, event, response)
    }
  }
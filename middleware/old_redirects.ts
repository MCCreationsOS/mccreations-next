import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
import { CustomMiddleware } from "./chain"

/**
 * The old site served maps at /content/<slug>. Only that single-segment form is redirected;
 * /content/<type>/<criteria> is a current page and is left to the locale middleware.
 */
const OLD_MAP_URL = /^\/content\/([^/]+)\/?$/

export function withRedirectMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
      const match = request.nextUrl.pathname.match(OLD_MAP_URL)
      if(match) {
        const redirectURL = new URL(request.url)
        redirectURL.pathname = `/maps/${match[1]}`
        return NextResponse.redirect(redirectURL, 308)
      }
      return middleware(request, event, response)
    }
  }

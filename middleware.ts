import { chain } from "./middleware/chain"
import { withI18nMiddleware } from "./middleware/localization"
import { withRedirectMiddleware } from "./middleware/old_redirects"

export default chain([withRedirectMiddleware,withI18nMiddleware])

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|monitoring).*)']
}
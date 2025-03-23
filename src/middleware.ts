import { chain } from "./middleware/chain"
import { withI18n } from "./middleware/i18n"
import { withRedirectMiddleware } from "./middleware/old_mccreations"

export default chain([withRedirectMiddleware,withI18n])

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|monitoring).*)']
}
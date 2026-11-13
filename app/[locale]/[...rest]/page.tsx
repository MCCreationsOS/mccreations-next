import { notFound } from "next/navigation";

/** Unknown paths under a locale render the localized not-found page with a real 404 status */
export default function CatchAll() {
    notFound()
}

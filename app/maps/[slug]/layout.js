import { Suspense } from 'react'
import Loading from './loading'
 
export default function MapPageLayout({ children }) {
 return (
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
  )
}

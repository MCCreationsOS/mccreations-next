import { Suspense } from 'react'
import Loading from './loading'
import Footer from '@components/Footer'
 
export default function MapsLayout({ children }) {
 return (
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
  )
}

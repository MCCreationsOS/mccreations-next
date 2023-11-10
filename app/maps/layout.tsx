import { Suspense } from 'react'
import Loading from './loading'
import Footer from '@/components/Footer'
 
export default function MapsLayout({ children }: {children: React.ReactNode}) {
 return (
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
  )
}

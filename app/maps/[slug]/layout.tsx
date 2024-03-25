import { Suspense } from 'react'
import Loading from './loading'
import { Metadata } from 'next'
import Menu from '@/components/Menu/Menu'

 
export default function MapPageLayout({ children }: {children: React.ReactNode}) {
 return (
        <Suspense fallback={<Loading />}>
          <Menu selectedPage={"maps"}></Menu>
            {children}
        </Suspense>
  )
}

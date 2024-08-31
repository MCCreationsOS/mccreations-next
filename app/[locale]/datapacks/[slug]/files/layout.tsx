import { Suspense } from 'react'
import { Metadata } from 'next'
import Menu from '@/components/Menu/Menu'

 
export default function MapPageLayout({ children }: {children: React.ReactNode}) {
 return (
        <Suspense>
            {children}
        </Suspense>
  )
}

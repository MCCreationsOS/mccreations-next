import { Suspense } from 'react'
import { Metadata } from 'next'
import Menu from '@/components/Menu/Menu'

 
export default function DatapackPageLayout({ children }: {children: React.ReactNode}) {
 return (
        <Suspense>
          <Menu selectedPage={"datapacks"}></Menu>
            {children}
        </Suspense>
  )
}

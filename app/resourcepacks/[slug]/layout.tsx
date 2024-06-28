import { Suspense } from 'react'
import { Metadata } from 'next'
import Menu from '@/components/Menu/Menu'

 
export default function ResourcepackPageLayout({ children }: {children: React.ReactNode}) {
 return (
        <Suspense>
          <Menu selectedPage={"resourcepacks"}></Menu>
            {children}
        </Suspense>
  )
}

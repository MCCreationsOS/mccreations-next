import { Suspense } from 'react'
import { Metadata } from 'next'
import Menu from '@/components/Menu/Navbar'
import { unstable_setRequestLocale } from 'next-intl/server';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

 
export default function MapPageLayout({ children, params }: {children: React.ReactNode, params: Params}) {
  unstable_setRequestLocale(params.locale);
 return (
        <Suspense>
            {children}
        </Suspense>
  )
}
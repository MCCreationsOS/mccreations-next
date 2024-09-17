import { Suspense } from 'react'
import { Metadata } from 'next'
import Menu from '@/components/Menu/Menu'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { unstable_setRequestLocale } from 'next-intl/server';

 
export default function MapPageLayout({ children, params }: {children: React.ReactNode, params: Params}) {
  unstable_setRequestLocale(params.locale);
 return (
        <Suspense>
            {children}
        </Suspense>
  )
}
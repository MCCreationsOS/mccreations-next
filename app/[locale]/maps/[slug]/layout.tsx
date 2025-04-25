import { Suspense } from 'react'
import { Metadata } from 'next'
import Menu from '@/components/Menu/Navbar'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { unstable_setRequestLocale } from 'next-intl/server'
import { searchContent } from '@/app/api/content'
import { CollectionNames, IContentDoc, Locales } from '@/app/api/types'

export const dynamicParams = true
export const revalidate = 86_400

export async function generateStaticParams() {
  const maps = (await searchContent({ contentType: CollectionNames.Maps, limit: 300 }, false)).documents
  let mapParams = maps.map((map: IContentDoc) => ({
      slug: map.slug
  }))
  let params = []
  for (let locale of Locales) {
      for (let map of mapParams) {
          params.push({
              locale: locale,
              slug: map.slug
          })
      }
  }
  // console.log(params)
  return params
}

 
export default function MapPageLayout({ children, params }: {children: React.ReactNode, params: Params}) {
  unstable_setRequestLocale(params.locale)

 return (
        <Suspense>
            {children}
        </Suspense>
  )
}

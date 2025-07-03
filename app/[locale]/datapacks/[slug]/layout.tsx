import { Suspense } from 'react'
import { Metadata } from 'next'
import Menu from '@/components/Menu/Navbar'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { setRequestLocale } from 'next-intl/server'
import { searchContent } from '@/app/api/content'
import { CollectionNames, IContentDoc } from '@/app/api/types'
import { routing } from '@/i18n/routing'

export const dynamicParams = true
export const revalidate = 86_400

export async function generateStaticParams() {
  const maps = (await searchContent({ contentType: CollectionNames.Datapacks, limit: 300 }, false)).documents
  let mapParams = maps.map((map: IContentDoc) => ({
      slug: map.slug
  }))
  let params = []
  for (let locale of routing.locales) {
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

 
export default function DatapackPageLayout({ children, params }: {children: React.ReactNode, params: Params}) {
  setRequestLocale(params.locale)

 return (
        <Suspense>
            {children}
        </Suspense>
  )
}

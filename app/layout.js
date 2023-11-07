import { Suspense } from 'react'
import './styles/globals.css'
import Loading from './loading'
import Footer from '@components/Footer'
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <head>
        <title>MCCreations | The greatest Minecraft Maps from the Minecraft Community</title>
        <meta name="description" content="MCCreations is an unofficial fan site where you can find the latest and greatest Minecaft maps, datapacks and resourcepacks!"></meta>
        <meta property="og:title" content="MCCreations | The greatest Minecraft Maps from the Minecraft Community"></meta>
        <meta property="og:description" content="MCCreations is an unofficial fan site where you can find the latest and greatest Minecaft maps, datapacks and resourcepacks!"></meta>
        <meta property="og:image" content="https://static.wixstatic.com/media/88050d_fae65a7c6b5d4aab94aa955684b7dedf~mv2.png/"></meta>
        <meta property="og:image:width" content="2500"></meta>
        <meta property="og:image:height" content="1408"></meta>
        <meta property="og:url" content="https://www.mccreations.net"></meta>
        <meta property="og:site_name" content="MCCreations"></meta>
        <meta property="og:type" content="website"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:title" content="MCCreations | The greatest Minecraft Maps from the Minecraft Community"></meta>
        <meta name="twitter:description" content="MCCreations is an unofficial fan site where you can find the latest and greatest Minecaft maps, datapacks and resourcepacks!"></meta>
        <meta name="twitter:image" content="https://static.wixstatic.com/media/88050d_fae65a7c6b5d4aab94aa955684b7dedf~mv2.png"></meta>
      </head>
      <body id="view">
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
        <Footer></Footer>
    </body>
    </html>
  )
}

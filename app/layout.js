import { Suspense } from 'react'
import './styles/globals.css'
import Loading from './loading'
import Footer from '@components/Footer'
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
        <Footer></Footer>
    </body>
    </html>
  )
}
